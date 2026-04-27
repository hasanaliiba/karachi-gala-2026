import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/login');
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Head title="Admin Login" />

            <div className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm">
                <div className="mb-6 text-center">
                    <h1 className="text-xl font-semibold">KGL Admin</h1>
                    <p className="mt-1 text-sm text-gray-500">Sign in to your admin account</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            autoFocus
                            autoComplete="email"
                            placeholder="admin@example.com"
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="password">Password</Label>
                        <PasswordInput
                            id="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            autoComplete="current-password"
                            placeholder="Password"
                            required
                        />
                        <InputError message={errors.password} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" disabled={processing}>
                        {processing && <Spinner />}
                        Sign in
                    </Button>
                </form>
            </div>
        </div>
    );
}
