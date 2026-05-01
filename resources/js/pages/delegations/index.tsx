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

type Delegation = {
    id: number;
    delegation_code: string;
    type: string;
    status: string;
    base_fee: number;
    games_total_fee: number;
    social_total_fee: number;
    spectator_total_fee: number;
    grand_total_fee: number;
    qr_token: string | null;
    payment: Payment | null;
};

function ProofUploader({ delegationId }: { delegationId: number }) {
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
                onClick={() => post(`/delegations/${delegationId}/proof`, { forceFormData: true })}
            >
                {processing ? 'Uploading...' : 'Upload'}
            </Button>
        </div>
    );
}

export default function DelegationIndex({ delegations }: { delegations: Delegation[] }) {
    return (
        <>
            <Head title="List Delegations" />
            <div className="mx-auto max-w-5xl space-y-4">
                <h1 className="text-2xl font-semibold">List Delegations</h1>
                {delegations.length === 0 && (
                    <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm text-muted-foreground">
                        No delegations yet.
                    </div>
                )}
                {delegations.map((delegation) => (
                    <div key={delegation.id} className="space-y-3 rounded-md border border-cyan-400/20 bg-[#13123A] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <p className="font-medium">{delegation.delegation_code}</p>
                                <p className="text-xs text-muted-foreground">
                                    Type: {delegation.type} | Status: {delegation.status}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-sm font-semibold">Total: PKR {delegation.grand_total_fee}</p>
                                <Link
                                    href={`/delegations/${delegation.id}`}
                                    className="text-xs text-cyan-300 underline"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground md:grid-cols-4">
                            <div>Base: PKR {delegation.base_fee}</div>
                            <div>Games: PKR {delegation.games_total_fee}</div>
                            <div>Socials: PKR {delegation.social_total_fee}</div>
                            <div>Spectators: PKR {delegation.spectator_total_fee}</div>
                        </div>
                        {delegation.payment?.rejection_reason && (
                            <p className="rounded border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300">
                                Rejected: {delegation.payment.rejection_reason}
                            </p>
                        )}
                        {(delegation.status === 'pending_payment' || delegation.status === 'rejected') && (
                            <ProofUploader delegationId={delegation.id} />
                        )}
                        {delegation.payment?.proofs?.length ? (
                            <div className="flex flex-wrap gap-2">
                                {delegation.payment.proofs.map((proof) => (
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
                        {delegation.status === 'approved' && delegation.qr_token && (
                            <p className="rounded border border-cyan-400/30 bg-cyan-500/10 p-2 text-xs text-cyan-200">
                                QR Token: {delegation.qr_token}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

