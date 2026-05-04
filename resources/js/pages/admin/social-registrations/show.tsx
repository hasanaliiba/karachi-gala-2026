import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type User = {
    id: number;
    name: string;
    email: string;
};

type PaymentProof = { id: number; file_path: string };
type Payment = {
    id: number;
    amount_due: number;
    status: string;
    rejection_reason: string | null;
    proofs: PaymentProof[];
};

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
    user: User;
    members: Member[];
    payment: Payment | null;
};

function labelSocial(s: string): string {
    if (s === 'beach_party') return 'Beach Party';
    if (s === 'qawali_night') return 'Qawali Night';
    return s;
}

function VerifyActions({ registrationId }: { registrationId: number }) {
    const { data, setData, post, processing } = useForm<{ action: 'approve' | 'reject'; rejection_reason: string }>({
        action: 'approve',
        rejection_reason: '',
    });

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button
                type="button"
                disabled={processing}
                onClick={() => {
                    setData('action', 'approve');
                    post(`/admin/social-registrations/${registrationId}/verify`);
                }}
            >
                Approve
            </Button>
            <Input
                placeholder="Rejection reason"
                value={data.rejection_reason}
                onChange={(e) => setData('rejection_reason', e.target.value)}
                className="max-w-xs"
            />
            <Button
                type="button"
                variant="outline"
                disabled={processing}
                onClick={() => {
                    setData('action', 'reject');
                    post(`/admin/social-registrations/${registrationId}/verify`);
                }}
            >
                Reject
            </Button>
        </div>
    );
}

export default function AdminSocialRegistrationShow({
    socialRegistration,
}: {
    socialRegistration: SocialRegistration;
}) {
    return (
        <>
            <Head title={socialRegistration.registration_code} />
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h1 className="text-2xl font-semibold">{socialRegistration.registration_code}</h1>
                    <Link href="/admin/social-registrations" className="text-sm text-cyan-300 underline">
                        Back to list
                    </Link>
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p>
                        Account: {socialRegistration.user.name} ({socialRegistration.user.email})
                    </p>
                    <p className="mt-1">Status: {socialRegistration.status}</p>
                    <p className="mt-1 font-semibold">Total: PKR {socialRegistration.grand_total_fee}</p>
                    {socialRegistration.qr_token && <p className="mt-1 text-xs">QR: {socialRegistration.qr_token}</p>}
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p className="mb-2 font-medium">Members</p>
                    {socialRegistration.members.map((m) => (
                        <div key={m.id} className="mb-3 border-b border-cyan-400/10 pb-3 last:mb-0 last:border-0">
                            <p className="font-medium">{m.full_name}</p>
                            <p className="text-xs text-muted-foreground">
                                {m.cnic} · {m.email} · {m.phone}
                            </p>
                            <p className="mt-1 text-xs">
                                {(m.social_selections ?? []).map(labelSocial).join(', ') || '—'} · PKR {m.line_total_fee}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p className="mb-2 font-medium">Payment</p>
                    {socialRegistration.payment ? (
                        <>
                            <p>Status: {socialRegistration.payment.status}</p>
                            <p>Due: PKR {socialRegistration.payment.amount_due}</p>
                            {socialRegistration.payment.rejection_reason && (
                                <p className="text-red-300">Rejection: {socialRegistration.payment.rejection_reason}</p>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2">
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
                    ) : (
                        <p className="text-muted-foreground">No payment record.</p>
                    )}
                </div>

                <VerifyActions registrationId={socialRegistration.id} />
            </div>
        </>
    );
}
