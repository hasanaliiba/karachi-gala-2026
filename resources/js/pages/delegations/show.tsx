import { Head, Link } from '@inertiajs/react';

type PaymentProof = { id: number; file_path: string };
type Payment = { amount_due: number; status: string; rejection_reason: string | null; proofs: PaymentProof[] };
type ModuleRow = {
    id: number;
    module_id: number;
    fee_snapshot: number;
    event_datetime_snapshot: string | null;
    venue_snapshot: string | null;
    module: { id: number; name: string };
};
type Member = {
    id: number;
    member_type: 'player' | 'spectator';
    full_name: string;
    cnic: string;
    student_id: string;
    institute_name: string;
    gender: string;
    email: string;
    contact: string;
    emergency_contact: string | null;
};

type Delegation = {
    id: number;
    delegation_code: string;
    type: string;
    status: string;
    socials: string[] | null;
    base_fee: number;
    games_total_fee: number;
    social_total_fee: number;
    spectator_total_fee: number;
    grand_total_fee: number;
    qr_token: string | null;
    modules: ModuleRow[];
    members: Member[];
    payment: Payment | null;
};

export default function DelegationShow({ delegation }: { delegation: Delegation }) {
    const players = delegation.members.filter((m) => m.member_type === 'player');
    const spectators = delegation.members.filter((m) => m.member_type === 'spectator');

    return (
        <>
            <Head title={`Delegation ${delegation.delegation_code}`} />
            <div className="mx-auto max-w-5xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{delegation.delegation_code}</h1>
                    <Link href="/delegations" className="text-sm text-cyan-300 underline">Back to list</Link>
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p>Type: {delegation.type}</p>
                    <p>Status: {delegation.status}</p>
                    <p>Socials: {(delegation.socials ?? []).join(', ') || 'None'}</p>
                    {delegation.qr_token && <p>QR Token: {delegation.qr_token}</p>}
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p className="mb-2 font-medium">Games</p>
                    {delegation.modules.map((row) => (
                        <div key={row.id} className="mb-2 border-b border-cyan-400/10 pb-2 last:border-0">
                            <p>{row.module?.name ?? `Module #${row.module_id}`} — PKR {row.fee_snapshot}</p>
                            <p className="text-xs text-muted-foreground">
                                {row.venue_snapshot || 'Venue TBD'} | {row.event_datetime_snapshot ? new Date(row.event_datetime_snapshot).toLocaleString() : 'Time TBD'}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p className="mb-2 font-medium">Players ({players.length})</p>
                    {players.map((member) => (
                        <p key={member.id}>{member.full_name} — {member.cnic} — {member.institute_name}</p>
                    ))}
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p className="mb-2 font-medium">Spectators ({spectators.length})</p>
                    {spectators.length ? spectators.map((member) => (
                        <p key={member.id}>{member.full_name} — {member.cnic} — {member.institute_name}</p>
                    )) : <p className="text-muted-foreground">No spectators.</p>}
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] p-4 text-sm">
                    <p>Base: PKR {delegation.base_fee}</p>
                    <p>Games: PKR {delegation.games_total_fee}</p>
                    <p>Socials: PKR {delegation.social_total_fee}</p>
                    <p>Spectators: PKR {delegation.spectator_total_fee}</p>
                    <p className="mt-1 font-semibold">Total: PKR {delegation.grand_total_fee}</p>
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

