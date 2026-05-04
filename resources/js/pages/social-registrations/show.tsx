import { Head, Link } from '@inertiajs/react';

type PaymentProof = { id: number; file_path: string };
type Payment = { amount_due: number; status: string; rejection_reason: string | null; proofs: PaymentProof[] };

type Member = {
    id: number;
    full_name: string;
    cnic: string;
    email: string;
    phone: string;
    social_selections: string[] | null;
    line_total_fee: number;
};

type SocialRegistration = {
    id: number;
    registration_code: string;
    status: string;
    grand_total_fee: number;
    qr_token: string | null;
    members: Member[];
    payment: Payment | null;
};

function labelSocial(s: string): string {
    if (s === 'beach_party') return 'Beach Party';
    if (s === 'qawali_night') return 'Qawali Night';
    return s;
}

export default function SocialRegistrationShow({ socialRegistration }: { socialRegistration: SocialRegistration }) {
    return (
        <>
            <Head title={`Social ${socialRegistration.registration_code}`} />
            <div className="mx-auto max-w-5xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{socialRegistration.registration_code}</h1>
                    <Link href="/social-registrations" className="text-sm text-cyan-300 underline">
                        Back to list
                    </Link>
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p>Status: {socialRegistration.status}</p>
                    {socialRegistration.qr_token && <p className="mt-1">QR Token: {socialRegistration.qr_token}</p>}
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p className="mb-2 font-medium">Members ({socialRegistration.members.length})</p>
                    {socialRegistration.members.map((m) => (
                        <div key={m.id} className="mb-3 border-b border-cyan-400/10 pb-3 last:mb-0 last:border-0">
                            <p className="font-medium text-cyan-100">{m.full_name}</p>
                            <p className="text-xs text-muted-foreground">
                                CNIC {m.cnic} · {m.email} · {m.phone}
                            </p>
                            <p className="mt-1 text-xs">
                                Events: {(m.social_selections ?? []).map(labelSocial).join(', ') || '—'} · Line total: PKR{' '}
                                {m.line_total_fee}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p className="font-semibold">Total: PKR {socialRegistration.grand_total_fee}</p>
                    {socialRegistration.payment && (
                        <>
                            <p className="mt-2">Payment status: {socialRegistration.payment.status}</p>
                            {socialRegistration.payment.rejection_reason && (
                                <p className="text-red-300">Rejection: {socialRegistration.payment.rejection_reason}</p>
                            )}
                            <div className="mt-2 flex gap-2">
                                {socialRegistration.payment.proofs.map((proof) => (
                                    <a
                                        key={proof.id}
                                        href={`/storage/${proof.file_path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-cyan-300 underline"
                                    >
                                        Proof #{proof.id}
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
