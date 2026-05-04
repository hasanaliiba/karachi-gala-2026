<?php

namespace App\Http\Controllers;

use App\Http\Requests\SocialRegistration\StoreSocialRegistrationRequest;
use App\Models\Payment;
use App\Models\PaymentProof;
use App\Models\Setting;
use App\Models\SocialRegistration;
use App\Models\SocialRegistrationMember;
use App\Support\SocialPricing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SocialRegistrationController extends Controller
{
    public function index(): Response
    {
        if (! Schema::hasTable('social_registrations')) {
            return Inertia::render('social-registrations/index', [
                'socialRegistrations' => [],
            ]);
        }

        $socialRegistrations = SocialRegistration::query()
            ->where('user_id', auth()->id())
            ->with(['payment.proofs', 'members'])
            ->latest()
            ->get();

        return Inertia::render('social-registrations/index', [
            'socialRegistrations' => $socialRegistrations,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('social-registrations/create', [
            'earlyBirdEnabled' => filter_var(Setting::get('early_bird_enabled', '0'), FILTER_VALIDATE_BOOLEAN),
            'registrationDiscountPercent' => max(
                0,
                min(100, (int) Setting::get('registration_discount_percent', '25'))
            ),
            'socialPricing' => [
                SocialPricing::QAWALI_NIGHT => SocialPricing::outsiderPkr(SocialPricing::QAWALI_NIGHT),
                SocialPricing::BEACH_PARTY => SocialPricing::outsiderPkr(SocialPricing::BEACH_PARTY),
            ],
        ]);
    }

    public function show(SocialRegistration $socialRegistration): Response
    {
        abort_unless($socialRegistration->user_id === auth()->id(), 403);

        $socialRegistration->load(['payment.proofs', 'members']);

        return Inertia::render('social-registrations/show', [
            'socialRegistration' => $socialRegistration,
        ]);
    }

    public function store(StoreSocialRegistrationRequest $request): RedirectResponse
    {
        if (! Schema::hasTable('social_registrations')) {
            return back()->withErrors(['social_registration' => 'Social registrations are not available yet.']);
        }

        $members = collect($request->validated()['members']);

        $grandTotal = $members->sum(function (array $member) {
            $gross = SocialPricing::outsiderSelectionTotalPkr($member['social_selections']);

            return $this->applyRegistrationDiscountToBaseOrSocial($gross);
        });

        DB::transaction(function () use ($members, $grandTotal) {
            $registration = SocialRegistration::create([
                'user_id' => auth()->id(),
                'registration_code' => 'KGL-SOC-'.strtoupper(Str::random(8)),
                'grand_total_fee' => $grandTotal,
                'status' => 'pending_payment',
            ]);

            foreach ($members as $memberData) {
                $selections = array_values(array_unique($memberData['social_selections']));
                $gross = SocialPricing::outsiderSelectionTotalPkr($selections);
                $lineTotal = $this->applyRegistrationDiscountToBaseOrSocial($gross);

                SocialRegistrationMember::create([
                    'social_registration_id' => $registration->id,
                    'full_name' => $memberData['full_name'],
                    'cnic' => $memberData['cnic'],
                    'email' => $memberData['email'],
                    'phone' => $memberData['phone'],
                    'social_selections' => $selections,
                    'line_total_fee' => $lineTotal,
                ]);
            }

            Payment::create([
                'delegation_id' => null,
                'social_registration_id' => $registration->id,
                'amount_due' => $grandTotal,
                'status' => 'pending',
            ]);
        });

        return redirect()->route('social-registrations.index')->with('success', 'Social registration created. Upload payment proof to continue.');
    }

    public function uploadProof(Request $request, SocialRegistration $socialRegistration): RedirectResponse
    {
        if (! Schema::hasTable('payment_proofs')) {
            return back()->withErrors(['proof' => 'Payments module is not ready yet. Please run migrations.']);
        }

        abort_unless($socialRegistration->user_id === auth()->id(), 403);

        $validated = $request->validate([
            'proof' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
        ]);

        $payment = $socialRegistration->payment;
        if (! $payment) {
            return back()->withErrors(['proof' => 'Payment record was not found for this registration.']);
        }

        $file = $validated['proof'];
        $path = $file->store('payment-proofs', 'public');

        PaymentProof::create([
            'payment_id' => $payment->id,
            'file_path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType() ?? 'application/octet-stream',
            'size' => $file->getSize(),
        ]);

        $payment->update([
            'status' => 'pending',
            'rejection_reason' => null,
        ]);

        $socialRegistration->update([
            'status' => 'pending_verification',
        ]);

        return back()->with('success', 'Payment proof uploaded. Waiting for admin verification.');
    }

    private function registrationDiscountPercent(): int
    {
        return max(0, min(100, (int) Setting::get('registration_discount_percent', '25')));
    }

    private function registrationDiscountAppliesToBaseAndSocials(): bool
    {
        $earlyBird = filter_var(Setting::get('early_bird_enabled', '0'), FILTER_VALIDATE_BOOLEAN);

        return $earlyBird && $this->registrationDiscountPercent() > 0;
    }

    private function applyRegistrationDiscountToBaseOrSocial(int $grossPkr): int
    {
        if (! $this->registrationDiscountAppliesToBaseAndSocials()) {
            return $grossPkr;
        }

        $p = $this->registrationDiscountPercent();

        return (int) round($grossPkr * (100 - $p) / 100);
    }
}
