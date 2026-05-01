import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    earlyBirdDate: string;
    earlyBirdEnabled: boolean;
    registrationDiscountPercent: number;
};

export default function AdminSettings({ earlyBirdDate, earlyBirdEnabled, registrationDiscountPercent }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();

    const { data, setData, patch, processing, errors } = useForm({
        early_bird_date: earlyBirdDate,
        early_bird_enabled: earlyBirdEnabled,
        registration_discount_percent: registrationDiscountPercent,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch('/admin/settings');
    }

    return (
        <>
            <Head title="Admin Settings" />

            <div className="max-w-lg">
                <h1 className="mb-1 text-2xl font-semibold" style={{ fontFamily: 'Russo One, sans-serif', letterSpacing: '.04em', textTransform: 'uppercase' }}>Settings</h1>
                <p className="mb-8 text-sm" style={{ color: '#8B8BAF' }}>
                    Update site-wide configuration for Karachi Gala League 2026.
                </p>

                {props.flash?.success && (
                    <div className="mb-6 px-4 py-3 text-sm" style={{
                        background: 'rgba(52,211,153,0.08)',
                        color: '#4ade80',
                        border: '1px solid rgba(52,211,153,0.2)',
                        borderLeft: '3px solid #4ade80',
                        borderRadius: '4px',
                    }}>
                        {props.flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="grid gap-1.5">
                        <Label htmlFor="early_bird_date">Early Bird Deadline</Label>
                        <p className="text-xs" style={{ color: '#8B8BAF' }}>
                            The countdown on the public home page counts down to this date (midnight PKT, UTC+5).
                        </p>
                        <Input
                            id="early_bird_date"
                            type="date"
                            value={data.early_bird_date}
                            onChange={e => setData('early_bird_date', e.target.value)}
                            required
                        />
                        {errors.early_bird_date && (
                            <p className="text-sm text-red-500">{errors.early_bird_date}</p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="early_bird_enabled"
                                checked={data.early_bird_enabled}
                                onCheckedChange={v => setData('early_bird_enabled', Boolean(v))}
                            />
                            <Label htmlFor="early_bird_enabled">Enable early bird discount on welcome page</Label>
                        </div>
                        <p className="text-xs" style={{ color: '#8B8BAF' }}>
                            When disabled, only normal module prices are shown on the welcome page and registration checkout.
                        </p>
                        {errors.early_bird_enabled && (
                            <p className="text-sm text-red-500">{errors.early_bird_enabled}</p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="registration_discount_percent">Registration discount on base &amp; socials (%)</Label>
                        <p className="text-xs" style={{ color: '#8B8BAF' }}>
                            When early bird is enabled, this percentage is taken off the general base fee (individual PKR 1000 / group PKR 3000) and social add-ons (e.g. beach party per member). Game/module fees and spectator tickets are not discounted. Use 0 for no extra cut on those lines.
                        </p>
                        <Input
                            id="registration_discount_percent"
                            type="number"
                            min={0}
                            max={100}
                            value={data.registration_discount_percent}
                            onChange={(e) => setData('registration_discount_percent', Number(e.target.value))}
                            required
                        />
                        {errors.registration_discount_percent && (
                            <p className="text-sm text-red-500">{errors.registration_discount_percent}</p>
                        )}
                    </div>

                    <div>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            Save settings
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
