import { Link, router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

const navLinks = [
    { href: '/admin/settings', label: 'Settings' },
    { href: '/admin/gallery',  label: 'Gallery' },
    { href: '/admin/modules',  label: 'Modules' },
];

export default function AdminLayout({ children }: PropsWithChildren) {
    const { url } = usePage();

    function logout() {
        router.post('/admin/logout');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b bg-white px-6 py-4">
                <div className="mx-auto flex max-w-4xl items-center justify-between">
                    <div className="flex items-center gap-6">
                        <span className="text-lg font-semibold tracking-tight">KGL Admin</span>
                        <nav className="flex gap-4">
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`text-sm font-medium transition-colors ${
                                        url.startsWith(href)
                                            ? 'text-gray-900 underline underline-offset-4'
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <button
                        onClick={logout}
                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                        Log out
                    </button>
                </div>
            </header>
            <main className="mx-auto max-w-4xl px-6 py-10">
                {children}
            </main>
        </div>
    );
}
