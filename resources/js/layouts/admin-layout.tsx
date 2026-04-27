import { router } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export default function AdminLayout({ children }: PropsWithChildren) {
    function logout() {
        router.post('/admin/logout');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b bg-white px-6 py-4">
                <div className="mx-auto flex max-w-4xl items-center justify-between">
                    <span className="text-lg font-semibold tracking-tight">
                        KGL Admin
                    </span>
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
