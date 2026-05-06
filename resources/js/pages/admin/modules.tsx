import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { publicMediaUrl } from '@/lib/utils';

type Module = {
    id: number;
    name: string;
    image_path: string | null;
    intro: string;
    how_to_play: string[];
    rules: string;
    registration: string[];
    early_bird_price: string;
    normal_price: string;
    first_prize: string;
    second_prize: string;
    min_delegations: number;
    max_delegations: number;
    min_participants: number;
    max_participants: number;
    sort_order: number;
};

type FormData = {
    name: string;
    image: File | null;
    intro: string;
    how_to_play: string[];
    rules: string;
    registration: string[];
    early_bird_price: string;
    normal_price: string;
    first_prize: string;
    second_prize: string;
    min_delegations: number | '';
    max_delegations: number | '';
    min_participants: number | '';
    max_participants: number | '';
};

const empty: FormData = {
    name: '',
    image: null,
    intro: '',
    how_to_play: [''],
    rules: '',
    registration: [''],
    early_bird_price: '',
    normal_price: '',
    first_prize: '',
    second_prize: '',
    min_delegations: '',
    max_delegations: '',
    min_participants: '',
    max_participants: '',
};

function BulletListEditor({
    label,
    items,
    onChange,
    error,
}: {
    label: string;
    items: string[];
    onChange: (items: string[]) => void;
    error?: string;
}) {
    function update(index: number, value: string) {
        const next = [...items];
        next[index] = value;
        onChange(next);
    }

    function add() {
        onChange([...items, '']);
    }

    function remove(index: number) {
        onChange(items.filter((_, i) => i !== index));
    }

    return (
        <div className="grid gap-1.5">
            <Label>{label}</Label>
            <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                    <div key={i} className="flex gap-2">
                        <span className="mt-2 text-sm" style={{ color: '#8B8BAF' }}>•</span>
                        <Input
                            value={item}
                            onChange={e => update(i, e.target.value)}
                            placeholder={`Point ${i + 1}`}
                            required
                        />
                        {items.length > 1 && (
                            <Button type="button" size="sm" variant="ghost" className="text-red-400 hover:text-red-600 shrink-0" onClick={() => remove(i)}>
                                ✕
                            </Button>
                        )}
                    </div>
                ))}
                <Button type="button" size="sm" variant="ghost" className="self-start" style={{ color: '#8B8BAF' }} onClick={add}>
                    + Add point
                </Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

function ModuleForm({
    defaults,
    action,
    submitLabel,
    onSuccess,
}: {
    defaults: FormData;
    action: string;
    submitLabel: string;
    onSuccess?: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>(defaults);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(action, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        });
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid gap-1.5">
                <Label htmlFor={`${action}-name`}>Module Name</Label>
                <Input
                    id={`${action}-name`}
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder="e.g. Chess"
                    required
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor={`${action}-image`}>Module Image (JPG, PNG, WEBP - max 4 MB)</Label>
                <Input
                    id={`${action}-image`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={e => setData('image', e.target.files?.[0] ?? null)}
                />
                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor={`${action}-intro`}>Intro</Label>
                <textarea
                    id={`${action}-intro`}
                    value={data.intro}
                    onChange={e => setData('intro', e.target.value)}
                    placeholder="Brief description of the game"
                    required
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
                {errors.intro && <p className="text-sm text-red-500">{errors.intro}</p>}
            </div>

            <BulletListEditor
                label="How to Play"
                items={data.how_to_play}
                onChange={v => setData('how_to_play', v)}
                error={errors['how_to_play'] as string | undefined}
            />

            <div className="grid gap-1.5">
                <Label htmlFor={`${action}-rules`}>Rules</Label>
                <textarea
                    id={`${action}-rules`}
                    value={data.rules}
                    onChange={e => setData('rules', e.target.value)}
                    placeholder="Rules and conduct guidelines"
                    required
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
                {errors.rules && <p className="text-sm text-red-500">{errors.rules}</p>}
            </div>

            <BulletListEditor
                label="Registration Requirements"
                items={data.registration}
                onChange={v => setData('registration', v)}
                error={errors['registration'] as string | undefined}
            />

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor={`${action}-early-bird`}>Early Bird Price</Label>
                    <Input
                        id={`${action}-early-bird`}
                        value={data.early_bird_price}
                        onChange={e => setData('early_bird_price', e.target.value)}
                        placeholder="e.g. PKR 3000"
                        required
                    />
                    {errors.early_bird_price && <p className="text-sm text-red-500">{errors.early_bird_price}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor={`${action}-normal`}>Normal Price</Label>
                    <Input
                        id={`${action}-normal`}
                        value={data.normal_price}
                        onChange={e => setData('normal_price', e.target.value)}
                        placeholder="e.g. PKR 4000"
                        required
                    />
                    {errors.normal_price && <p className="text-sm text-red-500">{errors.normal_price}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor={`${action}-first`}>1st Prize</Label>
                    <Input
                        id={`${action}-first`}
                        value={data.first_prize}
                        onChange={e => setData('first_prize', e.target.value)}
                        placeholder="e.g. PKR 15,000 + Trophy"
                        required
                    />
                    {errors.first_prize && <p className="text-sm text-red-500">{errors.first_prize}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor={`${action}-second`}>2nd Prize</Label>
                    <Input
                        id={`${action}-second`}
                        value={data.second_prize}
                        onChange={e => setData('second_prize', e.target.value)}
                        placeholder="e.g. PKR 8,000 + Medal"
                        required
                    />
                    {errors.second_prize && <p className="text-sm text-red-500">{errors.second_prize}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor={`${action}-min`}>Min Delegations</Label>
                    <Input
                        id={`${action}-min`}
                        type="number"
                        min={1}
                        value={data.min_delegations}
                        onChange={e => setData('min_delegations', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 8"
                        required
                    />
                    {errors.min_delegations && <p className="text-sm text-red-500">{errors.min_delegations}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor={`${action}-max`}>Max Delegations</Label>
                    <Input
                        id={`${action}-max`}
                        type="number"
                        min={1}
                        value={data.max_delegations}
                        onChange={e => setData('max_delegations', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 32"
                        required
                    />
                    {errors.max_delegations && <p className="text-sm text-red-500">{errors.max_delegations}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor={`${action}-min-p`}>Min Participants Required</Label>
                    <Input
                        id={`${action}-min-p`}
                        type="number"
                        min={1}
                        value={data.min_participants}
                        onChange={e => setData('min_participants', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 1"
                        required
                    />
                    {errors.min_participants && <p className="text-sm text-red-500">{errors.min_participants}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor={`${action}-max-p`}>Max Participants Allowed</Label>
                    <Input
                        id={`${action}-max-p`}
                        type="number"
                        min={1}
                        value={data.max_participants}
                        onChange={e => setData('max_participants', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 8"
                        required
                    />
                    {errors.max_participants && <p className="text-sm text-red-500">{errors.max_participants}</p>}
                </div>
            </div>

            <div>
                <Button type="submit" disabled={processing}>
                    {processing && <Spinner />}
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}

function EditPanel({ module, onClose }: { module: Module; onClose: () => void }) {
    return (
        <div className="p-6" style={{ borderTop: '1px solid rgba(0,229,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium" style={{ color: '#00E5FF', fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                    Edit — {module.name}
                </h3>
                <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
            </div>
            <ModuleForm
                defaults={{
                    name: module.name,
                    image: null,
                    intro: module.intro,
                    how_to_play: module.how_to_play,
                    rules: module.rules,
                    registration: module.registration,
                    early_bird_price: module.early_bird_price,
                    normal_price: module.normal_price,
                    first_prize: module.first_prize,
                    second_prize: module.second_prize,
                    min_delegations: module.min_delegations,
                    max_delegations: module.max_delegations,
                    min_participants: module.min_participants,
                    max_participants: module.max_participants,
                }}
                action={`/admin/modules/${module.id}`}
                submitLabel="Save Changes"
                onSuccess={onClose}
            />
        </div>
    );
}

export default function AdminModules({ modules }: { modules: Module[] }) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showAdd, setShowAdd] = useState(false);

    function deleteModule(id: number) {
        if (!confirm('Delete this module? This cannot be undone.')) {
return;
}

        router.delete(`/admin/modules/${id}`);
    }

    function move(index: number, direction: 'up' | 'down') {
        const next = [...modules];
        const target = direction === 'up' ? index - 1 : index + 1;
        [next[index], next[target]] = [next[target], next[index]];
        router.post('/admin/modules/reorder', { ids: next.map(m => m.id) });
    }

    return (
        <>
            <Head title="Modules Management" />

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Russo One, sans-serif', letterSpacing: '.04em', textTransform: 'uppercase' }}>Modules</h1>
                    <p className="mt-1 text-sm" style={{ color: '#8B8BAF' }}>Manage game/activity modules shown on the public site.</p>
                </div>
                <Button onClick={() => setShowAdd(v => !v)}>
                    {showAdd ? 'Cancel' : '+ Add Module'}
                </Button>
            </div>

            {props.flash?.success && (
                <div className="mb-6 px-4 py-3 text-sm" style={{
                    background: 'rgba(52,211,153,0.08)',
                    color: '#4ade80',
                    border: '1px solid rgba(52,211,153,0.2)',
                    borderLeft: '3px solid #4ade80',
                    borderRadius: '4px',
                }}>
                    {props.flash.success}
                </div>
            )}

            {showAdd && (
                <div className="mb-8 p-6" style={{
                    background: '#13123A',
                    borderTop: '2px solid rgba(0,229,255,0.2)',
                }}>
                    <h2 className="mb-4" style={{ fontFamily: 'Russo One, sans-serif', fontSize: '14px', letterSpacing: '.06em', textTransform: 'uppercase', color: '#00E5FF' }}>New Module</h2>
                    <ModuleForm
                        defaults={empty}
                        action="/admin/modules"
                        submitLabel="Create Module"
                        onSuccess={() => setShowAdd(false)}
                    />
                </div>
            )}

            <div style={{ background: '#13123A', border: '1px solid rgba(0,229,255,0.1)', borderRadius: '8px' }}>
                {modules.length === 0 && (
                    <p className="p-6 text-sm" style={{ color: '#8B8BAF' }}>No modules yet. Add one above.</p>
                )}
                {modules.map((module, index) => {
                    const coverUrl = publicMediaUrl(module.image_path);

                    return (
                    <div key={module.id} style={{ borderBottom: index < modules.length - 1 ? '1px solid rgba(0,229,255,0.08)' : 'none' }}>
                        <div className="flex items-start gap-4 p-4">
                            <div className="flex flex-col gap-1">
                                <Button size="sm" variant="ghost" onClick={() => move(index, 'up')} disabled={index === 0} title="Move up">↑</Button>
                                <Button size="sm" variant="ghost" onClick={() => move(index, 'down')} disabled={index === modules.length - 1} title="Move down">↓</Button>
                            </div>
                            <div className="flex-1">
                                {coverUrl && (
                                    <img
                                        src={coverUrl}
                                        alt={module.name}
                                        className="mb-2 h-20 w-32 rounded object-cover"
                                        style={{ background: 'rgba(0,229,255,0.05)' }}
                                    />
                                )}
                                <p className="font-medium">{module.name}</p>
                                <p className="mt-0.5 text-sm line-clamp-2" style={{ color: '#8B8BAF' }}>{module.intro}</p>
                                <div className="mt-2 flex flex-wrap gap-3 text-xs" style={{ color: '#8B8BAF' }}>
                                    <span>💸 {module.early_bird_price} (Early) / {module.normal_price} (Normal)</span>
                                    <span>🏆 {module.first_prize}</span>
                                    <span>🥈 {module.second_prize}</span>
                                    <span>🧾 {module.min_delegations}–{module.max_delegations} delegations</span>
                                    <span>👥 {module.min_participants}–{module.max_participants} participants</span>
                                </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingId(editingId === module.id ? null : module.id)}
                                >
                                    {editingId === module.id ? 'Close' : 'Edit'}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => deleteModule(module.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                        {editingId === module.id && (
                            <EditPanel module={module} onClose={() => setEditingId(null)} />
                        )}
                    </div>
                    );
                })}
            </div>
        </>
    );
}
