import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SocialPricingMap = {
    qawali_night: number;
    beach_party: number;
};

type MemberRow = {
    full_name: string;
    cnic: string;
    email: string;
    phone: string;
    social_selections: string[];
};

const steps = ['Member details', 'Social events', 'Cart'];

function formatCnic(value: string): string {
    const digits = value.replace(/\D+/g, '').slice(0, 13);
    const p1 = digits.slice(0, 5);
    const p2 = digits.slice(5, 12);
    const p3 = digits.slice(12, 13);
    if (!p2) return p1;
    if (!p3) return `${p1}-${p2}`;
    return `${p1}-${p2}-${p3}`;
}

function applyRegistrationDiscount(gross: number, earlyBirdEnabled: boolean, percent: number): number {
    if (!earlyBirdEnabled || percent <= 0) {
        return gross;
    }
    return Math.round((gross * (100 - percent)) / 100);
}

function socialOptionLabels(sp: SocialPricingMap): Record<string, string> {
    return {
        qawali_night:
            sp.qawali_night <= 0 ? 'Qawali Night' : `Qawali Night (+ PKR ${sp.qawali_night.toLocaleString()})`,
        beach_party: `Beach Party (+ PKR ${sp.beach_party.toLocaleString()})`,
    };
}

function lineGross(m: MemberRow, sp: SocialPricingMap): number {
    let line = 0;
    if (m.social_selections.includes('qawali_night')) line += sp.qawali_night;
    if (m.social_selections.includes('beach_party')) line += sp.beach_party;
    return line;
}

const emptyMember = (): MemberRow => ({
    full_name: '',
    cnic: '',
    email: '',
    phone: '',
    social_selections: [],
});

export default function SocialRegistrationCreate({
    earlyBirdEnabled = false,
    registrationDiscountPercent = 25,
    socialPricing = { qawali_night: 1500, beach_party: 4000 },
}: {
    earlyBirdEnabled?: boolean;
    registrationDiscountPercent?: number;
    socialPricing?: SocialPricingMap;
}) {
    const [step, setStep] = useState(0);
    const [stepError, setStepError] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<{ members: MemberRow[] }>({
        members: [emptyMember()],
    });

    const socialLabels = useMemo(() => socialOptionLabels(socialPricing), [socialPricing]);

    const cart = useMemo(() => {
        const lines = data.members.map((m) => {
            const gross = lineGross(m, socialPricing);
            const fee = applyRegistrationDiscount(gross, earlyBirdEnabled, registrationDiscountPercent);
            return { member: m, gross, fee };
        });
        const total = lines.reduce((s, l) => s + l.fee, 0);
        const registrationDiscountActive = earlyBirdEnabled && registrationDiscountPercent > 0;
        return { lines, total, registrationDiscountActive };
    }, [data.members, socialPricing, earlyBirdEnabled, registrationDiscountPercent]);

    function goNext() {
        setStepError(null);
        if (step === 0) {
            if (data.members.length < 1) {
                setStepError('Add at least one member.');
                return;
            }
            const incomplete = data.members.some(
                (m) => !m.full_name.trim() || !m.cnic || !m.email.trim() || !m.phone.trim(),
            );
            if (incomplete) {
                setStepError('Complete full name, CNIC, email, and phone for every member.');
                return;
            }
        }
        if (step === 1) {
            const missing = data.members.some((m) => m.social_selections.length < 1);
            if (missing) {
                setStepError('Each member must select at least one social event.');
                return;
            }
        }
        setStep((s) => Math.min(steps.length - 1, s + 1));
    }

    function submit() {
        post('/social-registrations');
    }

    return (
        <>
            <Head title="Register for socials" />
            <div className="mx-auto max-w-4xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Register for socials (non-delegate)</h1>
                    <p className="text-sm text-muted-foreground">
                        Add one or more guests with CNIC, email, phone, and full name. Pick social events per person,
                        review the cart (outsider pricing), then submit. Payment stays pending until an admin verifies your
                        proof — same flow as delegations.
                    </p>
                </div>

                <div className="rounded-md border border-cyan-400/20 bg-[#13123A] px-3 py-4">
                    <div className="grid grid-cols-3 gap-3">
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
                                    <span
                                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${done ? 'bg-lime-300 text-black' : active ? 'bg-violet-500 text-white' : 'bg-[#2a2952] text-cyan-100'}`}
                                    >
                                        {done ? '✓' : index + 1}
                                    </span>
                                    <span className={`text-[11px] ${active ? 'text-cyan-200' : 'text-[#9a9ab8]'}`}>
                                        {label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {step === 0 && (
                    <div className="space-y-4 rounded-md border border-cyan-400/20 bg-[#0D0C25] p-4">
                        {data.members.map((member, index) => (
                            <div key={index} className="grid gap-3 rounded-md border border-cyan-400/20 bg-[#13123A] p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                                        Member {index + 1}
                                    </p>
                                    {data.members.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setData(
                                                    'members',
                                                    data.members.filter((_, i) => i !== index),
                                                )
                                            }
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                                <Input
                                    placeholder="Full name"
                                    value={member.full_name}
                                    onChange={(e) => {
                                        const copy = [...data.members];
                                        copy[index] = { ...member, full_name: e.target.value };
                                        setData('members', copy);
                                    }}
                                />
                                <Input
                                    placeholder="CNIC (42201-0098341-1)"
                                    value={member.cnic}
                                    maxLength={15}
                                    onChange={(e) => {
                                        const copy = [...data.members];
                                        copy[index] = { ...member, cnic: formatCnic(e.target.value) };
                                        setData('members', copy);
                                    }}
                                />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={member.email}
                                    onChange={(e) => {
                                        const copy = [...data.members];
                                        copy[index] = { ...member, email: e.target.value };
                                        setData('members', copy);
                                    }}
                                />
                                <Input
                                    placeholder="Phone number"
                                    value={member.phone}
                                    onChange={(e) => {
                                        const copy = [...data.members];
                                        copy[index] = { ...member, phone: e.target.value };
                                        setData('members', copy);
                                    }}
                                />
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => setData('members', [...data.members, emptyMember()])}>
                            Add member
                        </Button>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4 rounded-md border border-cyan-400/20 bg-[#0D0C25] p-4">
                        {data.members.map((member, index) => (
                            <div key={index} className="grid gap-2 rounded-md border border-cyan-400/20 bg-[#13123A] p-4">
                                <p className="text-sm font-medium text-cyan-100">
                                    {member.full_name.trim() || `Member ${index + 1}`}
                                </p>
                                <Label className="text-xs text-muted-foreground">Select events (at least one)</Label>
                                <div className="flex flex-wrap gap-3">
                                    {(['qawali_night', 'beach_party'] as const).map((key) => {
                                        const checked = member.social_selections.includes(key);
                                        return (
                                            <label
                                                key={key}
                                                className="inline-flex items-center gap-2 rounded border border-cyan-400/20 px-2 py-1 text-xs"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => {
                                                        const copy = [...data.members];
                                                        const nextSel = checked
                                                            ? member.social_selections.filter((s) => s !== key)
                                                            : [...member.social_selections, key];
                                                        copy[index] = { ...member, social_selections: nextSel };
                                                        setData('members', copy);
                                                    }}
                                                />
                                                {socialLabels[key]}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 rounded-md border border-cyan-400/20 bg-[#0D0C25] p-4">
                        <p className="text-sm font-medium text-cyan-100">Cart (per member)</p>
                        {cart.lines.map((line, i) => (
                            <div
                                key={i}
                                className="flex flex-wrap justify-between gap-2 border-b border-cyan-400/10 pb-2 text-sm last:border-0"
                            >
                                <span>
                                    {line.member.full_name.trim() || `Member ${i + 1}`}
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        (
                                        {(line.member.social_selections ?? []).join(', ')})
                                    </span>
                                </span>
                                <span>
                                    PKR {line.fee}
                                    {cart.registrationDiscountActive && line.gross !== line.fee && (
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            (was {line.gross})
                                        </span>
                                    )}
                                </span>
                            </div>
                        ))}
                        <p className="text-right text-lg font-semibold">Total PKR {cart.total}</p>
                        {cart.registrationDiscountActive && (
                            <p className="text-xs text-muted-foreground">
                                Early-bird registration discount ({registrationDiscountPercent}% off social lines) applied.
                            </p>
                        )}
                    </div>
                )}

                {stepError && (
                    <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
                        {stepError}
                    </div>
                )}

                {errors.members && (
                    <p className="text-sm text-red-400">{typeof errors.members === 'string' ? errors.members : 'Check member fields.'}</p>
                )}

                <div className="flex flex-wrap gap-2">
                    {step > 0 && (
                        <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))}>
                            Back
                        </Button>
                    )}
                    {step < steps.length - 1 && (
                        <Button type="button" onClick={goNext}>
                            Next
                        </Button>
                    )}
                    {step === steps.length - 1 && (
                        <Button type="button" disabled={processing} onClick={submit}>
                            {processing ? 'Submitting...' : 'Submit registration'}
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}
