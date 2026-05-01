import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-[linear-gradient(135deg,#00E5FF,#A855F7,#FF6EB4)] text-[#0A0620] shadow-[0_0_20px_rgba(0,229,255,0.35)]">
                <AppLogoIcon className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold tracking-wide bg-[linear-gradient(135deg,#00E5FF,#A855F7)] bg-clip-text text-transparent">
                    KGL
                </span>
                <span className="truncate text-[10px] uppercase tracking-[0.22em] text-cyan-200/80">
                    Karachi Gala League
                </span>
            </div>
        </>
    );
}
