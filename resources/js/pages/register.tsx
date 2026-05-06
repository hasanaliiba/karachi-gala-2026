import { Head } from '@inertiajs/react';
import {
    Check, ArrowRight, ArrowLeft, Shield,
    X, Printer, ChevronDown, ChevronUp,
    AlertCircle, Upload, Crown, Gamepad2, Target,
    Zap, Wind, Activity, Users,
    Music, Layers, Dice5, Swords,
} from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const SPORTS = [
    { name: 'Futsal',       price: 8000, Icon: Activity },
    { name: 'Throwball',    price: 8000, Icon: Zap },
    { name: 'Paddle',       price: 2500, Icon: Layers },
    { name: 'Badminton',    price: 1000, Icon: Wind },
    { name: 'Basketball',   price: 8000, Icon: Target },
    { name: 'Dodgeball',    price: 6000, Icon: Users },
    { name: 'Table Tennis', price: 1000, Icon: Zap },
];

const MODULES = [
    { name: 'CSI',             price: 4000, Icon: Shield },
    { name: 'Traitors',        price: 2000, Icon: Swords },
    { name: 'Ludo',            price: 1000, Icon: Dice5 },
    { name: 'Min2Win It',      price: 1000, Icon: Crown },
    { name: 'Chess',           price: 1000, Icon: Crown },
    { name: 'FIFA',            price: 1500, Icon: Gamepad2 },
    { name: 'Battle of Bands', price: 6000, Icon: Music },
];

const ALL_EVENTS = [...SPORTS, ...MODULES];

const RULES = [
    'One student can register only once for the same event.',
    'Registration closes after the deadline — no exceptions.',
    'Strict legal action will be taken against vandalising any property.',
    'No arguments with management under any circumstances.',
    'Respect judges and accept their decisions.',
    'Management is not responsible for loss of personal belongings.',
    'Only one person allowed per pass — non-transferable.',
    'No outside food or drink allowed on premises.',
    'Strict prohibition of weapons and drugs — violators face immediate legal action.',
    'Each player may compete in at most two games total (roster step in the authenticated portal).',
];

const EVENT_NAME  = 'Karachi Gala League 2026';
const EVENT_DATE  = 'Spring 2026 · Date TBA';
const EVENT_VENUE = 'Venue TBA · Karachi';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function genCode(): string {
    const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    return 'KGL-2026-' + Array.from({ length: 6 }, () => c[Math.floor(Math.random() * c.length)]).join('');
}

function QRCode({ value }: { value: string }) {
    const sz = 21, cell = 10;
    const grid: boolean[][] = Array.from({ length: sz }, (_, i) =>
        Array.from({ length: sz }, (_, j) => {
            return ((value.charCodeAt((i * sz + j) % value.length) * (i + 3) * (j + 7)) % 3) !== 0;
        }),
    );
    const fp = (r: number, c: number) => {
        for (let i = 0; i < 7; i++) {
for (let j = 0; j < 7; j++) {
grid[r + i][c + j] = i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4);
}
}
    };
    fp(0, 0); fp(0, sz - 7); fp(sz - 7, 0);

    return (
        <svg width={sz * cell} height={sz * cell} viewBox={`0 0 ${sz * cell} ${sz * cell}`} style={{ background: '#fff', display: 'block' }}>
            {grid.flatMap((row, i) => row.map((on, j) =>
                on ? <rect key={`${i}-${j}`} x={j * cell} y={i * cell} width={cell} height={cell} fill="#08071A" /> : null,
            ))}
        </svg>
    );
}

// ─── TAB BAR ─────────────────────────────────────────────────────────────────

const TAB_LABELS = ['Portal', 'Registration', 'Payment', 'Voucher', 'Confirmation'];

function TabBar({ active, max, onSelect }: { active: number; max: number; onSelect: (t: number) => void }) {
    return (
        <div style={{ display: 'flex', background: '#0D0C25', borderBottom: '1px solid rgba(0,229,255,0.1)', overflowX: 'auto' }}>
            {TAB_LABELS.map((label, i) => {
                const tab = i + 1;
                const isActive   = active === tab;
                const isDisabled = tab > max;

                return (
                    <button key={tab} onClick={() => !isDisabled && onSelect(tab)}
                        style={{
                            flex: '0 0 auto', padding: '16px 20px',
                            background: isActive ? 'rgba(0,229,255,0.07)' : 'none',
                            border: 'none', borderBottom: isActive ? '2px solid #00E5FF' : '2px solid transparent',
                            cursor: isDisabled ? 'default' : 'pointer',
                            color: isActive ? '#00E5FF' : isDisabled ? 'rgba(139,139,175,.3)' : '#8B8BAF',
                            fontFamily: "'Chakra Petch', sans-serif", fontWeight: isActive ? 700 : 400,
                            fontSize: '11px', letterSpacing: '.15em', textTransform: 'uppercase',
                            display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
                            transition: 'all .2s',
                        }}>
                        <span style={{
                            width: '20px', height: '20px', borderRadius: '2px', flexShrink: 0,
                            background: isActive
                                ? 'linear-gradient(135deg, #00E5FF, #A855F7)'
                                : isDisabled ? 'rgba(0,229,255,0.05)' : 'rgba(0,229,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', fontWeight: 800,
                            color: isActive ? '#08071A' : isDisabled ? 'rgba(0,229,255,0.2)' : '#00E5FF',
                        }}>{tab}</span>
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

// ─── SHARED STYLES ───────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '10px', fontWeight: 700,
    letterSpacing: '.25em', textTransform: 'uppercase', color: '#00E5FF', marginBottom: '10px',
};

function inputSt(focused: boolean): React.CSSProperties {
    return {
        width: '100%', background: 'transparent', border: 'none',
        borderBottom: `1px solid ${focused ? '#00E5FF' : 'rgba(0,229,255,0.2)'}`,
        padding: '12px 0', fontFamily: "'Chakra Petch', sans-serif",
        fontSize: '14px', color: '#F0EEFF', outline: 'none',
        transition: 'border-color .25s',
    };
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Register() {
    const [tab, setTab]               = useState(1);
    const [max, setMax]               = useState(1);
    const [rulesOpen, setRulesOpen]   = useState(false);
    const [selected, setSelected]     = useState<string[]>([]);
    const [payMethod, setPayMethod]   = useState<'online' | 'onsite' | null>(null);
    const [voucher, setVoucher]       = useState<File | null>(null);
    const [preview, setPreview]       = useState<string | null>(null);
    const [dragging, setDragging]     = useState(false);
    const [focused, setFocused]       = useState<string | null>(null);
    const [delCode]                   = useState(genCode);
    const [form, setForm]             = useState({
        fullName: '', cnic: '', studentId: '', institute: '',
        email: '', contact: '', emergency: '', undertaking: false,
    });
    const fileRef = useRef<HTMLInputElement>(null);

    const totalFee  = selected.reduce((s, n) => s + (ALL_EVENTS.find(e => e.name === n)?.price ?? 0), 0);
    const onlineAmt = totalFee;
    const onsiteNow = Math.ceil(totalFee * .75);
    const onsiteRem = totalFee - onsiteNow;

    const toggleGame = (name: string) =>
        setSelected((p) => (p.includes(name) ? p.filter((g) => g !== name) : [...p, name]));

    const handleFile = useCallback((file: File) => {
        setVoucher(file);
        const r = new FileReader();
        r.onload = e => setPreview(e.target?.result as string);
        r.readAsDataURL(file);
    }, []);

    const goTo = (n: number) => {
        setTab(n);
        setMax(m => Math.max(m, n));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const canTab2 = form.fullName && form.cnic && form.studentId && form.institute &&
        form.email && form.contact && selected.length >= 1 && form.undertaking;

    const bind = (name: keyof typeof form) => ({
        value: form[name] as string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [name]: e.target.value })),
        onFocus: () => setFocused(name),
        onBlur: () => setFocused(null),
        style: inputSt(focused === name),
    });

    const GameRow = ({ name, price, Icon: IconComp }: { name: string; price: number; Icon: React.ElementType; side: 'sport' | 'module' }) => {
        const isSel = selected.includes(name);
        const isOff = false;

        return (
            <div onClick={() => !isOff && toggleGame(name)}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 16px', cursor: isOff ? 'default' : 'pointer',
                    background: isSel ? 'rgba(0,229,255,0.08)' : 'transparent',
                    borderBottom: '1px solid rgba(0,229,255,0.05)', opacity: isOff ? .35 : 1,
                    transition: 'background .2s',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '18px', height: '18px',
                        border: `1px solid ${isSel ? '#00E5FF' : 'rgba(0,229,255,0.3)'}`,
                        background: isSel ? 'linear-gradient(135deg, #00E5FF, #A855F7)' : 'transparent',
                        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s',
                    }}>
                        {isSel && <Check size={11} color="#08071A" strokeWidth={3} />}
                    </div>
                    <IconComp size={13} color={isSel ? '#00E5FF' : '#8B8BAF'} />
                    <span style={{ fontSize: '13px', color: isSel ? '#00E5FF' : '#9D9DC0', fontWeight: isSel ? 600 : 300, transition: 'color .2s' }}>{name}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#00E5FF', fontFamily: "'Russo One', sans-serif" }}>
                    {price >= 1000 ? `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}K` : price}
                </span>
            </div>
        );
    };

    const BackBtn = ({ to }: { to: number }) => (
        <button onClick={() => goTo(to)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px solid rgba(0,229,255,0.2)', color: '#8B8BAF', padding: '14px 24px', fontFamily: "'Chakra Petch', sans-serif", fontSize: '11px', letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => {
 e.currentTarget.style.borderColor = '#00E5FF'; e.currentTarget.style.color = '#00E5FF'; 
}}
            onMouseLeave={e => {
 e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)'; e.currentTarget.style.color = '#8B8BAF'; 
}}>
            <ArrowLeft size={13} /> Back
        </button>
    );

    const NextBtn = ({ label, to, disabled }: { label: string; to: number; disabled?: boolean }) => (
        <button onClick={() => !disabled && goTo(to)}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: disabled ? 'rgba(0,229,255,0.07)' : 'linear-gradient(135deg, #00E5FF, #A855F7)',
                backgroundSize: '200% auto',
                color: disabled ? 'rgba(0,229,255,0.3)' : '#08071A',
                border: 'none', padding: '14px 32px', fontFamily: "'Chakra Petch', sans-serif",
                fontWeight: 700, fontSize: '11px', letterSpacing: '.15em', textTransform: 'uppercase',
                cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all .25s',
            }}>
            {label} <ArrowRight size={13} />
        </button>
    );

    const Section = ({ children }: { children: React.ReactNode }) => (
        <div style={{ maxWidth: '880px', margin: '0 auto', padding: 'clamp(32px,6vw,60px) clamp(20px,5vw,44px)' }}>
            {children}
        </div>
    );

    const StepLabel = ({ step }: { step: string }) => (
        <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '.35em', textTransform: 'uppercase', color: '#00E5FF', marginBottom: '8px' }}>{step}</p>
    );

    const Heading = ({ children }: { children: React.ReactNode }) => (
        <h2 style={{ fontFamily: "'Russo One', sans-serif", fontSize: 'clamp(2rem,5vw,3rem)', color: '#F0EEFF', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: '40px' }}>{children}</h2>
    );

    // ── TAB 1 ──────────────────────────────────────────────────────────────
    const renderTab1 = () => (
        <Section>
            <div style={{ textAlign: 'center', paddingBottom: '52px', borderBottom: '1px solid rgba(0,229,255,0.08)', marginBottom: '48px' }}>
                <div style={{ display: 'inline-block', padding: '6px 20px', border: '1px solid rgba(0,229,255,0.25)', fontFamily: "'Chakra Petch', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '.4em', color: '#00E5FF', textTransform: 'uppercase', marginBottom: '32px' }}>
                    Official Registration Portal
                </div>

                <h1 style={{ fontFamily: "'Russo One', sans-serif", fontSize: 'clamp(4rem,14vw,8rem)', lineHeight: .9, textTransform: 'uppercase', background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 50%, #FF6EB4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '10px' }}>KGL</h1>
                <p style={{ fontFamily: "'Russo One', sans-serif", fontSize: 'clamp(1rem,3vw,1.6rem)', color: '#00E5FF', letterSpacing: '.25em', textTransform: 'uppercase', marginBottom: '10px' }}>
                    DELEGATION PORTAL
                </p>
                <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '12px', color: '#8B8BAF', letterSpacing: '.1em', marginBottom: '44px' }}>
                    {EVENT_VENUE}
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px', border: '1px solid rgba(0,229,255,0.12)', overflow: 'hidden' }}>
                    {[
                        { label: 'Event',  value: 'Karachi Gala League 2026' },
                        { label: 'Date',   value: 'Spring 2026 · TBA' },
                        { label: 'Games / player',  value: 'Max 2 (portal)' },
                    ].map(({ label, value }, i, a) => (
                        <div key={label} style={{ padding: '18px 28px', borderRight: i < a.length - 1 ? '1px solid rgba(0,229,255,0.12)' : 'none', textAlign: 'center', flex: '1 0 auto' }}>
                            <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '.3em', textTransform: 'uppercase', color: '#00E5FF', marginBottom: '6px' }}>{label}</div>
                            <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '13px', color: '#F0EEFF', fontWeight: 400 }}>{value}</div>
                        </div>
                    ))}
                </div>

                <button onClick={() => goTo(2)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 50%, #00E5FF 100%)', backgroundSize: '200% auto', color: '#08071A', border: 'none', padding: '18px 48px', fontFamily: "'Russo One', sans-serif", fontSize: '14px', letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .3s', boxShadow: '0 0 30px rgba(0,229,255,0.2)' }}
                    onMouseEnter={e => {
 e.currentTarget.style.backgroundPosition = 'right center'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,229,255,0.4)'; 
}}
                    onMouseLeave={e => {
 e.currentTarget.style.backgroundPosition = 'left center'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,229,255,0.2)'; 
}}>
                    CLICK TO REGISTER <ArrowRight size={16} />
                </button>
            </div>

            <div style={{ border: '1px solid rgba(0,229,255,0.12)', background: '#13123A' }}>
                <button onClick={() => setRulesOpen(o => !o)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Shield size={15} color="#00E5FF" />
                        <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#00E5FF' }}>Rules & Regulations</span>
                    </div>
                    {rulesOpen ? <ChevronUp size={15} color="#00E5FF" /> : <ChevronDown size={15} color="#00E5FF" />}
                </button>
                {rulesOpen && (
                    <div style={{ padding: '0 22px 26px', borderTop: '1px solid rgba(0,229,255,0.06)' }}>
                        <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '18px' }}>
                            {RULES.map((r, i) => (
                                <li key={i} style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '13px', color: '#8B8BAF', lineHeight: 1.8, fontWeight: 300 }}>{r}</li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </Section>
    );

    // ── TAB 2 ──────────────────────────────────────────────────────────────
    const renderTab2 = () => (
        <Section>
            <StepLabel step="Step 1 of 4" />
            <Heading>EVENT<br /><span style={{ color: '#00E5FF' }}>REGISTRATION</span></Heading>

            <div style={{ marginBottom: '48px', border: '1px solid rgba(0,229,255,0.12)', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(0,229,255,0.06)', padding: '12px 18px', borderBottom: '1px solid rgba(0,229,255,0.1)', fontFamily: "'Chakra Petch', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '.25em', textTransform: 'uppercase', color: '#00E5FF' }}>
                    Select Events — Delegation Fees (full roster & pricing in logged-in portal)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(0,229,255,0.04)' }}>
                    <div style={{ background: '#13123A' }}>
                        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(0,229,255,0.06)', fontFamily: "'Chakra Petch', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#8B8BAF' }}>Sports</div>
                        {SPORTS.map(({ name, price, Icon }) => <GameRow key={name} name={name} price={price} Icon={Icon} side="sport" />)}
                    </div>
                    <div style={{ background: '#13123A' }}>
                        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(0,229,255,0.06)', fontFamily: "'Chakra Petch', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#8B8BAF' }}>Modules</div>
                        {MODULES.map(({ name, price, Icon }) => <GameRow key={name} name={name} price={price} Icon={Icon} side="module" />)}
                    </div>
                </div>
                {selected.length > 0 && (
                    <div style={{ padding: '14px 18px', background: 'rgba(0,229,255,0.06)', borderTop: '1px solid rgba(0,229,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '11px', color: '#8B8BAF' }}>{selected.join(' + ')}</span>
                        <span style={{ fontFamily: "'Russo One', sans-serif", fontSize: '22px', background: 'linear-gradient(135deg, #00E5FF, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Rs {totalFee.toLocaleString()}</span>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gap: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '32px' }}>
                    <div><label style={labelStyle}>Full Name <span style={{ color: '#EF4444' }}>*</span></label><input type="text" placeholder="Your full name" {...bind('fullName')} /></div>
                    <div><label style={labelStyle}>CNIC <span style={{ color: '#EF4444' }}>*</span></label><input type="text" placeholder="XXXXX-XXXXXXX-X" {...bind('cnic')} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '32px' }}>
                    <div><label style={labelStyle}>Student ID <span style={{ color: '#EF4444' }}>*</span></label><input type="text" placeholder="Institution student ID" {...bind('studentId')} /></div>
                    <div><label style={labelStyle}>Institute Name <span style={{ color: '#EF4444' }}>*</span></label><input type="text" placeholder="Your institution" {...bind('institute')} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '32px' }}>
                    <div><label style={labelStyle}>Email <span style={{ color: '#EF4444' }}>*</span></label><input type="email" placeholder="you@example.com" {...bind('email')} /></div>
                    <div><label style={labelStyle}>Contact <span style={{ color: '#EF4444' }}>*</span></label><input type="tel" placeholder="+92 3XX XXXXXXX" {...bind('contact')} /></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '32px' }}>
                    {[
                        { label: 'Event Name', value: EVENT_NAME },
                        { label: 'Date & Time', value: EVENT_DATE },
                        { label: 'Venue',       value: 'Venue TBA' },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <label style={labelStyle}>{label}</label>
                            <div style={{ ...inputSt(false), color: '#8B8BAF', cursor: 'not-allowed', fontSize: '13px', borderBottomColor: 'rgba(0,229,255,0.06)' }}>{value}</div>
                        </div>
                    ))}
                </div>

                <div><label style={labelStyle}>Emergency Contact <span style={{ fontStyle: 'normal', fontWeight: 300, color: '#8B8BAF', letterSpacing: 'normal', textTransform: 'none' }}>(Optional)</span></label><input type="tel" placeholder="Emergency contact number" {...bind('emergency')} /></div>

                <div onClick={() => setForm(p => ({ ...p, undertaking: !p.undertaking }))}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer', padding: '18px', border: `1px solid ${form.undertaking ? 'rgba(0,229,255,0.35)' : 'rgba(0,229,255,0.1)'}`, background: form.undertaking ? 'rgba(0,229,255,0.04)' : 'transparent', transition: 'all .25s' }}>
                    <div style={{ width: '20px', height: '20px', border: `1px solid ${form.undertaking ? '#00E5FF' : 'rgba(0,229,255,0.3)'}`, background: form.undertaking ? 'linear-gradient(135deg, #00E5FF, #A855F7)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px', transition: 'all .2s' }}>
                        {form.undertaking && <Check size={12} color="#08071A" strokeWidth={3} />}
                    </div>
                    <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '13px', color: '#8B8BAF', lineHeight: 1.8, fontWeight: 300 }}>
                        I have read and agree to all <span style={{ color: '#00E5FF' }}>Rules & Regulations</span> of Karachi Gala League 2026. I take full responsibility for my conduct and understand that violations may result in disqualification or legal action.
                    </p>
                </div>

                {!canTab2 && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '12px 16px', background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)' }}>
                        <AlertCircle size={14} color="rgba(239,68,68,.8)" />
                        <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '12px', color: 'rgba(239,68,68,.7)', fontWeight: 300 }}>
                            Complete all required fields, select at least one event, and accept the undertaking.
                        </span>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <NextBtn label="Proceed to Payment" to={3} disabled={!canTab2} />
                </div>
            </div>
        </Section>
    );

    // ── TAB 3 ──────────────────────────────────────────────────────────────
    const renderTab3 = () => (
        <Section>
            <StepLabel step="Step 2 of 4" />
            <Heading>PAYMENT<br /><span style={{ color: '#00E5FF' }}>PROCEDURES</span></Heading>

            <div style={{ padding: '14px 18px', background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.18)', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#8B8BAF', marginBottom: '4px' }}>Selected Events</div>
                    <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '14px', color: '#F0EEFF' }}>{selected.join(' + ') || '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#8B8BAF', marginBottom: '4px' }}>Total Fee</div>
                    <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: '28px', background: 'linear-gradient(135deg, #00E5FF, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Rs {totalFee.toLocaleString()}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '2px', background: 'rgba(0,229,255,0.04)', marginBottom: '40px' }}>
                {([
                    { key: 'online' as const, title: 'Online Payment', amount: onlineAmt, sub: '100% upfront', detail: `Full payment via bank transfer, EasyPaisa, or JazzCash. Amount: Rs ${onlineAmt.toLocaleString()}` },
                    { key: 'onsite' as const, title: 'Onsite Payment', amount: onsiteNow, sub: `75% now · Rs ${onsiteRem.toLocaleString()} at venue`, detail: `Pay Rs ${onsiteNow.toLocaleString()} online now. Remaining Rs ${onsiteRem.toLocaleString()} (25%) paid at the event venue.` },
                ]).map(({ key, title, amount, sub, detail }) => (
                    <div key={key} onClick={() => setPayMethod(key)}
                        style={{ background: payMethod === key ? 'rgba(0,229,255,0.06)' : '#13123A', border: payMethod === key ? '2px solid #00E5FF' : '2px solid transparent', padding: '28px', cursor: 'pointer', transition: 'all .22s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#00E5FF', marginBottom: '8px' }}>{title}</div>
                                <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: '32px', background: payMethod === key ? 'linear-gradient(135deg, #00E5FF, #A855F7)' : 'none', WebkitBackgroundClip: payMethod === key ? 'text' : 'unset', WebkitTextFillColor: payMethod === key ? 'transparent' : '#F0EEFF', color: payMethod === key ? 'transparent' : '#F0EEFF', lineHeight: 1 }}>Rs {amount.toLocaleString()}</div>
                                <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '11px', color: '#8B8BAF', marginTop: '4px' }}>{sub}</div>
                            </div>
                            <div style={{ width: '22px', height: '22px', border: `1px solid ${payMethod === key ? '#00E5FF' : 'rgba(0,229,255,0.3)'}`, background: payMethod === key ? 'linear-gradient(135deg, #00E5FF, #A855F7)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }}>
                                {payMethod === key && <div style={{ width: '8px', height: '8px', background: '#08071A' }} />}
                            </div>
                        </div>
                        <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '12px', color: '#8B8BAF', lineHeight: 1.75, fontWeight: 300, borderTop: '1px solid rgba(0,229,255,0.06)', paddingTop: '14px' }}>{detail}</div>
                    </div>
                ))}
            </div>

            {payMethod && (
                <div style={{ border: '1px solid rgba(0,229,255,0.12)', background: '#13123A', padding: '24px', marginBottom: '40px' }}>
                    <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '.25em', textTransform: 'uppercase', color: '#00E5FF', marginBottom: '20px' }}>Bank Account Details</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: '20px' }}>
                        {[
                            { l: 'Account Title', v: 'KGL Events Committee' },
                            { l: 'Bank',          v: 'Meezan Bank' },
                            { l: 'Account No.',   v: '0123 4567 8901' },
                            { l: 'Bank account number', v: 'PK36MEZN0001234567890' },
                            { l: 'EasyPaisa',     v: '0300-0000000' },
                            { l: 'JazzCash',      v: '0300-0000000' },
                        ].map(({ l, v }) => (
                            <div key={l}>
                                <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#8B8BAF', marginBottom: '4px' }}>{l}</div>
                                <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '13px', color: '#F0EEFF' }}>{v}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(0,229,255,0.04)', borderLeft: '3px solid #00E5FF', fontFamily: "'Chakra Petch', sans-serif", fontSize: '12px', color: '#8B8BAF', lineHeight: 1.75 }}>
                        Pay now: <strong style={{ color: '#00E5FF' }}>Rs {(payMethod === 'online' ? onlineAmt : onsiteNow).toLocaleString()}</strong> — then upload proof in the next step.
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <BackBtn to={2} />
                <NextBtn label="Upload Voucher" to={4} disabled={!payMethod} />
            </div>
        </Section>
    );

    // ── TAB 4 ──────────────────────────────────────────────────────────────
    const renderTab4 = () => (
        <Section>
            <StepLabel step="Step 3 of 4" />
            <Heading>PAYMENT<br /><span style={{ color: '#00E5FF' }}>VERIFICATION</span></Heading>
            <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '13px', color: '#8B8BAF', lineHeight: 1.8, fontWeight: 300, marginBottom: '40px', maxWidth: '500px' }}>
                Upload a clear screenshot or photo of your payment confirmation. Accepted: JPG, PNG, PDF.
            </p>

            {!preview ? (
                <div onClick={() => fileRef.current?.click()}
                    onDragOver={e => {
 e.preventDefault(); setDragging(true); 
}}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => {
 e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0];

 if (f) {
handleFile(f);
} 
}}
                    style={{ border: `1px dashed ${dragging ? '#00E5FF' : 'rgba(0,229,255,0.2)'}`, background: dragging ? 'rgba(0,229,255,0.04)' : '#13123A', padding: '64px 32px', textAlign: 'center', cursor: 'pointer', transition: 'all .25s', marginBottom: '40px' }}>
                    <Upload size={32} color="#00E5FF" style={{ margin: '0 auto 16px' }} />
                    <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '14px', color: '#F0EEFF', marginBottom: '8px' }}>Drag & drop your voucher here</p>
                    <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '11px', color: '#8B8BAF' }}>or click to browse · JPG, PNG, PDF · Max 10MB</p>
                    <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => {
 const f = e.target.files?.[0];

 if (f) {
handleFile(f);
} 
}} />
                </div>
            ) : (
                <div style={{ position: 'relative', marginBottom: '40px', border: '1px solid rgba(0,229,255,0.18)' }}>
                    <img src={preview} alt="Voucher" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block', background: '#13123A' }} />
                    <button onClick={() => {
 setVoucher(null); setPreview(null); 
}}
                        style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(8,7,26,.9)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={14} />
                    </button>
                    <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '11px', color: '#8B8BAF', padding: '10px 14px' }}>{voucher?.name}</p>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <BackBtn to={3} />
                <button onClick={() => voucher && goTo(5)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: voucher ? 'linear-gradient(135deg, #00E5FF, #A855F7)' : 'rgba(0,229,255,0.07)', color: voucher ? '#08071A' : 'rgba(0,229,255,0.3)', border: 'none', padding: '14px 32px', fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '.15em', textTransform: 'uppercase', cursor: voucher ? 'pointer' : 'not-allowed' }}>
                    Submit Registration <ArrowRight size={13} />
                </button>
            </div>
        </Section>
    );

    // ── TAB 5 ──────────────────────────────────────────────────────────────
    const renderTab5 = () => (
        <Section>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, rgba(0,229,255,0.12), rgba(168,85,247,0.12))', border: '1px solid rgba(0,229,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Check size={26} color="#00E5FF" strokeWidth={2.5} />
                </div>
                <h2 style={{ fontFamily: "'Russo One', sans-serif", fontSize: 'clamp(2rem,5vw,3rem)', textTransform: 'uppercase', color: '#F0EEFF', marginBottom: '10px' }}>
                    REGISTRATION <span style={{ color: '#00E5FF' }}>SUBMITTED</span>
                </h2>
                <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '13px', color: '#8B8BAF', lineHeight: 1.8, maxWidth: '420px', margin: '0 auto', fontWeight: 300 }}>
                    Your registration is under review. A confirmation email will be sent upon approval. Save your delegation code below.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '2px', background: 'rgba(0,229,255,0.04)', marginBottom: '40px' }}>
                <div style={{ background: '#13123A', padding: '32px', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '.3em', textTransform: 'uppercase', color: '#00E5FF', marginBottom: '16px' }}>Delegation Code</div>
                    <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: 'clamp(1.4rem,4vw,2.2rem)', background: 'linear-gradient(135deg, #00E5FF, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '.06em', marginBottom: '16px' }}>
                        {delCode}
                    </div>
                    <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '11px', color: '#8B8BAF', lineHeight: 1.7, fontWeight: 300 }}>
                        Present this code at the registration desk. One pass — non-transferable.
                    </div>
                </div>

                <div style={{ background: '#13123A', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '.3em', textTransform: 'uppercase', color: '#00E5FF' }}>QR Code</div>
                    <div style={{ padding: '10px', background: '#fff', display: 'inline-block', boxShadow: '0 0 20px rgba(0,229,255,0.15)' }}>
                        <QRCode value={delCode} />
                    </div>
                    <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '11px', color: '#8B8BAF' }}>Scan at entry gate</div>
                </div>
            </div>

            <div style={{ border: '1px solid rgba(0,229,255,0.1)', background: '#13123A', marginBottom: '40px' }}>
                <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(0,229,255,0.06)', fontFamily: "'Chakra Petch', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '.25em', textTransform: 'uppercase', color: '#00E5FF' }}>
                    Registration Summary
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))' }}>
                    {[
                        { l: 'Name',      v: form.fullName  || '—' },
                        { l: 'CNIC',      v: form.cnic      || '—' },
                        { l: 'ID',        v: form.studentId || '—' },
                        { l: 'Institute', v: form.institute || '—' },
                        { l: 'Email',     v: form.email     || '—' },
                        { l: 'Contact',   v: form.contact   || '—' },
                        { l: 'Events',    v: selected.join(', ') || '—' },
                        { l: 'Total Fee', v: `Rs ${totalFee.toLocaleString()}` },
                        { l: 'Payment',   v: payMethod === 'online' ? 'Online (100%)' : 'Onsite (75%+25%)' },
                        { l: 'Venue',     v: 'Venue TBA' },
                        { l: 'Status',    v: 'Pending Approval' },
                    ].map(({ l, v }) => (
                        <div key={l} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(0,229,255,0.04)', borderRight: '1px solid rgba(0,229,255,0.04)' }}>
                            <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#8B8BAF', marginBottom: '4px' }}>{l}</div>
                            <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '13px', color: l === 'Status' ? '#00E5FF' : '#F0EEFF', fontWeight: 300 }}>{v}</div>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={() => window.print()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px solid rgba(0,229,255,0.25)', color: '#8B8BAF', padding: '14px 24px', fontFamily: "'Chakra Petch', sans-serif", fontSize: '11px', letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => {
 e.currentTarget.style.borderColor = '#00E5FF'; e.currentTarget.style.color = '#00E5FF'; 
}}
                onMouseLeave={e => {
 e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)'; e.currentTarget.style.color = '#8B8BAF'; 
}}>
                <Printer size={13} /> Print / Save
            </button>
        </Section>
    );

    // ── RENDER ─────────────────────────────────────────────────────────────
    return (
        <>
            <Head title="KGL Delegation Portal — Karachi Gala League 2026" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Chakra+Petch:wght@300;400;500;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html { scroll-behavior: smooth; }
                body { background: #08071A; color: #F0EEFF; font-family: 'Chakra Petch', sans-serif; -webkit-font-smoothing: antialiased; }
                input, textarea, button { font-family: inherit; }
                input::placeholder, textarea::placeholder { color: #8B8BAF; font-size: 13px; font-weight: 300; }
                @media print { .no-print { display: none !important; } body { background: #fff; color: #000; } }
            `}</style>

            <div style={{ minHeight: '100vh', background: '#08071A' }}>
                <header className="no-print" style={{ background: '#0D0C25', borderBottom: '1px solid rgba(0,229,255,0.1)', padding: '14px clamp(20px,5vw,48px)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontFamily: 'Russo One, sans-serif', fontSize: '22px', background: 'linear-gradient(135deg, #00E5FF, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '.06em' }}>KGL</span>
                    <div style={{ width: '1px', height: '18px', background: 'rgba(0,229,255,0.2)' }} />
                    <span style={{ fontFamily: 'Chakra Petch, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#8B8BAF' }}>Delegation Portal</span>
                </header>

                <div className="no-print">
                    <TabBar active={tab} max={max} onSelect={setTab} />
                </div>

                {tab === 1 && renderTab1()}
                {tab === 2 && renderTab2()}
                {tab === 3 && renderTab3()}
                {tab === 4 && renderTab4()}
                {tab === 5 && renderTab5()}
            </div>
        </>
    );
}
