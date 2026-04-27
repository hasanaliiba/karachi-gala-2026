import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Menu, X, Instagram, Twitter, Facebook, Mail, Phone, MapPin,
    Send, ChevronDown, Crown, Gamepad2, Target, Zap, Wind,
    Activity, Users, Dumbbell, ArrowRight,
} from 'lucide-react';

const MODULES = [
    { icon: Crown,    name: 'Chess',        desc: 'Strategic minds clash on 64 squares. Prove your intellect and foresight under pressure.' },
    { icon: Gamepad2, name: 'FIFA',         desc: 'Take to the virtual pitch — console gaming at its most competitive level.' },
    { icon: Target,   name: 'Carrom',       desc: 'A test of precision and steady hands. Pocket your way to victory.' },
    { icon: Zap,      name: 'Table Tennis', desc: 'Fast reflexes and sharp serves. Every single rally counts in this sport.' },
    { icon: Wind,     name: 'Badminton',    desc: 'Court battles of speed and stamina. Smash your way to the championship.' },
    { icon: Activity, name: 'Cricket',      desc: 'Bat, bowl, or field — cricket brings out the team spirit in every participant.' },
    { icon: Users,    name: 'Tug of War',   desc: 'Pull together as one. Pure strength and unity determine who wins.' },
    { icon: Dumbbell, name: 'Arm Wrestling',desc: 'One-on-one raw power. Step up and show who has the strongest grip.' },
];


export default function Welcome() {
    type GalleryItem = { id: number; label: string; image_url: string; wide: boolean; sort_order: number };

    const { earlyBirdDate, galleryItems } = usePage<{
        earlyBirdDate: string;
        galleryItems: GalleryItem[];
    }>().props;
    const [menuOpen, setMenuOpen]         = useState(false);
    const [scrolled, setScrolled]         = useState(false);
    const [hoveredMod, setHoveredMod]     = useState<number | null>(null);
    const [hoveredGal, setHoveredGal]     = useState<number | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', email: '', message: '' });

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

    const inputStyle = (name: string): React.CSSProperties => ({
        width: '100%',
        background: 'transparent',
        border: 'none',
        borderBottom: `1px solid ${focusedField === name ? '#00E5FF' : 'rgba(0,229,255,0.2)'}`,
        padding: '12px 0',
        fontFamily: "'Chakra Petch', sans-serif",
        fontSize: '14px',
        color: '#F0EEFF',
        outline: 'none',
        transition: 'border-color 0.25s',
    });

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
                    background: var(--s2); border-top: 2px solid rgba(0,229,255,0.15);
                    padding: clamp(20px,3vw,32px); cursor: pointer; transition: all .25s ease;
                    position: relative; overflow: hidden;
                }
                .mod-card::before {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(0,229,255,0.08), rgba(168,85,247,0.12), rgba(255,110,180,0.08));
                    opacity: 0; transition: opacity .25s;
                }
                .mod-card:hover { border-top-color: var(--c); }
                .mod-card:hover::before { opacity: 1; }
                .mod-card:hover .mod-icon { color: var(--c2); }
                .mod-card:hover .mod-name { color: var(--c); }
                .mod-icon { color: var(--c); margin-bottom: 16px; transition: color .25s; position: relative; z-index: 1; }
                .mod-name {
                    font-family: 'Russo One', sans-serif; font-size: 18px;
                    color: var(--text); margin-bottom: 8px; text-transform: uppercase;
                    transition: color .25s; position: relative; z-index: 1;
                }
                .mod-desc { font-size: 12px; color: var(--dim); line-height: 1.75; font-weight: 300; transition: color .25s; position: relative; z-index: 1; }
                .mod-card:hover .mod-desc { color: rgba(176,176,220,0.8); }
                .mod-num {
                    position: absolute; top: 12px; right: 16px;
                    font-family: 'Russo One', sans-serif; font-size: 11px;
                    color: rgba(0,229,255,0.15); transition: color .25s; z-index: 1;
                }
                .mod-card:hover .mod-num { color: rgba(0,229,255,0.3); }
                .mod-cta {
                    margin-top: 18px; font-size: 10px; letter-spacing: .18em;
                    text-transform: uppercase; color: var(--c);
                    display: flex; align-items: center; gap: 6px;
                    opacity: 0; transition: opacity .25s; position: relative; z-index: 1;
                }
                .mod-card:hover .mod-cta { opacity: 1; }

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
                <button onClick={() => scrollTo('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <span style={{ fontFamily: 'Russo One, sans-serif', fontSize: '22px', letterSpacing: '.06em', background: 'linear-gradient(135deg, #00E5FF, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KGL</span>
                    <span style={{ fontFamily: 'Chakra Petch, sans-serif', fontSize: '13px', color: '#8B8BAF', marginLeft: '6px', fontWeight: 400 }}>2026</span>
                </button>

                <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }} className="hidden md:flex">
                    {['home','about','gallery','modules','contact'].map(s => (
                        <span key={s} className="nav-link" onClick={() => scrollTo(s)}>{s}</span>
                    ))}
                </div>

                <Link href="/register" className="btn-holo hidden md:inline-flex">Register Now</Link>

                <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00E5FF', padding: '4px' }} className="flex md:hidden">
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {/* Mobile menu */}
            {menuOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,7,26,.97)', zIndex: 45, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '48px' }}>
                    <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#00E5FF' }}>
                        <X size={24} />
                    </button>
                    {['home','about','gallery','modules','contact'].map(s => (
                        <button key={s} onClick={() => scrollTo(s)} style={{ background: 'none', border: 'none', fontFamily: 'Russo One, sans-serif', fontSize: '40px', color: '#F0EEFF', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.05em', transition: 'color .2s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#00E5FF')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#F0EEFF')}>
                            {s}
                        </button>
                    ))}
                    <Link href="/register" className="btn-holo">Register Now</Link>
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
                    <p className="sec-label a1">IBA Karachi Presents</p>

                    <h1 className="a2" style={{ fontFamily: 'Russo One, sans-serif', fontSize: 'clamp(4rem,16vw,12rem)', lineHeight: .9, textTransform: 'uppercase', color: '#F0EEFF', letterSpacing: '-.01em' }}>
                        KARACHI<br />
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
                            { val: '20+', lbl: 'Competitions' },
                            { val: '1000+', lbl: 'Participants' },
                            { val: '4', lbl: 'Categories' },
                            { val: '1', lbl: 'Epic Day' },
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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,240px),1fr))', gap: '2px' }}>
                        {MODULES.map(({ icon: Icon, name, desc }, i) => (
                            <div key={name} className="mod-card"
                                onMouseEnter={() => setHoveredMod(i)}
                                onMouseLeave={() => setHoveredMod(null)}
                            >
                                <span className="mod-num">0{i + 1}</span>
                                <div className="mod-icon"><Icon size={28} /></div>
                                <div className="mod-name">{name}</div>
                                <div className="mod-desc">{desc}</div>
                                <div className="mod-cta">Register <ArrowRight size={11} /></div>
                            </div>
                        ))}
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
                        <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                            {([
                                { name: 'name',  label: 'Full Name', type: 'text',  ph: 'Your full name' },
                                { name: 'email', label: 'Email',     type: 'email', ph: 'you@example.com' },
                            ] as const).map(({ name, label, type, ph }) => (
                                <div key={name}>
                                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '.25em', textTransform: 'uppercase', color: '#00E5FF', marginBottom: '10px' }}>{label}</label>
                                    <input type={type} placeholder={ph} value={form[name as 'name'|'email']}
                                        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
                                        onFocus={() => setFocusedField(name)} onBlur={() => setFocusedField(null)}
                                        style={inputStyle(name)} />
                                </div>
                            ))}
                            <div>
                                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '.25em', textTransform: 'uppercase', color: '#00E5FF', marginBottom: '10px' }}>Message</label>
                                <textarea placeholder="Your message..." rows={4} value={form.message}
                                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                    onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
                                    style={{ ...inputStyle('message'), resize: 'none' }} />
                            </div>
                            <div>
                                <button type="submit" className="btn-holo" style={{}}>
                                    Send Message <Send size={13} />
                                </button>
                            </div>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            <div>
                                <h3 style={{ fontFamily: 'Russo One, sans-serif', fontSize: '18px', textTransform: 'uppercase', color: '#F0EEFF', marginBottom: '24px', letterSpacing: '.05em' }}>Contact Info</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    {[
                                        { Icon: Mail,   text: 'karachigala@iba.edu.pk' },
                                        { Icon: Phone,  text: '+92 21 3810 4700' },
                                        { Icon: MapPin, text: 'IBA Main Campus, University Road, Karachi' },
                                    ].map(({ Icon, text }) => (
                                        <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', color: '#8B8BAF', fontSize: '13px', lineHeight: 1.7, fontWeight: 300 }}>
                                            <Icon size={15} color="#00E5FF" style={{ marginTop: '3px', flexShrink: 0 }} />
                                            {text}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontFamily: 'Russo One, sans-serif', fontSize: '18px', textTransform: 'uppercase', color: '#F0EEFF', marginBottom: '18px', letterSpacing: '.05em' }}>Follow Us</h3>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                        <button key={i} aria-label="social" className="social-btn"><Icon size={17} /></button>
                                    ))}
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[Instagram, Facebook, Twitter].map((Icon, i) => (
                            <button key={i} aria-label="social" className="footer-link"><Icon size={15} /></button>
                        ))}
                    </div>
                </div>
            </footer>
        </>
    );
}
