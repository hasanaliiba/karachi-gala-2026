/**
 * Placeholder banking details shown during checkout and on registration list/detail pages
 * while payment is not finalized.
 */
export const PAYMENT_INSTRUCTION_ROWS: { k: string; v: string }[] = [
    { k: 'Account title', v: 'KGL Events Committee (sample)' },
    { k: 'Bank', v: 'Sample Bank Ltd.' },
    { k: 'Account number', v: '0123 4567 8901' },
    { k: 'Bank account number (intl.)', v: 'PK00XXXX0000000000000' },
    { k: 'Mobile wallets', v: 'EasyPaisa / JazzCash — 0300-0000000 (placeholder)' },
    { k: 'Reference', v: 'Use your registration code in the transfer note.' },
];

type PaymentInstructionsCardProps = {
    /** Shown under the heading; defaults for list/detail when omitted */
    intro?: string;
};

export function PaymentInstructionsCard({ intro }: PaymentInstructionsCardProps) {
    return (
        <div className="rounded-md border border-cyan-400/25 bg-[#13123A]/90 p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Payment details</p>
            <p className="mb-4 text-xs text-muted-foreground">
                {intro ??
                    'Pay the amount due using the details below. Dummy values for now — replace with live banking info before launch.'}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_INSTRUCTION_ROWS.map(({ k, v }) => (
                    <div key={k} className="border-b border-cyan-400/10 pb-3 last:border-0 sm:last:border-b">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{k}</p>
                        <p className="mt-1 text-xs text-foreground">{v}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Show bank instructions while payment is still in progress (not yet approved). */
export function shouldShowPendingPaymentInstructions(registrationStatus: string): boolean {
    return ['pending_payment', 'pending_verification', 'rejected'].includes(registrationStatus);
}
