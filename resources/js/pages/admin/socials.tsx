import { Head, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { publicMediaUrl } from '@/lib/utils';

type Props = {
    socialQawaliDelegatePkr: number;
    socialQawaliOutsiderPkr: number;
    socialBeachDelegatePkr: number;
    socialBeachOutsiderPkr: number;
    socialQawaliImagePath: string;
    socialBeachImagePath: string;
};

type TabKey = 'pricing' | 'images';

export default function AdminSocials(props: Props) {
    const { props: pageProps } = usePage<{ flash?: { success?: string } }>();
    const [tab, setTab] = useState<TabKey>('images');

    const qawaliPreview = useMemo(() => publicMediaUrl(props.socialQawaliImagePath), [props.socialQawaliImagePath]);
    const beachPreview = useMemo(() => publicMediaUrl(props.socialBeachImagePath), [props.socialBeachImagePath]);

    const { data, setData, post, processing, errors } = useForm({
        social_qawali_delegate_pkr: props.socialQawaliDelegatePkr,
        social_qawali_outsider_pkr: props.socialQawaliOutsiderPkr,
        social_beach_delegate_pkr: props.socialBeachDelegatePkr,
        social_beach_outsider_pkr: props.socialBeachOutsiderPkr,

        social_qawali_image: null as File | null,
        social_beach_image: null as File | null,
        remove_social_qawali_image: false,
        remove_social_beach_image: false,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/socials/save', { forceFormData: true, preserveScroll: true });
    }

    return (
        <>
            <Head title="Admin Socials" />

            <div className="max-w-2xl space-y-6">
                <div>
                    <h1
                        className="mb-1 text-2xl font-semibold"
                        style={{ fontFamily: 'Russo One, sans-serif', letterSpacing: '.04em', textTransform: 'uppercase' }}
                    >
                        Socials
                    </h1>
                    <p className="text-sm" style={{ color: '#8B8BAF' }}>
                        Manage social event pricing and cover images shown on the public welcome page.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant={tab === 'pricing' ? 'default' : 'outline'} onClick={() => setTab('pricing')}>
                        Pricing
                    </Button>
                    <Button type="button" variant={tab === 'images' ? 'default' : 'outline'} onClick={() => setTab('images')}>
                        Images
                    </Button>
                </div>

                {pageProps.flash?.success && (
                    <div
                        className="px-4 py-3 text-sm"
                        style={{
                            background: 'rgba(52,211,153,0.08)',
                            color: '#4ade80',
                            border: '1px solid rgba(52,211,153,0.2)',
                            borderLeft: '3px solid #4ade80',
                            borderRadius: '4px',
                        }}
                    >
                        {pageProps.flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {tab === 'pricing' && (
                        <div className="grid gap-4 rounded-md border border-cyan-400/15 bg-[#0D0C25] p-4">
                            <p className="text-sm font-medium text-foreground">Social events — PKR amounts</p>
                            <p className="text-xs" style={{ color: '#8B8BAF' }}>
                                Delegate rates apply at delegation checkout. Outsider rates are shown on the public home page.
                            </p>

                            <div className="grid gap-1.5">
                                <Label htmlFor="social_qawali_delegate_pkr">Qawali Night — delegate (registered)</Label>
                                <Input
                                    id="social_qawali_delegate_pkr"
                                    type="number"
                                    min={0}
                                    max={9999999}
                                    value={data.social_qawali_delegate_pkr}
                                    onChange={(e) => setData('social_qawali_delegate_pkr', Number(e.target.value))}
                                    required
                                />
                                {errors.social_qawali_delegate_pkr && <p className="text-sm text-red-500">{errors.social_qawali_delegate_pkr}</p>}
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="social_qawali_outsider_pkr">Qawali Night — outsider (non-delegate)</Label>
                                <Input
                                    id="social_qawali_outsider_pkr"
                                    type="number"
                                    min={0}
                                    max={9999999}
                                    value={data.social_qawali_outsider_pkr}
                                    onChange={(e) => setData('social_qawali_outsider_pkr', Number(e.target.value))}
                                    required
                                />
                                {errors.social_qawali_outsider_pkr && <p className="text-sm text-red-500">{errors.social_qawali_outsider_pkr}</p>}
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="social_beach_delegate_pkr">Beach Party — delegate (registered)</Label>
                                <Input
                                    id="social_beach_delegate_pkr"
                                    type="number"
                                    min={0}
                                    max={9999999}
                                    value={data.social_beach_delegate_pkr}
                                    onChange={(e) => setData('social_beach_delegate_pkr', Number(e.target.value))}
                                    required
                                />
                                {errors.social_beach_delegate_pkr && <p className="text-sm text-red-500">{errors.social_beach_delegate_pkr}</p>}
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="social_beach_outsider_pkr">Beach Party — outsider (non-delegate)</Label>
                                <Input
                                    id="social_beach_outsider_pkr"
                                    type="number"
                                    min={0}
                                    max={9999999}
                                    value={data.social_beach_outsider_pkr}
                                    onChange={(e) => setData('social_beach_outsider_pkr', Number(e.target.value))}
                                    required
                                />
                                {errors.social_beach_outsider_pkr && <p className="text-sm text-red-500">{errors.social_beach_outsider_pkr}</p>}
                            </div>
                        </div>
                    )}

                    {tab === 'images' && (
                        <div className="grid gap-4 rounded-md border border-cyan-400/15 bg-[#0D0C25] p-4">
                            <p className="text-sm font-medium text-foreground">Social events — cover images</p>
                            <p className="text-xs" style={{ color: '#8B8BAF' }}>
                                These are shown on the public welcome page under Socials. Recommended: 16:9, JPG/PNG/WebP.
                            </p>

                            <div className="grid gap-2 rounded-md border border-cyan-400/10 bg-[#13123A] p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Qawali Night</p>
                                {qawaliPreview ? (
                                    <img src={qawaliPreview} alt="Qawali Night" className="h-40 w-full rounded object-cover" />
                                ) : (
                                    <div className="flex h-40 items-center justify-center rounded border border-cyan-400/10 text-xs text-muted-foreground">
                                        No image uploaded
                                    </div>
                                )}
                                <div className="grid gap-1.5">
                                    <Label htmlFor="social_qawali_image">Upload / replace</Label>
                                    <Input
                                        id="social_qawali_image"
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={(e) => setData('social_qawali_image', e.target.files?.[0] ?? null)}
                                    />
                                    {errors.social_qawali_image && <p className="text-sm text-red-500">{errors.social_qawali_image}</p>}
                                </div>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={data.remove_social_qawali_image}
                                        onChange={(e) => setData('remove_social_qawali_image', e.target.checked)}
                                    />
                                    Remove current image
                                </label>
                            </div>

                            <div className="grid gap-2 rounded-md border border-cyan-400/10 bg-[#13123A] p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Beach Party</p>
                                {beachPreview ? (
                                    <img src={beachPreview} alt="Beach Party" className="h-40 w-full rounded object-cover" />
                                ) : (
                                    <div className="flex h-40 items-center justify-center rounded border border-cyan-400/10 text-xs text-muted-foreground">
                                        No image uploaded
                                    </div>
                                )}
                                <div className="grid gap-1.5">
                                    <Label htmlFor="social_beach_image">Upload / replace</Label>
                                    <Input
                                        id="social_beach_image"
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={(e) => setData('social_beach_image', e.target.files?.[0] ?? null)}
                                    />
                                    {errors.social_beach_image && <p className="text-sm text-red-500">{errors.social_beach_image}</p>}
                                </div>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={data.remove_social_beach_image}
                                        onChange={(e) => setData('remove_social_beach_image', e.target.checked)}
                                    />
                                    Remove current image
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            Save socials
                        </Button>
                        <span className="text-xs text-muted-foreground">Saves pricing + images together.</span>
                    </div>
                </form>
            </div>
        </>
    );
}

