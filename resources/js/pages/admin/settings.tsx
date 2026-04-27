import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    earlyBirdDate: string;
};

export default function AdminSettings({ earlyBirdDate }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();

    const { data, setData, patch, processing, errors } = useForm({
        early_bird_date: earlyBirdDate,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch('/admin/settings');
    }

    return (
        <>
            <Head title="Admin Settings" />

            <div className="max-w-lg">
                <h1 className="mb-1 text-2xl font-semibold">Settings</h1>
                <p className="mb-8 text-sm text-gray-500">
                    Update site-wide configuration for Karachi Gala League 2026.
                </p>

                {props.flash?.success && (
                    <div className="mb-6 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
                        {props.flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="grid gap-1.5">
                        <Label htmlFor="early_bird_date">Early Bird Deadline</Label>
                        <p className="text-xs text-gray-400">
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
