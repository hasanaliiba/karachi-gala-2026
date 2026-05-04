import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type User = {
    id: number;
    name: string;
    email: string;
};

type PaymentProof = {
    id: number;
    file_path: string;
};

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
};

type SocialRegistration = {
    id: number;
    registration_code: string;
    status: string;
    grand_total_fee: number;
    user: User;
    payment: Payment | null;
    members: Member[];
};

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

export default function AdminSocialRegistrationsIndex({
    socialRegistrations,
}: {
    socialRegistrations: SocialRegistration[];
}) {
    return (
        <>
            <Head title="Social registrations" />
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">Social registrations (non-delegate)</h1>
                {socialRegistrations.length === 0 && (
                    <p className="text-sm text-muted-foreground">No social registrations yet.</p>
                )}
                {socialRegistrations.map((reg) => (
                    <div key={reg.id} className="space-y-3 rounded-md border border-cyan-400/20 bg-[#13123A] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <p className="font-medium">{reg.registration_code}</p>
                                <p className="text-xs text-muted-foreground">
                                    {reg.user.name} ({reg.user.email}) · {reg.members.length} member(s) · {reg.status}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-sm font-semibold">
                                    Amount due: PKR {reg.payment?.amount_due ?? reg.grand_total_fee}
                                </p>
                                <Link href={`/admin/social-registrations/${reg.id}`} className="text-xs text-cyan-300 underline">
                                    View
                                </Link>
                            </div>
                        </div>
                        {reg.payment?.proofs?.length ? (
                            <div className="flex flex-wrap gap-2">
                                {reg.payment.proofs.map((proof) => (
                                    <a
                                        key={proof.id}
                                        href={`/storage/${proof.file_path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-cyan-300 underline"
                                    >
                                        Open proof #{proof.id}
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-yellow-300">No proof uploaded yet.</p>
                        )}
                        <VerifyActions registrationId={reg.id} />
                        {reg.payment?.rejection_reason && (
                            <p className="text-xs text-red-300">Last rejection: {reg.payment.rejection_reason}</p>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
