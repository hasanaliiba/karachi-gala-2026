import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

type SocialRegistration = {
    id: number;
    registration_code: string;
    status: string;
    grand_total_fee: number;
    qr_token: string | null;
    payment: Payment | null;
};

function ProofUploader({ registrationId }: { registrationId: number }) {
    const { data, setData, post, processing } = useForm<{ proof: File | null }>({ proof: null });
    return (
        <div className="flex items-center gap-2">
            <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setData('proof', e.target.files?.[0] ?? null)}
            />
            <Button
                type="button"
                disabled={processing || !data.proof}
                onClick={() => post(`/social-registrations/${registrationId}/proof`, { forceFormData: true })}
            >
                {processing ? 'Uploading...' : 'Upload'}
            </Button>
        </div>
    );
}

export default function SocialRegistrationIndex({
    socialRegistrations,
}: {
    socialRegistrations: SocialRegistration[];
}) {
    return (
        <>
            <Head title="Social registrations" />
            <div className="mx-auto max-w-5xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h1 className="text-2xl font-semibold">Social registrations</h1>
                    <Link
                        href="/social-registrations/create"
                        className="rounded-md border border-cyan-400/30 px-3 py-1.5 text-sm text-cyan-300 hover:bg-cyan-500/10"
                    >
                        Register for socials
                    </Link>
                </div>
                {socialRegistrations.length === 0 && (
                    <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm text-muted-foreground">
                        No social registrations yet. Non-delegate guests can add members (CNIC, email, phone, name), pick
                        events per person, then pay — same verification flow as delegations.
                    </div>
                )}
                {socialRegistrations.map((reg) => (
                    <div key={reg.id} className="space-y-3 rounded-md border border-cyan-400/20 bg-[#13123A] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <p className="font-medium">{reg.registration_code}</p>
                                <p className="text-xs text-muted-foreground">Status: {reg.status}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-sm font-semibold">Total: PKR {reg.grand_total_fee}</p>
                                <Link href={`/social-registrations/${reg.id}`} className="text-xs text-cyan-300 underline">
                                    View
                                </Link>
                            </div>
                        </div>
                        {reg.payment?.rejection_reason && (
                            <p className="rounded border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300">
                                Rejected: {reg.payment.rejection_reason}
                            </p>
                        )}
                        {(reg.status === 'pending_payment' || reg.status === 'rejected') && (
                            <ProofUploader registrationId={reg.id} />
                        )}
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
                                        View Proof #{proof.id}
                                    </a>
                                ))}
                            </div>
                        ) : null}
                        {reg.status === 'approved' && reg.qr_token && (
                            <p className="rounded border border-cyan-400/30 bg-cyan-500/10 p-2 text-xs text-cyan-200">
                                QR Token: {reg.qr_token}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
