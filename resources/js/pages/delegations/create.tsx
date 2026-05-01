import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { publicMediaUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Module = {
    id: number;
    name: string;
    normal_price: string | null;
    early_bird_price: string | null;
    intro?: string;
    image_path?: string | null;
    rules?: string;
    venue: string | null;
    team_size: number;
};

type Person = {
    full_name: string;
    cnic: string;
    student_id: string;
    institute_name: string;
    gender: string;
    email: string;
    contact: string;
    emergency_contact: string;
    module_ids: number[];
};

type Spectator = Omit<Person, 'module_ids'>;

type FormData = {
    type: 'individual' | 'group';
    module_ids: number[];
    socials: string[];
    spectators: Spectator[];
    members: Person[];
    undertaking_accepted: boolean;
};

const steps = [
    'Game Selection',
    'Members & Details',
    'Select Socials',
    'Add Spectators',
    'Cart Review',
    'Payment Status',
];

function formatCnic(value: string): string {
    const digits = value.replace(/\D+/g, '').slice(0, 13);
    const p1 = digits.slice(0, 5);
    const p2 = digits.slice(5, 12);
    const p3 = digits.slice(12, 13);
    if (!p2) return p1;
    if (!p3) return `${p1}-${p2}`;
    return `${p1}-${p2}-${p3}`;
}

const emptyMember: Person = {
    full_name: '',
    cnic: '',
    student_id: '',
    institute_name: '',
    gender: '',
    email: '',
    contact: '',
    emergency_contact: '',
    module_ids: [],
};

const emptySpectator: Spectator = {
    full_name: '',
    cnic: '',
    student_id: '',
    institute_name: '',
    gender: '',
    email: '',
    contact: '',
    emergency_contact: '',
};

function toFee(value: string | null): number {
    const digits = (value ?? '').replace(/\D+/g, '');
    return Number(digits || '0');
}

function moduleGameFee(m: Module, earlyBirdEnabled: boolean): number {
    const raw = earlyBirdEnabled ? (m.early_bird_price ?? m.normal_price) : m.normal_price;
    return toFee(raw);
}

function applyRegistrationDiscount(gross: number, earlyBirdEnabled: boolean, percent: number): number {
    if (!earlyBirdEnabled || percent <= 0) {
        return gross;
    }
    return Math.round((gross * (100 - percent)) / 100);
}

function PersonFields({
    value,
    onChange,
    selectedModuleIds,
    modules,
}: {
    value: Person;
    onChange: (next: Person) => void;
    selectedModuleIds: number[];
    modules: Module[];
}) {
    return (
        <div className="grid gap-3 rounded-md border border-cyan-400/20 bg-[#13123A] p-4">
            <Input placeholder="Full Name" value={value.full_name} onChange={(e) => onChange({ ...value, full_name: e.target.value })} />
            <Input
                placeholder="CNIC (42201-0098341-1)"
                value={value.cnic}
                pattern="\d{5}-\d{7}-\d{1}"
                maxLength={15}
                onChange={(e) => onChange({ ...value, cnic: formatCnic(e.target.value) })}
            />
            <Input placeholder="Student ID" value={value.student_id} onChange={(e) => onChange({ ...value, student_id: e.target.value })} />
            <Input placeholder="Institute Name" value={value.institute_name} onChange={(e) => onChange({ ...value, institute_name: e.target.value })} />
            <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={value.gender}
                onChange={(e) => onChange({ ...value, gender: e.target.value })}
            >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <Input placeholder="Email" type="email" value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} />
            <Input placeholder="Contact" value={value.contact} onChange={(e) => onChange({ ...value, contact: e.target.value })} />
            <Input placeholder="Emergency Contact (optional)" value={value.emergency_contact} onChange={(e) => onChange({ ...value, emergency_contact: e.target.value })} />
            <div className="grid gap-2">
                <Label>Assign Games (max 2)</Label>
                <div className="flex flex-wrap gap-2">
                    {selectedModuleIds.map((id) => {
                        const checked = value.module_ids.includes(id);
                        const module = modules.find((m) => m.id === id);
                        return (
                            <label key={id} className="inline-flex items-center gap-2 rounded border border-cyan-400/20 px-2 py-1 text-xs">
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                        const next = checked
                                            ? value.module_ids.filter((v) => v !== id)
                                            : [...value.module_ids, id].slice(0, 2);
                                        onChange({ ...value, module_ids: next });
                                    }}
                                />
                                {module?.name ?? `Game ${id}`}
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function SpectatorFields({
    value,
    onChange,
}: {
    value: Spectator;
    onChange: (next: Spectator) => void;
}) {
    return (
        <div className="grid gap-3 rounded-md border border-cyan-400/20 bg-[#13123A] p-4">
            <Input placeholder="Full Name" value={value.full_name} onChange={(e) => onChange({ ...value, full_name: e.target.value })} />
            <Input
                placeholder="CNIC (42201-0098341-1)"
                value={value.cnic}
                pattern="\d{5}-\d{7}-\d{1}"
                maxLength={15}
                onChange={(e) => onChange({ ...value, cnic: formatCnic(e.target.value) })}
            />
            <Input placeholder="Student ID" value={value.student_id} onChange={(e) => onChange({ ...value, student_id: e.target.value })} />
            <Input placeholder="Institute Name" value={value.institute_name} onChange={(e) => onChange({ ...value, institute_name: e.target.value })} />
            <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={value.gender}
                onChange={(e) => onChange({ ...value, gender: e.target.value })}
            >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <Input placeholder="Email" type="email" value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} />
            <Input placeholder="Contact" value={value.contact} onChange={(e) => onChange({ ...value, contact: e.target.value })} />
            <Input placeholder="Emergency Contact (optional)" value={value.emergency_contact} onChange={(e) => onChange({ ...value, emergency_contact: e.target.value })} />
        </div>
    );
}

export default function DelegationCreate({
    modules,
    earlyBirdEnabled = false,
    registrationDiscountPercent = 25,
}: {
    modules: Module[];
    earlyBirdEnabled?: boolean;
    registrationDiscountPercent?: number;
}) {
    const [step, setStep] = useState(0);
    const { data, setData, post, processing, errors } = useForm<FormData>({
        type: 'individual',
        module_ids: [],
        socials: [],
        spectators: [],
        members: [{ ...emptyMember }],
        undertaking_accepted: false,
    });

    const individualMode = data.type === 'individual';

    const cart = useMemo(() => {
        const selectedModules = modules.filter((m) => data.module_ids.includes(m.id));
        const baseGross = data.type === 'individual' ? 1000 : 3000;
        const socialGross = data.socials.includes('beach_party') ? data.members.length * 3500 : 0;
        const gamesFee = selectedModules.reduce((sum, m) => sum + moduleGameFee(m, earlyBirdEnabled), 0);
        const spectatorFee = data.spectators.length * 500;
        const baseFee = applyRegistrationDiscount(baseGross, earlyBirdEnabled, registrationDiscountPercent);
        const socialFee = applyRegistrationDiscount(socialGross, earlyBirdEnabled, registrationDiscountPercent);
        const total = baseFee + gamesFee + socialFee + spectatorFee;
        const registrationDiscountActive = earlyBirdEnabled && registrationDiscountPercent > 0;
        return {
            selectedModules,
            baseGross,
            baseFee,
            socialGross,
            socialFee,
            gamesFee,
            spectatorFee,
            total,
            registrationDiscountActive,
        };
    }, [data, modules, earlyBirdEnabled, registrationDiscountPercent]);

    function submit() {
        post('/delegations');
    }

    return (
        <>
            <Head title="Add Delegation" />
            <div className="mx-auto max-w-4xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Add Delegation</h1>
                    <p className="text-sm text-muted-foreground">Flow: Games -> Members -> Socials -> Spectators -> Cart -> Payment status.</p>
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] px-3 py-4">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                        {steps.map((label, index) => {
                            const done = index < step;
                            const active = index === step;
                            return (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => setStep(index)}
                                    className="flex flex-col items-center gap-2 text-center"
                                >
                                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${done ? 'bg-lime-300 text-black' : active ? 'bg-violet-500 text-white' : 'bg-[#2a2952] text-cyan-100'}`}>
                                        {done ? '✓' : index + 1}
                                    </span>
                                    <span className={`text-[11px] ${active ? 'text-cyan-200' : 'text-[#9a9ab8]'}`}>{label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {step === 0 && (
                    <div className="space-y-4 rounded-md border border-cyan-400/20 bg-[#0D0C25] p-4">
                        <Label>Select Games (max 2 at delegation level)</Label>
                        <div className="grid gap-3 md:grid-cols-2">
                            {modules.map((module) => {
                                const checked = data.module_ids.includes(module.id);
                                const coverUrl = publicMediaUrl(module.image_path);
                                return (
                                    <label key={module.id} className="flex items-start gap-2 rounded border border-cyan-400/15 bg-[#13123A] p-3">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => {
                                                const next = checked
                                                    ? data.module_ids.filter((id) => id !== module.id)
                                                    : [...data.module_ids, module.id].slice(0, 2);
                                                setData('module_ids', next);
                                            }}
                                        />
                                        <div className="text-sm space-y-1">
                                            <div className="font-medium text-cyan-100">{module.name}</div>
                                            {coverUrl && (
                                                <img
                                                    src={coverUrl}
                                                    alt={module.name}
                                                    className="h-24 w-full rounded object-cover"
                                                />
                                            )}
                                            <div className="text-xs text-muted-foreground line-clamp-3">{module.intro}</div>
                                            <div className="text-xs text-muted-foreground">
                                                Fee: PKR {moduleGameFee(module, earlyBirdEnabled)} | Team Size: {module.team_size || 1} | Venue: {module.venue || 'TBD'}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4 rounded-md border border-cyan-400/20 bg-[#0D0C25] p-4">
                        <div className="grid gap-2 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Delegation Type</Label>
                                <select
                                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={data.type}
                                    onChange={(e) => {
                                        const nextType = e.target.value as 'individual' | 'group';
                                        setData('type', nextType);
                                        if (nextType === 'individual') {
                                            setData('members', [data.members[0] ?? { ...emptyMember }]);
                                        }
                                    }}
                                >
                                    <option value="individual">Individual</option>
                                    <option value="group">Group</option>
                                </select>
                            </div>
                        </div>
                        {data.members.map((member, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">Member {index + 1}</p>
                                    {data.members.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setData('members', data.members.filter((_, i) => i !== index))}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                                <PersonFields
                                    value={member}
                                    selectedModuleIds={data.module_ids}
                                    modules={modules}
                                    onChange={(next) => {
                                        const copy = [...data.members];
                                        copy[index] = next;
                                        setData('members', copy);
                                    }}
                                />
                            </div>
                        ))}
                        {!individualMode && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setData('members', [...data.members, { ...emptyMember }])}
                            >
                                + Add Member
                            </Button>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 rounded-md border border-cyan-400/20 bg-[#0D0C25] p-4">
                        <Label>Socials</Label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.socials.includes('qawali_night')}
                                onChange={() => {
                                    const next = data.socials.includes('qawali_night')
                                        ? data.socials.filter((s) => s !== 'qawali_night')
                                        : [...data.socials, 'qawali_night'];
                                    setData('socials', next);
                                }}
                            />
                            Qawali Night (Free)
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.socials.includes('beach_party')}
                                onChange={() => {
                                    const next = data.socials.includes('beach_party')
                                        ? data.socials.filter((s) => s !== 'beach_party')
                                        : [...data.socials, 'beach_party'];
                                    setData('socials', next);
                                }}
                            />
                            Beach Party (PKR 3500 per member)
                        </label>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 rounded-md border border-cyan-400/20 bg-[#0D0C25] p-4">
                        <div className="flex items-center justify-between">
                            <Label>Spectators (optional, max 10)</Label>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (data.spectators.length >= 10) return;
                                    setData('spectators', [...data.spectators, { ...emptySpectator }]);
                                }}
                            >
                                + Add Spectator
                            </Button>
                        </div>
                        {data.spectators.map((spectator, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">Spectator {index + 1}</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setData('spectators', data.spectators.filter((_, i) => i !== index))}
                                    >
                                        Remove
                                    </Button>
                                </div>
                                <SpectatorFields
                                    value={spectator}
                                    onChange={(next) => {
                                        const copy = [...data.spectators];
                                        copy[index] = next;
                                        setData('spectators', copy);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-2 rounded-md border border-cyan-400/20 bg-[#0D0C25] p-4 text-sm">
                        {cart.registrationDiscountActive && (
                            <p className="mb-2 text-xs text-cyan-300/90">
                                Early bird: {registrationDiscountPercent}% off base fee and social add-ons only (game and spectator lines are unchanged).
                            </p>
                        )}
                        <div className="flex justify-between gap-4">
                            <span>Base Fee</span>
                            <span className="text-right">
                                {cart.registrationDiscountActive && cart.baseGross !== cart.baseFee ? (
                                    <>
                                        <span className="mr-2 text-muted-foreground line-through">PKR {cart.baseGross}</span>
                                        <span>PKR {cart.baseFee}</span>
                                    </>
                                ) : (
                                    <>PKR {cart.baseFee}</>
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Games Fee</span>
                            <span>PKR {cart.gamesFee}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span>Socials Fee</span>
                            <span className="text-right">
                                {cart.registrationDiscountActive && cart.socialGross !== cart.socialFee ? (
                                    <>
                                        <span className="mr-2 text-muted-foreground line-through">PKR {cart.socialGross}</span>
                                        <span>PKR {cart.socialFee}</span>
                                    </>
                                ) : (
                                    <>PKR {cart.socialFee}</>
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Spectators Fee</span>
                            <span>PKR {cart.spectatorFee}</span>
                        </div>
                        <div className="mt-2 flex justify-between border-t border-cyan-400/20 pt-2 font-semibold">
                            <span>Grand Total</span>
                            <span>PKR {cart.total}</span>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-4 rounded-md border border-cyan-400/20 bg-[#0D0C25] p-4 text-sm">
                        <p>After submission, upload your payment screenshot from the list page. Admin will verify and generate QR.</p>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.undertaking_accepted}
                                onChange={(e) => setData('undertaking_accepted', e.target.checked)}
                            />
                            I accept the undertaking and confirm all details are correct.
                        </label>
                        {errors.undertaking_accepted && <p className="text-red-500">{errors.undertaking_accepted}</p>}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
                        Previous
                    </Button>
                    {step < steps.length - 1 ? (
                        <Button type="button" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
                            Next
                        </Button>
                    ) : (
                        <Button type="button" disabled={processing} onClick={submit}>
                            {processing ? 'Submitting...' : 'Submit Delegation'}
                        </Button>
                    )}
                </div>

                {(errors.members || errors.module_ids || errors.type) && (
                    <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                        {errors.members || errors.module_ids || errors.type}
                    </div>
                )}
            </div>
        </>
    );
}

