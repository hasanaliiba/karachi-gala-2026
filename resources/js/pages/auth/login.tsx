import { Form, Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status, canResetPassword, canRegister }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Log in" />

            {status && (
                <div style={{ marginBottom: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--c)', letterSpacing: '.04em', fontFamily: "'Chakra Petch', sans-serif" }}>
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
            >
                {({ processing, errors }) => (
                    <>
                        <div>
                            <label className="kgl-label" htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                className="kgl-input"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                autoComplete="email"
                                placeholder="you@example.com"
                            />
                            {errors.email && <div className="kgl-error">{errors.email}</div>}
                        </div>

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <label className="kgl-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
                                {canResetPassword && (
                                    <Link href={request()} className="kgl-link" style={{ fontSize: '11px', letterSpacing: '.05em' }}>
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <div className="kgl-pw-wrap">
                                <input
                                    id="password"
                                    className="kgl-input"
                                    style={{ paddingRight: '32px' }}
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <button type="button" className="kgl-pw-toggle" onClick={() => setShowPassword(v => !v)} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {errors.password && <div className="kgl-error">{errors.password}</div>}
                        </div>

                        <label className="kgl-checkbox-wrap" style={{ marginTop: '-8px' }}>
                            <input type="checkbox" name="remember" className="kgl-checkbox" />
                            <span className="kgl-checkbox-label">Remember me</span>
                        </label>

                        <button type="submit" className="kgl-btn" disabled={processing}>
                            {processing && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                            Log In
                        </button>

                        {canRegister && (
                            <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--dim)', fontFamily: "'Chakra Petch', sans-serif" }}>
                                No account?{' '}
                                <Link href={register()} className="kgl-link">Sign up</Link>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Welcome Back',
    description: 'Sign in to your KGL account',
};
