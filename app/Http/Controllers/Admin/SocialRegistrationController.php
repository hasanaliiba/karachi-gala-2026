<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\VerifySocialRegistrationPaymentRequest;
use App\Models\SocialRegistration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SocialRegistrationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/social-registrations/index', [
            'socialRegistrations' => SocialRegistration::query()
                ->with(['user', 'payment.proofs', 'members'])
                ->latest()
                ->get(),
        ]);
    }

    public function show(SocialRegistration $socialRegistration): Response
    {
        $socialRegistration->load(['user', 'payment.proofs', 'members']);

        return Inertia::render('admin/social-registrations/show', [
            'socialRegistration' => $socialRegistration,
        ]);
    }

    public function verify(VerifySocialRegistrationPaymentRequest $request, SocialRegistration $socialRegistration): RedirectResponse
    {
        $payment = $socialRegistration->payment;
        if (! $payment) {
            return back()->withErrors(['action' => 'Payment was not found for this registration.']);
        }

        $action = $request->validated('action');

        if ($action === 'approve') {
            $payment->update([
                'status' => 'verified',
                'rejection_reason' => null,
                'verified_by_admin_id' => auth('admin')->id(),
                'verified_at' => now(),
            ]);

            $socialRegistration->update([
                'status' => 'approved',
                'qr_token' => (string) Str::uuid(),
                'qr_generated_at' => now(),
            ]);

            return back()->with('success', 'Payment approved and QR token generated.');
        }

        $payment->update([
            'status' => 'rejected',
            'rejection_reason' => $request->validated('rejection_reason') ?: 'Payment proof rejected by admin.',
            'verified_by_admin_id' => auth('admin')->id(),
            'verified_at' => now(),
        ]);

        $socialRegistration->update([
            'status' => 'rejected',
        ]);

        return back()->with('success', 'Payment rejected.');
    }
}
