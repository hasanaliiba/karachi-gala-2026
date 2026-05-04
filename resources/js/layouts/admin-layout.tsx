import { Link, router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

const navLinks = [
    { href: '/admin/settings', label: 'Settings' },
    { href: '/admin/gallery',  label: 'Gallery' },
    { href: '/admin/modules',  label: 'Modules' },
    { href: '/admin/delegations',  label: 'Delegations' },
    { href: '/admin/social-registrations',  label: 'Social registrations' },
];

export default function AdminLayout({ children }: PropsWithChildren) {
    const { url } = usePage();

    function logout() {
        router.post('/admin/logout');
    }

    return (
        <div className="admin-dark" style={{ minHeight: '100vh', background: '#08071A', color: '#F0EEFF', fontFamily: "'Chakra Petch', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Chakra+Petch:wght@300;400;500;600;700&display=swap');

                .admin-dark {
                    --background: #0D0C25;
                    --foreground: #F0EEFF;
                    --card: #13123A;
                    --card-foreground: #F0EEFF;
                    --popover: #13123A;
                    --popover-foreground: #F0EEFF;
                    --primary: #00E5FF;
                    --primary-foreground: #08071A;
                    --secondary: #1a1940;
                    --secondary-foreground: #F0EEFF;
                    --muted: #13123A;
                    --muted-foreground: #8B8BAF;
                    --accent: rgba(0,229,255,0.12);
                    --accent-foreground: #F0EEFF;
                    --destructive: oklch(0.577 0.245 27.325);
                    --border: rgba(0,229,255,0.18);
                    --input: rgba(0,229,255,0.15);
                    --ring: rgba(0,229,255,0.4);
                    font-family: 'Chakra Petch', sans-serif;
                }

                .admin-nav-link {
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #8B8BAF;
                    text-decoration: none;
                    position: relative;
                    padding-bottom: 2px;
                    transition: color 0.2s;
                }
                .admin-nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0; left: 0;
                    width: 0; height: 2px;
                    background: linear-gradient(90deg, #00E5FF, #A855F7);
                    transition: width 0.25s ease;
                }
                .admin-nav-link:hover,
                .admin-nav-link.active { color: #00E5FF; }
                .admin-nav-link:hover::after,
                .admin-nav-link.active::after { width: 100%; }

                .admin-logout-btn {
                    font-family: 'Chakra Petch', sans-serif;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #00E5FF;
                    background: transparent;
                    border: 1px solid rgba(0,229,255,0.3);
                    padding: 8px 18px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .admin-logout-btn:hover {
                    background: rgba(0,229,255,0.08);
                    border-color: rgba(0,229,255,0.6);
                }
            `}</style>

            <header style={{
                background: '#0D0C25',
                borderBottom: '1px solid rgba(0,229,255,0.1)',
                padding: '16px 24px',
            }}>
                <div style={{ maxWidth: '896px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        <span style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{
                                fontFamily: 'Russo One, sans-serif',
                                fontSize: '18px',
                                letterSpacing: '.06em',
                                background: 'linear-gradient(135deg, #00E5FF, #A855F7)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>KGL</span>
                            <span style={{ fontSize: '11px', fontFamily: 'Chakra Petch, sans-serif', fontWeight: 400, color: '#8B8BAF' }}>
                                ADMIN
                            </span>
                        </span>
                        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`admin-nav-link${url.startsWith(href) ? ' active' : ''}`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <button onClick={logout} className="admin-logout-btn">
                        Log out
                    </button>
                </div>
            </header>

            <main style={{ maxWidth: '896px', margin: '0 auto', padding: '40px 24px' }}>
                {children}
            </main>
        </div>
    );
}
