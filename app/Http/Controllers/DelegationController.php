<?php

namespace App\Http\Controllers;

use App\Http\Requests\Delegation\StoreDelegationRequest;
use App\Models\Delegation;
use App\Models\DelegationMember;
use App\Models\DelegationMemberModule;
use App\Models\DelegationModule;
use App\Models\Module;
use App\Models\Payment;
use App\Models\PaymentProof;
use App\Models\Setting;
use App\Support\SocialPricing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DelegationController extends Controller
{
    public function index(): Response
    {
        if (! Schema::hasTable('delegations')) {
            return Inertia::render('delegations/index', [
                'delegations' => [],
            ]);
        }

        $delegations = Delegation::query()
            ->where('user_id', auth()->id())
            ->with(['payment.proofs', 'modules.module', 'members'])
            ->latest()
            ->get();

        return Inertia::render('delegations/index', [
            'delegations' => $delegations,
        ]);
    }

    public function create(): Response
    {
        if (! Schema::hasTable('modules')) {
            return Inertia::render('delegations/create', [
                'modules' => [],
                'earlyBirdEnabled' => filter_var(Setting::get('early_bird_enabled', '0'), FILTER_VALIDATE_BOOLEAN),
                'registrationDiscountPercent' => max(
                    0,
                    min(100, (int) Setting::get('registration_discount_percent', '25'))
                ),
                'socialPricing' => [
                    SocialPricing::QAWALI_NIGHT => SocialPricing::delegatePkr(SocialPricing::QAWALI_NIGHT),
                    SocialPricing::BEACH_PARTY => SocialPricing::delegatePkr(SocialPricing::BEACH_PARTY),
                ],
            ]);
        }

        return Inertia::render('delegations/create', [
            'modules' => Module::orderBy('sort_order')->get(),
            'earlyBirdEnabled' => filter_var(Setting::get('early_bird_enabled', '0'), FILTER_VALIDATE_BOOLEAN),
            'registrationDiscountPercent' => max(
                0,
                min(100, (int) Setting::get('registration_discount_percent', '25'))
            ),
            'socialPricing' => [
                SocialPricing::QAWALI_NIGHT => SocialPricing::delegatePkr(SocialPricing::QAWALI_NIGHT),
                SocialPricing::BEACH_PARTY => SocialPricing::delegatePkr(SocialPricing::BEACH_PARTY),
            ],
        ]);
    }

    public function show(Delegation $delegation): Response
    {
        abort_unless($delegation->user_id === auth()->id(), 403);

        $delegation->load(['payment.proofs', 'modules.module', 'members']);

        return Inertia::render('delegations/show', [
            'delegation' => $delegation,
        ]);
    }

    public function store(StoreDelegationRequest $request): RedirectResponse
    {
        if (! Schema::hasTable('delegations')) {
            return back()->withErrors(['delegation' => 'Delegations module is not ready yet. Please run migrations.']);
        }

        $data = $request->validated();
        $moduleIds = collect($data['module_ids'])->map(fn ($id) => (int) $id)->values();
        $modules = Module::query()->whereIn('id', $moduleIds)->get()->keyBy('id');

        if ($moduleIds->count() !== $modules->count()) {
            return back()->withErrors(['module_ids' => 'One or more selected games are invalid.']);
        }

        $members = collect($data['members']);
        $spectators = collect($data['spectators'] ?? []);

        $type = $members->count() > 1 ? 'group' : 'individual';

        foreach ($moduleIds as $moduleId) {
            $required = max(1, (int) ($modules[$moduleId]->team_size ?? 1));
            $assigned = $members->filter(function (array $member) use ($moduleId) {
                return in_array((int) $moduleId, array_map('intval', $member['module_ids'] ?? []), true);
            })->count();
            if ($assigned < $required) {
                return back()->withErrors([
                    'members' => "Module {$modules[$moduleId]->name} requires at least {$required} player(s) assigned.",
                ]);
            }
        }

        foreach ($members as $index => $member) {
            $selectedForMember = collect($member['module_ids'] ?? [])->map(fn ($id) => (int) $id)->unique()->values();
            if ($selectedForMember->count() < 1 || $selectedForMember->count() > 2) {
                return back()->withErrors(["members.{$index}.module_ids" => 'Each member must have 1 to 2 games.']);
            }

            if ($selectedForMember->diff($moduleIds)->isNotEmpty()) {
                return back()->withErrors(["members.{$index}.module_ids" => 'Member games must be selected from chosen games.']);
            }

            $existingGames = $this->existingGamesCountForCnic($member['cnic']);
            if ($existingGames + $selectedForMember->count() > 2) {
                return back()->withErrors(["members.{$index}.cnic" => 'This CNIC already reached the 2-game limit.']);
            }
        }

        $baseGross = $type === 'individual' ? 1000 : 3000;
        $gamesTotalFee = $modules->sum(fn (Module $module) => $this->moduleFee($module));
        $socialGross = $members->sum(function (array $member) {
            return SocialPricing::delegateSelectionTotalPkr($member['social_selections'] ?? []);
        });
        $socials = $members
            ->flatMap(fn (array $member) => $member['social_selections'] ?? [])
            ->unique()
            ->values()
            ->all();
        $baseFee = $this->applyRegistrationDiscountToBaseOrSocial($baseGross);
        $socialTotalFee = $this->applyRegistrationDiscountToBaseOrSocial($socialGross);
        $spectatorTotalFee = $spectators->count() * 500;
        $grandTotal = $baseFee + $gamesTotalFee + $socialTotalFee + $spectatorTotalFee;

        DB::transaction(function () use (
            $type,
            $socials,
            $members,
            $spectators,
            $modules,
            $baseFee,
            $gamesTotalFee,
            $socialTotalFee,
            $spectatorTotalFee,
            $grandTotal
        ) {
            $delegation = Delegation::create([
                'user_id' => auth()->id(),
                'delegation_code' => 'KGL-'.strtoupper(Str::random(8)),
                'type' => $type,
                'socials' => $socials,
                'spectator_count' => $spectators->count(),
                'undertaking_accepted' => true,
                'base_fee' => $baseFee,
                'games_total_fee' => $gamesTotalFee,
                'social_total_fee' => $socialTotalFee,
                'spectator_total_fee' => $spectatorTotalFee,
                'grand_total_fee' => $grandTotal,
                'status' => 'pending_payment',
            ]);

            foreach ($modules as $module) {
                DelegationModule::create([
                    'delegation_id' => $delegation->id,
                    'module_id' => $module->id,
                    'fee_snapshot' => $this->moduleFee($module),
                    'event_datetime_snapshot' => $module->event_datetime,
                    'venue_snapshot' => $module->venue,
                ]);
            }

            foreach ($members as $memberData) {
                $member = DelegationMember::create([
                    'delegation_id' => $delegation->id,
                    'member_type' => 'player',
                    'full_name' => $memberData['full_name'],
                    'cnic' => $memberData['cnic'],
                    'student_id' => $memberData['student_id'],
                    'institute_name' => $memberData['institute_name'],
                    'gender' => $memberData['gender'],
                    'email' => $memberData['email'],
                    'contact' => $memberData['contact'],
                    'emergency_contact' => $memberData['emergency_contact'] ?? null,
                    'social_selections' => array_values(array_unique($memberData['social_selections'] ?? [])),
                ]);

                foreach ($memberData['module_ids'] as $moduleId) {
                    DelegationMemberModule::create([
                        'delegation_member_id' => $member->id,
                        'module_id' => (int) $moduleId,
                    ]);
                }
            }

            foreach ($spectators as $spectatorData) {
                DelegationMember::create([
                    'delegation_id' => $delegation->id,
                    'member_type' => 'spectator',
                    'full_name' => $spectatorData['full_name'],
                    'cnic' => $spectatorData['cnic'],
                    'student_id' => $spectatorData['student_id'],
                    'institute_name' => $spectatorData['institute_name'],
                    'gender' => $spectatorData['gender'],
                    'email' => $spectatorData['email'],
                    'contact' => $spectatorData['contact'],
                    'emergency_contact' => $spectatorData['emergency_contact'] ?? null,
                ]);
            }

            Payment::create([
                'delegation_id' => $delegation->id,
                'amount_due' => $grandTotal,
                'status' => 'pending',
            ]);
        });

        return redirect()->route('delegations.index')->with('success', 'Delegation created. Upload payment proof to continue.');
    }

    public function uploadProof(Request $request, Delegation $delegation): RedirectResponse
    {
        if (! Schema::hasTable('payment_proofs')) {
            return back()->withErrors(['proof' => 'Payments module is not ready yet. Please run migrations.']);
        }

        abort_unless($delegation->user_id === auth()->id(), 403);

        $validated = $request->validate([
            'proof' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
        ]);

        $payment = $delegation->payment;
        if (! $payment) {
            return back()->withErrors(['proof' => 'Payment record was not found for this delegation.']);
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

        $delegation->update([
            'status' => 'pending_verification',
        ]);

        return back()->with('success', 'Payment proof uploaded. Waiting for admin verification.');
    }

    private function existingGamesCountForCnic(string $cnic): int
    {
        return DelegationMemberModule::query()
            ->whereHas('member', function ($query) use ($cnic) {
                $query->where('cnic', $cnic)
                    ->where('member_type', 'player')
                    ->whereHas('delegation', function ($delegationQuery) {
                        $delegationQuery->whereIn('status', ['pending_payment', 'pending_verification', 'approved']);
                    });
            })
            ->count();
    }

    private function moduleFee(Module $module): int
    {
        $earlyBirdEnabled = filter_var(Setting::get('early_bird_enabled', '0'), FILTER_VALIDATE_BOOLEAN);
        $rawPrice = $earlyBirdEnabled ? ($module->early_bird_price ?? $module->normal_price) : $module->normal_price;
        $digits = preg_replace('/\D+/', '', (string) $rawPrice) ?? '';

        return (int) $digits;
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

    /** Percent off base (individual/group) and social (beach) fees only — not games/modules or spectators. */
    private function applyRegistrationDiscountToBaseOrSocial(int $grossPkr): int
    {
        if (! $this->registrationDiscountAppliesToBaseAndSocials()) {
            return $grossPkr;
        }

        $p = $this->registrationDiscountPercent();

        return (int) round($grossPkr * (100 - $p) / 100);
    }
}
