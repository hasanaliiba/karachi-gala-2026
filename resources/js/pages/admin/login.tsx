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
        <div className="admin-dark" style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#08071A',
            color: '#F0EEFF',
            fontFamily: "'Chakra Petch', sans-serif",
            padding: '16px',
        }}>
            <Head title="Admin Login" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Chakra+Petch:wght@300;400;500;600;700&display=swap');
                .admin-dark {
                    --background: #0D0C25;
                    --foreground: #F0EEFF;
                    --primary: #00E5FF;
                    --primary-foreground: #08071A;
                    --muted-foreground: #8B8BAF;
                    --accent: rgba(0,229,255,0.12);
                    --accent-foreground: #F0EEFF;
                    --border: rgba(0,229,255,0.18);
                    --input: rgba(0,229,255,0.15);
                    --ring: rgba(0,229,255,0.4);
                    font-family: 'Chakra Petch', sans-serif;
                }
            `}</style>

            <div style={{
                width: '100%',
                maxWidth: '384px',
                background: '#13123A',
                borderTop: '2px solid rgba(0,229,255,0.3)',
                padding: '36px 32px',
                boxShadow: '0 0 60px rgba(0,229,255,0.06), 0 0 120px rgba(168,85,247,0.04)',
            }}>
                <div style={{ marginBottom: '28px', textAlign: 'center' }}>
                    <h1 style={{
                        fontFamily: 'Russo One, sans-serif',
                        fontSize: '26px',
                        letterSpacing: '.08em',
                        background: 'linear-gradient(135deg, #00E5FF, #A855F7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textTransform: 'uppercase',
                    }}>KGL Admin</h1>
                    <p style={{ marginTop: '8px', fontSize: '13px', color: '#8B8BAF', letterSpacing: '.04em' }}>
                        Sign in to your admin account
                    </p>
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
