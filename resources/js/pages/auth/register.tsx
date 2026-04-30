import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <>
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
            >
                {({ processing, errors }) => (
                    <>
                        <div>
                            <label className="kgl-label" htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                className="kgl-input"
                                type="text"
                                name="name"
                                required
                                autoFocus
                                autoComplete="name"
                                placeholder="Your full name"
                            />
                            {errors.name && <div className="kgl-error">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="kgl-label" htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                className="kgl-input"
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                            />
                            {errors.email && <div className="kgl-error">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="kgl-label" htmlFor="password">Password</label>
                            <div className="kgl-pw-wrap">
                                <input
                                    id="password"
                                    className="kgl-input"
                                    style={{ paddingRight: '32px' }}
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Password"
                                />
                                <button type="button" className="kgl-pw-toggle" onClick={() => setShowPassword(v => !v)} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {errors.password && <div className="kgl-error">{errors.password}</div>}
                        </div>

                        <div>
                            <label className="kgl-label" htmlFor="password_confirmation">Confirm Password</label>
                            <div className="kgl-pw-wrap">
                                <input
                                    id="password_confirmation"
                                    className="kgl-input"
                                    style={{ paddingRight: '32px' }}
                                    type={showConfirm ? 'text' : 'password'}
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                />
                                <button type="button" className="kgl-pw-toggle" onClick={() => setShowConfirm(v => !v)} tabIndex={-1} aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {errors.password_confirmation && <div className="kgl-error">{errors.password_confirmation}</div>}
                        </div>

                        <button type="submit" className="kgl-btn" disabled={processing}>
                            {processing && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                            Create Account
                        </button>

                        <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--dim)', fontFamily: "'Chakra Petch', sans-serif" }}>
                            Already registered?{' '}
                            <Link href={login()} className="kgl-link">Log in</Link>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Join KGL 2026',
    description: 'Create your account to register for events',
};
