import { Head, Link } from '@inertiajs/react';

type PaymentProof = { id: number; file_path: string };
type Payment = { amount_due: number; status: string; rejection_reason: string | null; proofs: PaymentProof[] };
type ModuleRow = { id: number; fee_snapshot: number; module: { name: string } };
type Member = {
    id: number;
    member_type: 'player' | 'spectator';
    full_name: string;
    cnic: string;
    institute_name: string;
    social_selections?: string[] | null;
};
type Delegation = {
    id: number;
    delegation_code: string;
    type: string;
    status: string;
    socials: string[] | null;
    grand_total_fee: number;
    user: { name: string; email: string };
    modules: ModuleRow[];
    members: Member[];
    payment: Payment | null;
    qr_token: string | null;
};

export default function AdminDelegationShow({ delegation }: { delegation: Delegation }) {
    const players = delegation.members.filter((m) => m.member_type === 'player');
    const spectators = delegation.members.filter((m) => m.member_type === 'spectator');

    return (
        <>
            <Head title={`Delegation ${delegation.delegation_code}`} />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{delegation.delegation_code}</h1>
                    <Link href="/admin/delegations" className="text-sm text-cyan-300 underline">Back to admin list</Link>
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p>Submitted by: {delegation.user.name} ({delegation.user.email})</p>
                    <p>Type: {delegation.type}</p>
                    <p>Status: {delegation.status}</p>
                    <p>Socials: {(delegation.socials ?? []).join(', ') || 'None'}</p>
                    {delegation.qr_token && <p>QR Token: {delegation.qr_token}</p>}
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p className="mb-2 font-medium">Games</p>
                    {delegation.modules.map((row) => (
                        <p key={row.id}>{row.module?.name ?? 'Game'} — PKR {row.fee_snapshot}</p>
                    ))}
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p className="mb-2 font-medium">Players ({players.length})</p>
                    {players.map((member) => (
                        <div key={member.id} className="mb-2 border-b border-cyan-400/10 pb-2 last:border-0">
                            <p>
                                {member.full_name} — {member.cnic} — {member.institute_name}
                            </p>
                            {(member.social_selections?.length ?? 0) > 0 && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Socials:{' '}
                                    {(member.social_selections ?? [])
                                        .map((s) =>
                                            s === 'beach_party' ? 'Beach Party' : s === 'qawali_night' ? 'Qawali Night' : s,
                                        )
                                        .join(', ')}
                                </p>
                            )}
                        </div>
                    ))}
                    <p className="mt-3 mb-2 font-medium">Spectators ({spectators.length})</p>
                    {spectators.length ? spectators.map((member) => (
                        <p key={member.id}>{member.full_name} — {member.cnic} — {member.institute_name}</p>
                    )) : <p className="text-muted-foreground">No spectators.</p>}
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p className="font-semibold">Total: PKR {delegation.grand_total_fee}</p>
                    {delegation.payment && (
                        <>
                            <p className="mt-2">Payment Status: {delegation.payment.status}</p>
                            {delegation.payment.rejection_reason && <p className="text-red-300">Rejection: {delegation.payment.rejection_reason}</p>}
                            <div className="mt-2 flex gap-2">
                                {delegation.payment.proofs.map((proof) => (
                                    <a key={proof.id} href={`/storage/${proof.file_path}`} target="_blank" rel="noreferrer" className="text-cyan-300 underline">
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

