import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#08071A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Chakra Petch', sans-serif",
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Chakra+Petch:wght@300;400;500;600;700&display=swap');
                :root {
                    --c: #00E5FF;
                    --v: #A855F7;
                    --bg: #08071A;
                    --text: #F0EEFF;
                    --dim: #8B8BAF;
                }

                @keyframes kgl-prism-orb {
                    0%   { transform: translate(0,0) scale(1); }
                    33%  { transform: translate(40px,-30px) scale(1.1); }
                    66%  { transform: translate(-20px,20px) scale(0.95); }
                    100% { transform: translate(0,0) scale(1); }
                }
                @keyframes kgl-holo-shift {
                    0%   { background-position: 0% 50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes kgl-holo-glow {
                    0%,100% { box-shadow: 0 0 24px rgba(0,229,255,0.25); }
                    33%     { box-shadow: 0 0 40px rgba(168,85,247,0.35); }
                    66%     { box-shadow: 0 0 40px rgba(217,70,239,0.28); }
                }
                @keyframes kgl-shimmer {
                    0%   { transform: translateX(-120%) skewX(-20deg); opacity: 0; }
                    40%  { opacity: 0.6; }
                    100% { transform: translateX(220%) skewX(-20deg); opacity: 0; }
                }

                .kgl-input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid rgba(0,229,255,0.2);
                    padding: 12px 0;
                    font-family: 'Chakra Petch', sans-serif;
                    font-size: 14px;
                    color: var(--text);
                    outline: none;
                    transition: border-color 0.25s;
                }
                .kgl-input:focus { border-bottom-color: var(--c); }
                .kgl-input::placeholder { color: var(--dim); font-size: 13px; }

                .kgl-label {
                    display: block;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: .25em;
                    text-transform: uppercase;
                    color: var(--c);
                    margin-bottom: 10px;
                    font-family: 'Chakra Petch', sans-serif;
                }

                .kgl-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    background: linear-gradient(135deg, var(--c) 0%, var(--v) 50%, var(--c) 100%);
                    background-size: 200% auto;
                    color: var(--bg);
                    border: none;
                    font-family: 'Chakra Petch', sans-serif;
                    font-weight: 700;
                    font-size: 11px;
                    letter-spacing: .15em;
                    text-transform: uppercase;
                    padding: 14px 32px;
                    cursor: pointer;
                    transition: all .3s;
                    animation: kgl-holo-shift 3s linear infinite, kgl-holo-glow 3s ease-in-out infinite;
                    position: relative;
                    overflow: hidden;
                    margin-top: 8px;
                }
                .kgl-btn:disabled { opacity: 0.65; cursor: not-allowed; }
                .kgl-btn::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 40px; height: 100%;
                    background: rgba(255,255,255,0.35);
                    animation: kgl-shimmer 2.5s ease-in-out infinite;
                }

                .kgl-error {
                    font-size: 11px;
                    color: #EF4444;
                    margin-top: 6px;
                    font-family: 'Chakra Petch', sans-serif;
                    letter-spacing: .03em;
                }

                .kgl-link {
                    color: var(--c);
                    text-decoration: none;
                    font-size: 13px;
                    transition: color .2s;
                    font-family: 'Chakra Petch', sans-serif;
                }
                .kgl-link:hover { color: #80F4FF; }

                .kgl-pw-wrap {
                    position: relative;
                }
                .kgl-pw-toggle {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--dim);
                    padding: 4px;
                    transition: color .2s;
                    display: flex;
                    align-items: center;
                }
                .kgl-pw-toggle:hover { color: var(--c); }

                .kgl-checkbox-wrap {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                }
                .kgl-checkbox {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 16px; height: 16px;
                    border: 1px solid rgba(0,229,255,0.4);
                    background: transparent;
                    cursor: pointer;
                    position: relative;
                    flex-shrink: 0;
                    transition: all .2s;
                }
                .kgl-checkbox:checked {
                    background: var(--c);
                    border-color: var(--c);
                }
                .kgl-checkbox:checked::after {
                    content: '';
                    position: absolute;
                    top: 1px; left: 4px;
                    width: 5px; height: 9px;
                    border-right: 2px solid var(--bg);
                    border-bottom: 2px solid var(--bg);
                    transform: rotate(45deg);
                }
                .kgl-checkbox-label {
                    font-size: 13px;
                    color: var(--dim);
                    font-family: 'Chakra Petch', sans-serif;
                    font-weight: 400;
                    user-select: none;
                }
            `}</style>

            {/* Grid */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'linear-gradient(rgba(0,229,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,.025) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
            }} />

            {/* Orb 1 */}
            <div style={{
                position: 'absolute', width: '600px', height: '600px',
                borderRadius: '50%', pointerEvents: 'none',
                background: 'radial-gradient(ellipse, rgba(100,50,220,0.22) 0%, rgba(0,229,255,0.04) 60%, transparent 100%)',
                filter: 'blur(60px)',
                top: '-200px', left: '-200px',
                animation: 'kgl-prism-orb 18s ease-in-out infinite',
            }} />

            {/* Orb 2 */}
            <div style={{
                position: 'absolute', width: '500px', height: '500px',
                borderRadius: '50%', pointerEvents: 'none',
                background: 'radial-gradient(ellipse, rgba(217,70,239,0.18) 0%, rgba(168,85,247,0.06) 60%, transparent 100%)',
                filter: 'blur(60px)',
                bottom: '-150px', right: '-150px',
                animation: 'kgl-prism-orb 22s ease-in-out infinite reverse',
            }} />

            {/* Card */}
            <div style={{
                position: 'relative', zIndex: 1,
                width: '100%', maxWidth: '420px',
                background: 'rgba(13,12,37,0.88)',
                border: '1px solid rgba(0,229,255,0.18)',
                backdropFilter: 'blur(24px)',
                padding: 'clamp(32px,6vw,48px)',
            }}>
                {/* Top shimmer line */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.55), rgba(168,85,247,0.4), transparent)',
                }} />

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link href={home()} style={{ textDecoration: 'none', display: 'inline-block', lineHeight: 1 }}>
                        <span style={{
                            fontFamily: "'Russo One', sans-serif",
                            fontSize: '34px',
                            letterSpacing: '.06em',
                            background: 'linear-gradient(135deg, #00E5FF, #A855F7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>KGL</span>
                        <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '14px', color: '#8B8BAF', marginLeft: '6px', fontWeight: 400 }}>2026</span>
                    </Link>

                    <h1 style={{
                        fontFamily: "'Russo One', sans-serif",
                        fontSize: '16px',
                        color: '#F0EEFF',
                        textTransform: 'uppercase',
                        letterSpacing: '.1em',
                        marginTop: '18px',
                        marginBottom: '6px',
                    }}>{title}</h1>
                    {description && (
                        <p style={{ fontSize: '12px', color: '#8B8BAF', letterSpacing: '.03em', fontWeight: 300 }}>{description}</p>
                    )}
                </div>

                {children}

                <div style={{ textAlign: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(0,229,255,0.08)' }}>
                    <Link
                        href={home()}
                        style={{ fontSize: '10px', color: '#8B8BAF', textDecoration: 'none', letterSpacing: '.15em', textTransform: 'uppercase', fontFamily: "'Chakra Petch', sans-serif", transition: 'color .2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#00E5FF')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#8B8BAF')}
                    >← Back to KGL 2026</Link>
                </div>
            </div>
        </div>
    );
}
