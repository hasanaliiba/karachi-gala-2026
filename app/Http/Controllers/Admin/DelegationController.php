<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\VerifyDelegationPaymentRequest;
use App\Models\Delegation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DelegationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/delegations/index', [
            'delegations' => Delegation::query()
                ->with(['user', 'payment.proofs', 'modules.module', 'members'])
                ->latest()
                ->get(),
        ]);
    }

    public function verify(VerifyDelegationPaymentRequest $request, Delegation $delegation): RedirectResponse
    {
        $payment = $delegation->payment;
        if (! $payment) {
            return back()->withErrors(['action' => 'Payment was not found for this delegation.']);
        }

        $action = $request->validated('action');

        if ($action === 'approve') {
            $payment->update([
                'status' => 'verified',
                'rejection_reason' => null,
                'verified_by_admin_id' => auth('admin')->id(),
                'verified_at' => now(),
            ]);

            $delegation->update([
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

        $delegation->update([
            'status' => 'rejected',
        ]);

        return back()->with('success', 'Payment rejected.');
    }

    public function show(Delegation $delegation): Response
    {
        $delegation->load(['user', 'payment.proofs', 'modules.module', 'members']);

        return Inertia::render('admin/delegations/show', [
            'delegation' => $delegation,
        ]);
    }
}

