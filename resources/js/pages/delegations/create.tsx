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
    /** Per-player social add-ons (qawali free; beach_party adds PKR 3500 for that player). */
    social_selections: string[];
};

type Spectator = Omit<Person, 'module_ids'>;

type FormData = {
    module_ids: number[];
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
    social_selections: [],
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

function rosterErrors(members: Person[], moduleIds: number[], modulesList: Module[]): string[] {
    const errs: string[] = [];
    if (members.length < 1) {
        return ['Add at least one member.'];
    }
    for (const id of moduleIds) {
        const mod = modulesList.find((x) => x.id === id);
        if (!mod) {
            continue;
        }
        const required = Math.max(1, mod.team_size ?? 1);
        const assigned = members.filter((mem) => mem.module_ids.includes(id)).length;
        if (assigned < required) {
            errs.push(`${mod.name} requires at least ${required} player(s) assigned (${assigned} assigned).`);
        }
    }
    return errs;
}

function PersonFields({
    heading,
    value,
    onChange,
    selectedModuleIds,
    modules,
}: {
    heading: string;
    value: Person;
    onChange: (next: Person) => void;
    selectedModuleIds: number[];
    modules: Module[];
}) {
    return (
        <div className="grid gap-3 rounded-md border border-cyan-400/20 bg-[#13123A] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">{heading}</p>
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

type SocialPricingMap = {
    qawali_night: number;
    beach_party: number;
};

function socialOptionLabels(sp: SocialPricingMap): Record<string, string> {
    return {
        qawali_night:
            sp.qawali_night <= 0
                ? 'Qawali Night'
                : `Qawali Night (+ PKR ${sp.qawali_night.toLocaleString()})`,
        beach_party: `Beach Party (+ PKR ${sp.beach_party.toLocaleString()})`,
    };
}

export default function DelegationCreate({
    modules,
    earlyBirdEnabled = false,
    registrationDiscountPercent = 25,
    socialPricing = { qawali_night: 0, beach_party: 3500 },
}: {
    modules: Module[];
    earlyBirdEnabled?: boolean;
    registrationDiscountPercent?: number;
    socialPricing?: SocialPricingMap;
}) {
    const [step, setStep] = useState(0);
    const [stepError, setStepError] = useState<string | null>(null);
    const { data, setData, post, processing, errors } = useForm<FormData>({
        module_ids: [],
        spectators: [],
        members: [{ ...emptyMember }],
        undertaking_accepted: false,
    });

    const delegationIsGroup = data.members.length > 1;

    const socialLabels = useMemo(() => socialOptionLabels(socialPricing), [socialPricing]);

    const cart = useMemo(() => {
        const selectedModules = modules.filter((m) => data.module_ids.includes(m.id));
        const baseGross = delegationIsGroup ? 3000 : 1000;
        const beachCount = data.members.filter((m) => m.social_selections.includes('beach_party')).length;
        const qawaliCount = data.members.filter((m) => m.social_selections.includes('qawali_night')).length;
        const socialGross = data.members.reduce((sum, m) => {
            let line = 0;
            if (m.social_selections.includes('qawali_night')) {
                line += socialPricing.qawali_night;
            }
            if (m.social_selections.includes('beach_party')) {
                line += socialPricing.beach_party;
            }
            return sum + line;
        }, 0);
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
            beachCount,
            qawaliCount,
            delegationLabel: delegationIsGroup ? 'Group' : 'Individual',
        };
    }, [data, modules, earlyBirdEnabled, registrationDiscountPercent, delegationIsGroup, socialPricing]);

    function goNext() {
        setStepError(null);
        if (step === 0) {
            if (data.module_ids.length < 1) {
                setStepError('Select at least one game.');
                return;
            }
        }
        if (step === 1) {
            const roster = rosterErrors(data.members, data.module_ids, modules);
            if (roster.length) {
                setStepError(roster.join(' '));
                return;
            }
            const incomplete = data.members.some((m) => !m.full_name.trim() || !m.cnic || !m.student_id || !m.institute_name || !m.gender || !m.email || !m.contact);
            if (incomplete) {
                setStepError('Complete all required fields for every player.');
                return;
            }
            const gamePick = data.members.some((m) => m.module_ids.length < 1);
            if (gamePick) {
                setStepError('Each player must be assigned at least one selected game (max two per player).');
                return;
            }
        }
        setStep((s) => Math.min(steps.length - 1, s + 1));
    }

    function submit() {
        post('/delegations');
    }

    return (
        <>
            <Head title="Add Delegation" />
            <div className="mx-auto max-w-4xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Add Delegation</h1>
                    <p className="text-sm text-muted-foreground">
                        Choose any number of games, assign players (meet each game&apos;s minimum roster), then pick socials per person. Individual vs group base fee is set automatically from player count.
                    </p>
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
                        <Label>Select games for your delegation (no fixed limit)</Label>
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
                                                    : [...data.module_ids, module.id];
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
                                                Fee: PKR {moduleGameFee(module, earlyBirdEnabled)} | Min. players needed: {Math.max(1, module.team_size ?? 1)} | Venue:{' '}
                                                {module.venue || 'TBD'}
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
                        <div className="rounded-md border border-cyan-400/25 bg-[#13123A]/80 px-4 py-3 text-sm text-muted-foreground">
                            <p className="font-medium text-cyan-100">Head delegate</p>
                            <p className="mt-1">
                                You are registering this delegation. Enter every player&apos;s details. With{' '}
                                <strong className="text-foreground">one player</strong>, the base fee is individual (PKR 1,000 gross); with{' '}
                                <strong className="text-foreground">two or more players</strong>, the group base fee applies (PKR 3,000 gross).
                            </p>
                            <p className="mt-2 text-xs">
                                For each selected game, at least the listed minimum number of players must be assigned to that game across your roster (checkboxes below).
                            </p>
                        </div>
                        {data.members.map((member, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-cyan-100">
                                        {index === 0 ? 'Head delegate' : `Player ${index + 1}`}
                                    </p>
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
                                    heading={index === 0 ? 'Head delegate — contact person' : `Player ${index + 1}`}
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
                        <Button type="button" variant="outline" onClick={() => setData('members', [...data.members, { ...emptyMember }])}>
                            + Add player
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 rounded-md border border-cyan-400/20 bg-[#0D0C25] p-4">
                        <Label>Social events (per player)</Label>
                        <p className="text-xs text-muted-foreground">
                            Each person chooses Qawali Night and/or Beach Party. Per-person amounts follow admin delegate rates below. Early-bird discount applies to social add-ons when enabled.
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Current delegate rates: Qawali{' '}
                            {socialPricing.qawali_night <= 0 ? 'free' : `PKR ${socialPricing.qawali_night.toLocaleString()}`}, Beach PKR{' '}
                            {socialPricing.beach_party.toLocaleString()} each selected person.
                        </p>
                        {data.members.map((member, index) => (
                            <div key={index} className="space-y-3 rounded-md border border-cyan-400/15 bg-[#13123A] p-4">
                                <p className="text-sm font-medium text-cyan-100">
                                    {index === 0 ? 'Head delegate' : `Player ${index + 1}`}
                                    {member.full_name?.trim() ? ` — ${member.full_name.trim()}` : ''}
                                </p>
                                <div className="flex flex-col gap-2">
                                    {(['qawali_night', 'beach_party'] as const).map((key) => (
                                        <label key={key} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={member.social_selections.includes(key)}
                                                onChange={() => {
                                                    const copy = [...data.members];
                                                    const sel = new Set(copy[index].social_selections);
                                                    if (sel.has(key)) {
                                                        sel.delete(key);
                                                    } else {
                                                        sel.add(key);
                                                    }
                                                    copy[index] = { ...copy[index], social_selections: [...sel] };
                                                    setData('members', copy);
                                                }}
                                            />
                                            {socialLabels[key]}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
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
                    <div className="space-y-3 rounded-md border border-cyan-400/20 bg-[#0D0C25] p-4 text-sm">
                        {cart.registrationDiscountActive && (
                            <p className="mb-2 text-xs text-cyan-300/90">
                                Early bird: {registrationDiscountPercent}% off base fee and social add-ons only (game and spectator lines are unchanged).
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Delegation type (for pricing): <strong className="text-foreground">{cart.delegationLabel}</strong> —{' '}
                            {delegationIsGroup ? 'two or more players' : 'single player'}.
                        </p>
                        <div className="flex justify-between gap-4">
                            <span>
                                Base fee ({cart.delegationLabel}) {cart.delegationLabel === 'Individual' ? '(gross 1,000)' : '(gross 3,000)'}
                            </span>
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
                        <div className="border-t border-cyan-400/10 pt-2">
                            <p className="mb-1 text-xs font-medium text-cyan-200">Games / modules</p>
                            {cart.selectedModules.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No games selected.</p>
                            ) : (
                                cart.selectedModules.map((m) => (
                                    <div key={m.id} className="flex justify-between text-xs">
                                        <span>{m.name}</span>
                                        <span>PKR {moduleGameFee(m, earlyBirdEnabled)}</span>
                                    </div>
                                ))
                            )}
                            <div className="mt-1 flex justify-between font-medium">
                                <span>Games subtotal</span>
                                <span>PKR {cart.gamesFee}</span>
                            </div>
                        </div>
                        <div className="flex justify-between gap-4 border-t border-cyan-400/10 pt-2">
                            <span>
                                Social add-ons (delegate rates){' '}
                                <span className="block text-[11px] font-normal text-muted-foreground">
                                    Qawali selected × {cart.qawaliCount}
                                    {socialPricing.qawali_night > 0
                                        ? ` × PKR ${socialPricing.qawali_night.toLocaleString()}`
                                        : ' (free)'}
                                    ; Beach × {cart.beachCount} × PKR {socialPricing.beach_party.toLocaleString()}
                                </span>
                            </span>
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
                            <span>Spectators ({data.spectators.length} × 500)</span>
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

                {stepError && (
                    <div className="rounded border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">{stepError}</div>
                )}

                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={step === 0}
                        onClick={() => {
                            setStepError(null);
                            setStep((s) => Math.max(0, s - 1));
                        }}
                    >
                        Previous
                    </Button>
                    {step < steps.length - 1 ? (
                        <Button type="button" onClick={goNext}>
                            Next
                        </Button>
                    ) : (
                        <Button type="button" disabled={processing} onClick={submit}>
                            {processing ? 'Submitting...' : 'Submit Delegation'}
                        </Button>
                    )}
                </div>

                {(errors.members || errors.module_ids) && (
                    <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                        {errors.members || errors.module_ids}
                    </div>
                )}
            </div>
        </>
    );
}

