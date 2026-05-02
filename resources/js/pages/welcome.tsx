import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Menu, X, Instagram, Mail, Phone, MapPin,
    ChevronDown, Crown, Gamepad2, Target, Zap, Wind,
    Activity, Users, Dumbbell, ArrowRight, ShoppingCart,
    Music, Palmtree,
} from 'lucide-react';

const MODULE_ICONS: Record<string, React.ElementType> = {
    'chess':        Crown,
    'fifa':         Gamepad2,
    'carrom':       Target,
    'table tennis': Zap,
    'badminton':    Wind,
    'cricket':      Activity,
    'tug of war':   Users,
    'arm wrestling':Dumbbell,
};

function moduleIcon(name: string): React.ElementType {
    return MODULE_ICONS[name.toLowerCase()] ?? Gamepad2;
}

function socialEventIcon(slug: string): React.ElementType {
    return slug === 'beach_party' ? Palmtree : Music;
}

function formatSocialPkrAmount(n: number): string {
    if (n <= 0) {
        return 'Free';
    }

    return `PKR ${n.toLocaleString()}`;
}


export default function Welcome() {
    type GalleryItem = { id: number; label: string; image_url: string; wide: boolean; sort_order: number };
    type Module = {
        id: number; name: string; intro: string;
        image_url: string | null;
        how_to_play: string[]; rules: string; registration: string[];
        early_bird_price: string | null;
        normal_price: string | null;
        first_prize: string; second_prize: string; min_delegations: number; max_delegations: number; min_participants: number; max_participants: number;
    };

    type SocialEvent = {
        slug: string;
        name: string;
        delegate_pkr: number;
        outsider_pkr: number;
        image_url: string | null;
    };

    const { earlyBirdDate, earlyBirdEnabled, galleryItems, modules, socialEvents } = usePage<{
        earlyBirdDate: string;
        earlyBirdEnabled: boolean;
        galleryItems: GalleryItem[];
        modules: Module[];
        socialEvents: SocialEvent[];
    }>().props;
    const [menuOpen, setMenuOpen]         = useState(false);
    const [scrolled, setScrolled]         = useState(false);
    const [hoveredMod, setHoveredMod]     = useState<number | null>(null);
    const [hoveredGal, setHoveredGal]     = useState<number | null>(null);
    const [hoveredSoc, setHoveredSoc]     = useState<number | null>(null);

    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const target = new Date(earlyBirdDate + 'T00:00:00+05:00').getTime();
        const calc = () => {
            const diff = Math.max(0, target - Date.now());
            return {
                days:    Math.floor(diff / 86400000),
                hours:   Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000)  / 60000),
                seconds: Math.floor((diff % 60000)    / 1000),
            };
        };
        setCountdown(calc());
        const id = setInterval(() => setCountdown(calc()), 1000);
        return () => clearInterval(id);
    }, [earlyBirdDate]);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
    };

    return (
        <>
            <Head title="Karachi Gala League 2026 — IBA Karachi" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Chakra+Petch:wght@300;400;500;600;700&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                :root {
                    --c:   #00E5FF;
                    --c2:  #80F4FF;
                    --v:   #A855F7;
                    --m:   #D946EF;
                    --t:   #06B6D4;
                    --bg:  #08071A;
                    --s1:  #0D0C25;
                    --s2:  #13123A;
                    --text: #F0EEFF;
                    --dim:  #8B8BAF;
                    --holo: linear-gradient(135deg, #00E5FF, #A855F7, #FF6EB4, #06B6D4);
                }
                html { scroll-behavior: smooth; }
                body { background: var(--bg); color: var(--text); font-family: 'Chakra Petch', sans-serif; -webkit-font-smoothing: antialiased; }
                input, textarea, button, a { font-family: inherit; }
                input::placeholder, textarea::placeholder { color: var(--dim); font-size: 13px; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(22px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes holo-shift {
                    0%   { background-position: 0% 50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes prism-orb {
                    0%   { transform: translate(0px, 0px) scale(1); }
                    33%  { transform: translate(40px, -30px) scale(1.1); }
                    66%  { transform: translate(-20px, 20px) scale(0.95); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes holo-glow {
                    0%,100% { box-shadow: 0 0 24px rgba(0,229,255,0.25); }
                    33%     { box-shadow: 0 0 40px rgba(168,85,247,0.35); }
                    66%     { box-shadow: 0 0 40px rgba(217,70,239,0.28); }
                }
                @keyframes shimmer-pass {
                    0%   { transform: translateX(-120%) skewX(-20deg); opacity: 0; }
                    40%  { opacity: 0.6; }
                    100% { transform: translateX(220%) skewX(-20deg); opacity: 0; }
                }

                .a1 { animation: fadeUp .8s ease both; }
                .a2 { animation: fadeUp .8s .12s ease both; }
                .a3 { animation: fadeUp .8s .24s ease both; }
                .a4 { animation: fadeUp .8s .36s ease both; }

                .holo-text {
                    background: linear-gradient(135deg, #00E5FF 0%, #A855F7 40%, #FF6EB4 70%, #06B6D4 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: holo-shift 5s linear infinite;
                }

                .hero-grid {
                    position: absolute; inset: 0; pointer-events: none;
                    background-image:
                        linear-gradient(rgba(0,229,255,.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,229,255,.025) 1px, transparent 1px);
                    background-size: 64px 64px;
                }
                .prism-orb-1 {
                    position: absolute; width: 500px; height: 500px;
                    border-radius: 50%; pointer-events: none;
                    background: radial-gradient(ellipse, rgba(100,50,220,0.28) 0%, rgba(0,229,255,0.06) 60%, transparent 100%);
                    filter: blur(40px);
                    top: -100px; left: -80px;
                    animation: prism-orb 18s ease-in-out infinite;
                }
                .prism-orb-2 {
                    position: absolute; width: 400px; height: 400px;
                    border-radius: 50%; pointer-events: none;
                    background: radial-gradient(ellipse, rgba(217,70,239,0.2) 0%, rgba(168,85,247,0.08) 60%, transparent 100%);
                    filter: blur(50px);
                    bottom: -60px; right: -60px;
                    animation: prism-orb 22s ease-in-out infinite reverse;
                }
                .prism-orb-3 {
                    position: absolute; width: 300px; height: 300px;
                    border-radius: 50%; pointer-events: none;
                    background: radial-gradient(ellipse, rgba(0,229,255,0.15) 0%, transparent 70%);
                    filter: blur(35px);
                    top: 40%; right: 15%;
                    animation: prism-orb 14s ease-in-out infinite 3s;
                }

                .nav-link {
                    font-size: 11px; font-weight: 600; letter-spacing: .14em;
                    text-transform: uppercase; color: var(--dim); cursor: pointer;
                    position: relative; padding-bottom: 3px; transition: color .2s;
                }
                .nav-link::after {
                    content: ''; position: absolute; bottom: 0; left: 0;
                    width: 0; height: 2px;
                    background: linear-gradient(90deg, #00E5FF, #A855F7);
                    transition: width .25s ease;
                }
                .nav-link:hover { color: var(--c); }
                .nav-link:hover::after { width: 100%; }

                .btn-holo {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: linear-gradient(135deg, #00E5FF 0%, #A855F7 50%, #00E5FF 100%);
                    background-size: 200% auto;
                    color: #08071A; border: none;
                    font-family: 'Chakra Petch', sans-serif; font-weight: 700;
                    font-size: 11px; letter-spacing: .15em; text-transform: uppercase;
                    padding: 14px 32px; cursor: pointer; text-decoration: none;
                    transition: all .3s; animation: holo-shift 3s linear infinite, holo-glow 3s ease-in-out infinite;
                    position: relative; overflow: hidden;
                }
                .btn-holo::after {
                    content: ''; position: absolute; top: 0; left: 0;
                    width: 40px; height: 100%;
                    background: rgba(255,255,255,0.35);
                    animation: shimmer-pass 2.5s ease-in-out infinite;
                }
                .btn-holo:hover { background-position: right center; transform: translateY(-2px); }

                .btn-outline {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: transparent; border: 1px solid rgba(0,229,255,0.4);
                    color: var(--c); font-family: 'Chakra Petch', sans-serif;
                    font-weight: 600; font-size: 11px; letter-spacing: .15em;
                    text-transform: uppercase; padding: 14px 32px;
                    cursor: pointer; transition: all .25s; text-decoration: none;
                    position: relative; overflow: hidden;
                }
                .btn-outline::before {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(0,229,255,0.1), rgba(168,85,247,0.1));
                    opacity: 0; transition: opacity .25s;
                }
                .btn-outline:hover { border-color: var(--c); color: var(--text); }
                .btn-outline:hover::before { opacity: 1; }

                .sec-label {
                    font-family: 'Chakra Petch', sans-serif; font-size: 10px; font-weight: 700;
                    letter-spacing: .4em; text-transform: uppercase; color: var(--c);
                    margin-bottom: 16px;
                }
                .sec-heading {
                    font-family: 'Russo One', sans-serif;
                    font-size: clamp(2.4rem,5.5vw,4.2rem);
                    color: var(--text); text-transform: uppercase; line-height: 1.02;
                }
                .sec-heading span { color: var(--c); }

                .divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(0,229,255,0.2), rgba(168,85,247,0.2), transparent);
                }

                /* Module cards */
                .mod-card {
                    background: linear-gradient(180deg, rgba(19,18,58,0.95) 0%, rgba(13,12,37,0.98) 100%);
                    border: 1px solid rgba(0,229,255,0.2);
                    border-radius: 18px;
                    padding: 14px;
                    cursor: pointer;
                    transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .mod-card:hover {
                    border-color: rgba(0,229,255,0.55);
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(0,229,255,0.12), 0 8px 24px rgba(168,85,247,0.12);
                }
                .mod-cover {
                    width: 100%;
                    aspect-ratio: 16/9;
                    object-fit: cover;
                    border-radius: 12px;
                    display: block;
                    margin-bottom: 14px;
                    background: linear-gradient(135deg, rgba(217,70,239,0.18), rgba(0,229,255,0.1));
                    border: 1px solid rgba(0,229,255,0.16);
                }
                .mod-cover-fallback {
                    width: 100%;
                    aspect-ratio: 16/9;
                    border-radius: 12px;
                    margin-bottom: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, rgba(168,85,247,0.22), rgba(0,229,255,0.12));
                    border: 1px solid rgba(0,229,255,0.16);
                }
                .mod-icon { color: #E9E7FF; transition: color .25s; }
                .mod-name {
                    font-family: 'Russo One', sans-serif; font-size: 18px;
                    color: var(--text); margin-bottom: 10px; text-transform: none;
                    transition: color .25s; position: relative; z-index: 1;
                }
                .mod-desc {
                    font-size: 15px;
                    color: #B9B8D8;
                    line-height: 1.45;
                    min-height: 44px;
                    margin-bottom: 16px;
                    font-weight: 400;
                    position: relative;
                    z-index: 1;
                    flex: 1;
                }
                .mod-footer {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 10px 12px;
                    border-top: 1px solid rgba(0,229,255,0.14);
                    padding-top: 12px;
                }
                .mod-fee-col {
                    min-width: 0;
                    flex: 1 1 auto;
                }
                .mod-fee {
                    background: linear-gradient(135deg, #00E5FF 0%, #A855F7 55%, #FF6EB4 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-family: 'Russo One', sans-serif;
                    font-size: clamp(1.35rem, 4.5vw + 0.6rem, 2.125rem);
                    letter-spacing: .01em;
                    line-height: 1.05;
                    overflow-wrap: anywhere;
                    word-break: break-word;
                }
                .mod-register-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: clamp(4px, 1.5vw, 8px);
                    background: linear-gradient(135deg, rgba(0,229,255,0.16), rgba(168,85,247,0.2));
                    color: #F0EEFF;
                    border: 1px solid rgba(0,229,255,0.35);
                    border-radius: 10px;
                    padding: clamp(8px, 2vw, 10px) clamp(10px, 3vw, 16px);
                    font-weight: 700;
                    font-size: clamp(14px, 3.5vw, 22px);
                    cursor: pointer;
                    text-decoration: none;
                    flex: 0 0 auto;
                    max-width: 100%;
                    box-sizing: border-box;
                    transition: transform .2s ease, background .2s ease;
                }
                .mod-register-btn svg {
                    flex-shrink: 0;
                    width: 1em;
                    height: 1em;
                }
                @media (max-width: 767px) {
                    .mod-footer {
                        flex-direction: column;
                        align-items: stretch;
                        justify-content: flex-start;
                        gap: 14px;
                    }
                    .mod-fee-col {
                        flex: none;
                        width: 100%;
                        text-align: center;
                    }
                    .mod-fee {
                        text-align: center;
                    }
                    .mod-register-btn {
                        flex: none;
                        width: 100%;
                        min-height: 44px;
                    }
                }
                .mod-register-btn:hover {
                    background: linear-gradient(135deg, rgba(0,229,255,0.24), rgba(168,85,247,0.3));
                    border-color: rgba(0,229,255,0.65);
                    transform: translateY(-1px);
                }

                /* Gallery */
                .gal-item { position: relative; overflow: hidden; cursor: pointer; }
                .gal-item::after {
                    content: ''; position: absolute; inset: 0;
                    border: 2px solid transparent; transition: border-color .3s; z-index: 2;
                }
                .gal-item:hover::after { border-color: var(--c); }
                .gal-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(0,229,255,0.06), rgba(168,85,247,0.08));
                    opacity: 0; transition: opacity .3s; z-index: 1;
                }
                .gal-item:hover .gal-overlay { opacity: 1; }
                .gal-label {
                    position: absolute; bottom: 0; left: 0; right: 0;
                    padding: 32px 14px 14px;
                    background: linear-gradient(transparent, rgba(8,7,26,.9));
                    font-size: 11px; font-weight: 700; letter-spacing: .12em;
                    color: var(--text); text-transform: uppercase;
                    opacity: 0; transform: translateY(8px);
                    transition: all .3s; z-index: 3;
                }
                .gal-item:hover .gal-label { opacity: 1; transform: translateY(0); }

                /* Social buttons */
                .social-btn {
                    width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
                    background: var(--s2); border: 1px solid rgba(0,229,255,0.18);
                    color: var(--dim); cursor: pointer; transition: all .25s;
                }
                .social-btn:hover {
                    background: linear-gradient(135deg, rgba(0,229,255,0.15), rgba(168,85,247,0.15));
                    border-color: var(--c); color: var(--c);
                }

                .footer-link {
                    background: none; border: none; color: var(--dim);
                    cursor: pointer; padding: 4px; transition: color .2s;
                }
                .footer-link:hover { color: var(--c); }

                /* Iridescent stat border */
                .stat-item { border-top: 2px solid transparent; border-image: linear-gradient(135deg, #00E5FF, #A855F7) 1; padding-top: 20px; }

                @media (max-width: 640px) {
                    .hero-grid { background-size: 40px 40px; }
                    .prism-orb-1 { width: 300px; height: 300px; }
                    .prism-orb-2 { width: 250px; height: 250px; }
                }
            `}</style>

            {/* ── NAVBAR ─────────────────────────────────────────────── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                padding: '16px clamp(20px,5vw,80px)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: scrolled ? 'rgba(8,7,26,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(24px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(0,229,255,0.1)' : 'none',
                transition: 'all .4s',
            }}>
                <button type="button" onClick={() => scrollTo('home')} className="shrink-0 text-left" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <span style={{ fontFamily: 'Russo One, sans-serif', fontSize: '22px', letterSpacing: '.06em', background: 'linear-gradient(135deg, #00E5FF, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KGL</span>
                    <span style={{ fontFamily: 'Chakra Petch, sans-serif', fontSize: '13px', color: '#8B8BAF', marginLeft: '6px', fontWeight: 400 }}>2026</span>
                </button>

                {/* Use only Tailwind for display — inline display:flex would override `hidden` on mobile */}
                <div className="hidden md:flex md:items-center md:gap-9">
                    {['home','about','gallery','socials','modules','contact'].map(s => (
                        <span key={s} className="nav-link" onClick={() => scrollTo(s)}>{s}</span>
                    ))}
                </div>

                <div className="hidden md:flex md:items-center md:gap-3">
                    <Link href="/login" className="btn-outline">Log in</Link>
                    <Link href="/register" className="btn-holo">Register Now</Link>
                </div>

                <button type="button" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00E5FF', padding: '4px' }} className="flex shrink-0 items-center justify-center md:hidden">
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {/* Mobile menu */}
            {menuOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,7,26,.97)', zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '48px' }}>
                    <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#00E5FF' }}>
                        <X size={24} />
                    </button>
                    {['home','about','gallery','socials','modules','contact'].map(s => (
                        <button key={s} onClick={() => scrollTo(s)} style={{ background: 'none', border: 'none', fontFamily: 'Russo One, sans-serif', fontSize: '40px', color: '#F0EEFF', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.05em', transition: 'color .2s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#00E5FF')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#F0EEFF')}>
                            {s}
                        </button>
                    ))}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <Link href="/login" className="btn-outline">Log in</Link>
                        <Link href="/register" className="btn-holo">Register Now</Link>
                    </div>
                </div>
            )}

            {/* ── HERO ───────────────────────────────────────────────── */}
            <section id="home" style={{ position: 'relative', height: '100vh', minHeight: '620px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#08071A' }}>
                <div className="hero-grid" />
                <div className="prism-orb-1" />
                <div className="prism-orb-2" />
                <div className="prism-orb-3" />

                {/* Corner prismatic accents */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 140px 140px 0', borderColor: 'transparent rgba(0,229,255,0.06) transparent transparent', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: '90px 90px 0 0', borderColor: 'rgba(168,85,247,0.05) transparent transparent transparent', pointerEvents: 'none' }} />

                <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 clamp(20px,5vw,60px)' }}>
                    <h1 className="a2" style={{ fontFamily: 'Russo One, sans-serif', fontSize: 'clamp(4rem,16vw,12rem)', lineHeight: .9, textTransform: 'uppercase', color: '#F0EEFF', letterSpacing: '-.01em' }}>
                        <span style={{
                            background: 'linear-gradient(180deg, #F8FAFF 0%, #D9DDEA 35%, #B2BACF 65%, #EEF2FF 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            KARACHI
                        </span>
                        <br />
                        <span className="holo-text" style={{ textShadow: 'none' }}>GALA</span>
                    </h1>

                    <p className="a3" style={{ fontFamily: 'Russo One, sans-serif', fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: '#00E5FF', letterSpacing: '.3em', marginTop: '8px', marginBottom: '32px', textShadow: '0 0 30px rgba(0,229,255,0.4)' }}>
                        LEAGUE 2026
                    </p>

                    <p className="a3" style={{ fontSize: '14px', color: '#8B8BAF', letterSpacing: '.06em', maxWidth: '380px', margin: '0 auto 44px', lineHeight: 1.8, fontWeight: 400 }}>
                        One campus. Fourteen arenas. Infinite glory.<br />
                        <span style={{ color: '#00E5FF', fontSize: '11px', letterSpacing: '.15em' }}>— SPRING 2026 · IBA MAIN CAMPUS —</span>
                    </p>

                    <div className="a4" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/register" className="btn-holo">Register Now <ArrowRight size={14} /></Link>
                        <button className="btn-outline" onClick={() => scrollTo('modules')}>View Modules</button>
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: .3 }}>
                    <span style={{ fontSize: '9px', letterSpacing: '.35em', textTransform: 'uppercase', color: '#8B8BAF' }}>Scroll</span>
                    <ChevronDown size={14} color="#00E5FF" />
                </div>
            </section>

            {/* ── ABOUT ──────────────────────────────────────────────── */}
            <section id="about" style={{ position: 'relative', padding: 'clamp(72px,13vh,128px) clamp(20px,7vw,110px)', background: '#0D0C25' }}>
                <div className="divider" style={{ position: 'absolute', top: 0, left: '8%', right: '8%' }} />

                {/* Subtle background orbs */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', width: '600px', height: '300px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(100,50,220,0.14) 0%, transparent 70%)', filter: 'blur(40px)', top: '10%', left: '50%', transform: 'translateX(-50%)' }} />
                    <div style={{ position: 'absolute', width: '400px', height: '200px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(217,70,239,0.08) 0%, transparent 70%)', filter: 'blur(40px)', bottom: '10%', left: '50%', transform: 'translateX(-50%)' }} />
                </div>

                <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    {/* <p className="sec-label">About the Event</p> */}

                    <h2 style={{
                        fontFamily: "'Russo One', sans-serif",
                        fontSize: 'clamp(2.4rem,6vw,4rem)',
                        background: 'linear-gradient(135deg, #F0EEFF 30%, #A855F7 70%, #00E5FF 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textTransform: 'uppercase', lineHeight: 1.05,
                        marginBottom: '40px',
                    }}>
                        About KGL
                    </h2>

                    <p style={{
                        fontSize: 'clamp(14px,1.6vw,17px)', color: '#C4C4E0',
                        lineHeight: 1.9, fontWeight: 300, maxWidth: '720px', margin: '0 auto 48px',
                    }}>
                        KGL is among the few competition series in Pakistan which happens on such a big scale.
                        It is an Olympiad for holistic upbringing and development of individual talent. It invites
                        the youth to celebrate their immense talent and nurture themselves immensely. It stands out
                        because of the diverse opportunities that it offers in one package with a variety of{' '}
                        <span style={{ color: '#00E5FF', fontWeight: 600 }}>20 competitions</span>. The categories
                        are diversified in court games, field games, mind games and performing arts. With reaching
                        a new height of{' '}
                        <span style={{ color: '#00E5FF', fontWeight: 600 }}>1000+ participants</span>, KGL's team
                        has proved that such drastic obstacles could not come in between what they promised and
                        what they deliver.
                    </p>

                    {/* Stats row */}
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2px' }}>
                        {[
                            { val: '10+', lbl: 'Competitions' },
                            { val: '1000+', lbl: 'Participants' },
                            { val: '2', lbl: 'Categories' },
                            { val: '4', lbl: 'Epic Days' },
                        ].map(({ val, lbl }) => (
                            <div key={lbl} style={{
                                padding: 'clamp(20px,3vw,32px) clamp(24px,4vw,48px)',
                                background: 'rgba(0,229,255,0.04)',
                                border: '1px solid rgba(0,229,255,0.1)',
                                flex: '1 0 120px', maxWidth: '220px',
                            }}>
                                <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: 'clamp(2rem,5vw,3.2rem)', background: 'linear-gradient(135deg, #00E5FF, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '8px' }}>{val}</div>
                                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: '#8B8BAF' }}>{lbl}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── EARLY BIRD COUNTDOWN ───────────────────────────────── */}
            {earlyBirdEnabled && (
            <section style={{ position: 'relative', padding: 'clamp(64px,11vh,112px) clamp(20px,7vw,110px)', background: '#08071A', overflow: 'hidden' }}>
                {/* Background orbs */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', width: '700px', height: '350px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(168,85,247,0.18) 0%, transparent 65%)', filter: 'blur(50px)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                    <div style={{ position: 'absolute', width: '400px', height: '200px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,229,255,0.1) 0%, transparent 65%)', filter: 'blur(40px)', top: '20%', right: '10%' }} />
                    <div style={{ position: 'absolute', width: '300px', height: '200px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(217,70,239,0.1) 0%, transparent 65%)', filter: 'blur(40px)', bottom: '10%', left: '8%' }} />
                </div>

                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <p className="sec-label">Limited Time Offer</p>
                    <h2 style={{
                        fontFamily: "'Russo One', sans-serif",
                        fontSize: 'clamp(2rem,5.5vw,3.8rem)',
                        color: '#F0EEFF', textTransform: 'uppercase',
                        marginBottom: '12px', letterSpacing: '.02em',
                    }}>
                        Early Bird <span style={{ color: '#00E5FF' }}>Ends In</span>
                    </h2>
                    <p style={{ fontSize: '13px', color: '#8B8BAF', letterSpacing: '.08em', marginBottom: '52px', fontWeight: 300 }}>
                        Register before{' '}
                        <span style={{ color: '#00E5FF' }}>
                            {new Date(earlyBirdDate + 'T00:00:00+05:00').toLocaleDateString('en-US', {
                                month: 'long', day: 'numeric', year: 'numeric',
                            })}
                        </span>{' '}
                        to unlock early bird pricing
                    </p>

                    {countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0 ? (
                        <p style={{ fontFamily: "'Russo One', sans-serif", fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#A855F7', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                            Early Bird Registration Closed
                        </p>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(12px,3vw,28px)', flexWrap: 'wrap' }}>
                            {([
                                { val: countdown.days,    lbl: 'Days' },
                                { val: countdown.hours,   lbl: 'Hours' },
                                { val: countdown.minutes, lbl: 'Minutes' },
                                { val: countdown.seconds, lbl: 'Seconds' },
                            ] as const).map(({ val, lbl }) => (
                                <div key={lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                                    <div style={{
                                        width: 'clamp(80px,14vw,120px)', height: 'clamp(80px,14vw,120px)',
                                        background: 'linear-gradient(135deg, rgba(0,229,255,0.12), rgba(168,85,247,0.18))',
                                        border: '1px solid rgba(0,229,255,0.25)',
                                        borderRadius: '16px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 0 30px rgba(0,229,255,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
                                        position: 'relative', overflow: 'hidden',
                                    }}>
                                        {/* inner shimmer line */}
                                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.4), transparent)' }} />
                                        <span style={{
                                            fontFamily: "'Russo One', sans-serif",
                                            fontSize: 'clamp(2rem,5vw,3.2rem)',
                                            background: 'linear-gradient(135deg, #00E5FF, #A855F7)',
                                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text', lineHeight: 1,
                                            fontVariantNumeric: 'tabular-nums',
                                        }}>
                                            {String(val).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#8B8BAF' }}>{lbl}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            )}

            {/* ── GALLERY ────────────────────────────────────────────── */}
            <section id="gallery" style={{ padding: 'clamp(72px,13vh,128px) clamp(20px,7vw,110px)', background: '#08071A' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <p className="sec-label">Gallery</p>
                    <h2 className="sec-heading" style={{ marginBottom: '48px' }}>
                        MOMENTS THAT<br /><span>DEFINE US</span>
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '8px' }}>
                        {galleryItems.map((item, i) => (
                            <div key={item.id} className="gal-item"
                                style={{ aspectRatio: item.wide ? '16/7' : '4/3', gridColumn: item.wide ? 'span 2' : undefined }}
                                onMouseEnter={() => setHoveredGal(i)}
                                onMouseLeave={() => setHoveredGal(null)}
                            >
                                <img
                                    src={item.image_url}
                                    alt={item.label}
                                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div className="gal-overlay" />
                                <div className="gal-label">{item.label}</div>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hoveredGal === i ? .3 : .08, transition: 'opacity .3s' }}>
                                    <Activity size={36} color="#00E5FF" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SOCIALS ─────────────────────────────────────────────── */}
            <section id="socials" style={{ position: 'relative', padding: 'clamp(72px,13vh,128px) clamp(20px,7vw,110px)', background: '#08071A' }}>
                <div className="divider" style={{ position: 'absolute', top: 0, left: '8%', right: '8%' }} />

                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p className="sec-label">Socials</p>
                    <h2 className="sec-heading" style={{ marginBottom: '12px' }}>
                        EVENING<br /><span>EVENTS</span>
                    </h2>
                    <p style={{ color: '#8B8BAF', fontSize: '14px', fontWeight: 300, lineHeight: 1.8, maxWidth: '560px', marginBottom: '48px' }}>
                        Two flagship socials alongside the league. Delegate rates apply when you register as part of a delegation; outsider rates are for guests who are not on a registered delegation.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))', gap: '20px' }}>
                        {socialEvents.map((ev, i) => {
                            const Icon = socialEventIcon(ev.slug);
                            return (
                                <div
                                    key={ev.slug}
                                    className="mod-card"
                                    onMouseEnter={() => setHoveredSoc(i)}
                                    onMouseLeave={() => setHoveredSoc(null)}
                                >
                                    {ev.image_url ? (
                                        <img src={ev.image_url} alt={ev.name} className="mod-cover" />
                                    ) : (
                                        <div className="mod-cover-fallback">
                                            <div className="mod-icon" style={{ color: hoveredSoc === i ? '#00E5FF' : undefined }}>
                                                <Icon size={38} />
                                            </div>
                                        </div>
                                    )}
                                    <div className="mod-name">{ev.name}</div>
                                    <div className="mod-desc" style={{ minHeight: 'auto', marginBottom: '18px' }}>
                                        Photos and full descriptions can be published from admin later. Pricing below is shown in Pakistani Rupees.
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(0,229,255,0.14)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#8B8BAF' }}>
                                                Delegate (registered)
                                            </span>
                                            <span
                                                className="mod-fee"
                                                style={{
                                                    fontSize: 'clamp(1.15rem, 3.5vw + 0.5rem, 1.65rem)',
                                                    textAlign: 'right',
                                                }}
                                            >
                                                {formatSocialPkrAmount(ev.delegate_pkr)}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#8B8BAF' }}>
                                                Non-delegate (outsider)
                                            </span>
                                            <span
                                                className="mod-fee"
                                                style={{
                                                    fontSize: 'clamp(1.15rem, 3.5vw + 0.5rem, 1.65rem)',
                                                    textAlign: 'right',
                                                }}
                                            >
                                                {formatSocialPkrAmount(ev.outsider_pkr)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── MODULES ────────────────────────────────────────────── */}
            <section id="modules" style={{ position: 'relative', padding: 'clamp(72px,13vh,128px) clamp(20px,7vw,110px)', background: '#0D0C25' }}>
                <div className="divider" style={{ position: 'absolute', top: 0, left: '8%', right: '8%' }} />

                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p className="sec-label">Modules</p>
                    <h2 className="sec-heading" style={{ marginBottom: '12px' }}>
                        CHOOSE YOUR<br /><span>ARENA</span>
                    </h2>
                    <p style={{ color: '#8B8BAF', fontSize: '14px', fontWeight: 300, lineHeight: 1.8, maxWidth: '400px', marginBottom: '52px' }}>
                        Eight competitions. Eight chances to prove yourself. Max two per delegate.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))', gap: '20px' }}>
                        {modules.map((mod, i) => {
                            const Icon = moduleIcon(mod.name);
                            const displayPrice = mod.normal_price ?? 'TBD';
                            return (
                                <div key={mod.id} className="mod-card"
                                    onMouseEnter={() => setHoveredMod(i)}
                                    onMouseLeave={() => setHoveredMod(null)}
                                >
                                    {mod.image_url ? (
                                        <img src={mod.image_url} alt={mod.name} className="mod-cover" />
                                    ) : (
                                        <div className="mod-cover-fallback">
                                            <div className="mod-icon"><Icon size={38} /></div>
                                        </div>
                                    )}
                                    <div className="mod-name">{mod.name}</div>
                                    <div className="mod-desc">{mod.intro}</div>
                                    <div className="mod-footer">
                                        <div className="mod-fee-col">
                                            <div className="mod-fee">{displayPrice}</div>
                                        </div>
                                        <Link href="/register" className="mod-register-btn">
                                            <ShoppingCart size={20} />
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── CONTACT ────────────────────────────────────────────── */}
            <section id="contact" style={{ padding: 'clamp(72px,13vh,128px) clamp(20px,7vw,110px)', background: '#08071A' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p className="sec-label">Contact</p>
                    <h2 className="sec-heading" style={{ marginBottom: '56px' }}>
                        GET IN<br /><span>TOUCH</span>
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 'clamp(48px,8vw,96px)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <p style={{ color: '#8B8BAF', fontSize: '14px', lineHeight: 1.75, fontWeight: 300 }}>
                                Reach the Karachi Gala League team by email or phone. Tap below to open your mail app.
                            </p>
                            <a
                                href="mailto:kgl2k26@gmail.com?subject=Karachi%20Gala%20League%20inquiry"
                                className="btn-holo"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', width: 'fit-content', textDecoration: 'none' }}
                            >
                                <Mail size={18} />
                                Email kgl2k26@gmail.com
                            </a>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            <div>
                                <h3 style={{ fontFamily: 'Russo One, sans-serif', fontSize: '18px', textTransform: 'uppercase', color: '#F0EEFF', marginBottom: '24px', letterSpacing: '.05em' }}>Contact Info</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', color: '#8B8BAF', fontSize: '13px', lineHeight: 1.7, fontWeight: 300 }}>
                                        <Mail size={15} color="#00E5FF" style={{ marginTop: '3px', flexShrink: 0 }} />
                                        <a href="mailto:kgl2k26@gmail.com" style={{ color: '#B9B8D8', textDecoration: 'none', borderBottom: '1px solid rgba(0,229,255,0.25)' }}>
                                            kgl2k26@gmail.com
                                        </a>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', color: '#8B8BAF', fontSize: '13px', lineHeight: 1.7, fontWeight: 300 }}>
                                        <Phone size={15} color="#00E5FF" style={{ marginTop: '3px', flexShrink: 0 }} />
                                        <span style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <a href="tel:+923322449363" style={{ color: '#B9B8D8', textDecoration: 'none' }}>0332 244 9363</a>
                                            <a href="tel:+923352314757" style={{ color: '#B9B8D8', textDecoration: 'none' }}>0335 231 4757</a>
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', color: '#8B8BAF', fontSize: '13px', lineHeight: 1.7, fontWeight: 300 }}>
                                        <MapPin size={15} color="#00E5FF" style={{ marginTop: '3px', flexShrink: 0 }} />
                                        IBA Main Campus, University Road, Karachi
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontFamily: 'Russo One, sans-serif', fontSize: '18px', textTransform: 'uppercase', color: '#F0EEFF', marginBottom: '18px', letterSpacing: '.05em' }}>Follow Us</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                    <a
                                        href="https://www.instagram.com/kgl2k26/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-btn"
                                        aria-label="Instagram @kgl2k26"
                                        style={{ textDecoration: 'none', display: 'inline-flex' }}
                                    >
                                        <Instagram size={17} />
                                    </a>
                                    <span style={{ color: '#8B8BAF', fontSize: '14px' }}>
                                        Instagram:{' '}
                                        <a href="https://www.instagram.com/kgl2k26/" target="_blank" rel="noopener noreferrer" style={{ color: '#00E5FF', textDecoration: 'none' }}>
                                            @kgl2k26
                                        </a>
                                    </span>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(0,229,255,0.1)', paddingTop: '28px' }}>
                                <p style={{ fontSize: '16px', color: '#8B8BAF', lineHeight: 1.85, fontWeight: 300, fontStyle: 'italic' }}>
                                    "Every champion was once a contender who refused to give up."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ─────────────────────────────────────────────── */}
            <footer style={{ background: '#0D0C25', borderTop: '1px solid rgba(0,229,255,0.08)', padding: 'clamp(24px,4vh,40px) clamp(20px,7vw,110px)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <span style={{ fontFamily: 'Russo One, sans-serif', fontSize: '20px', background: 'linear-gradient(135deg, #00E5FF, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '.06em' }}>
                        KGL <span style={{ fontFamily: 'Chakra Petch, sans-serif', fontSize: '14px', fontWeight: 400, background: 'none', WebkitTextFillColor: '#8B8BAF' }}>2026</span>
                    </span>
                    <p style={{ fontSize: '11px', color: '#8B8BAF', letterSpacing: '.06em' }}>© 2026 Karachi Gala League · IBA Karachi</p>
                    <a href="https://www.instagram.com/kgl2k26/" target="_blank" rel="noopener noreferrer" aria-label="Instagram @kgl2k26" className="footer-link" style={{ display: 'inline-flex' }}>
                        <Instagram size={15} />
                    </a>
                </div>
            </footer>
        </>
    );
}
