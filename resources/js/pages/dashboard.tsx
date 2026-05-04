import { Head, Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <style>{`
                .kgl-dash-bg {
                    background:
                        radial-gradient(ellipse at top left, rgba(100,50,220,0.18) 0%, transparent 52%),
                        radial-gradient(ellipse at bottom right, rgba(217,70,239,0.14) 0%, transparent 58%),
                        #08071A;
                }

                .kgl-dash-card {
                    background: linear-gradient(180deg, rgba(19,18,58,0.92) 0%, rgba(13,12,37,0.96) 100%);
                    border: 1px solid rgba(0,229,255,0.2);
                    box-shadow: 0 10px 28px rgba(0,0,0,0.28);
                }

                .kgl-dash-card:hover {
                    border-color: rgba(0,229,255,0.45);
                }
            `}</style>
            <div className="kgl-dash-bg flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link
                        href="/delegations/create"
                        className="kgl-dash-card group relative flex aspect-video flex-col justify-end overflow-hidden rounded-xl p-5 no-underline"
                    >
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-cyan-300/20 transition-opacity group-hover:opacity-80" />
                        <span className="relative z-[1] font-semibold text-cyan-100">Delegate registration</span>
                        <span className="relative z-[1] mt-1 text-xs text-muted-foreground">
                            Games, roster, and delegate social add-ons
                        </span>
                    </Link>
                    <Link
                        href="/delegations"
                        className="kgl-dash-card group relative flex aspect-video flex-col justify-end overflow-hidden rounded-xl p-5 no-underline"
                    >
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-violet-300/15 transition-opacity group-hover:opacity-80" />
                        <span className="relative z-[1] font-semibold text-cyan-100">My delegations</span>
                        <span className="relative z-[1] mt-1 text-xs text-muted-foreground">
                            List, payment proof, and status
                        </span>
                    </Link>
                    <Link
                        href="/social-registrations"
                        className="kgl-dash-card group relative flex aspect-video flex-col justify-end overflow-hidden rounded-xl p-5 no-underline"
                    >
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-emerald-300/15 transition-opacity group-hover:opacity-80" />
                        <span className="relative z-[1] font-semibold text-cyan-100">Social registrations</span>
                        <span className="relative z-[1] mt-1 text-xs text-muted-foreground">
                            Non-delegate guests — list and payment flow
                        </span>
                    </Link>
                </div>
                <div className="kgl-dash-card relative min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-cyan-300/20" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
});
