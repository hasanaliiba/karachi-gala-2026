import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Module = {
    id: number;
    name: string;
    intro: string;
    how_to_play: string[];
    rules: string;
    registration: string[];
    first_prize: string;
    second_prize: string;
    min_cap: number;
    max_cap: number;
    sort_order: number;
};

type FormData = {
    name: string;
    intro: string;
    how_to_play: string[];
    rules: string;
    registration: string[];
    first_prize: string;
    second_prize: string;
    min_cap: number | '';
    max_cap: number | '';
};

const empty: FormData = {
    name: '',
    intro: '',
    how_to_play: [''],
    rules: '',
    registration: [''],
    first_prize: '',
    second_prize: '',
    min_cap: '',
    max_cap: '',
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
                        <span className="mt-2 text-gray-400 text-sm">•</span>
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
                <Button type="button" size="sm" variant="ghost" className="self-start text-gray-500" onClick={add}>
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
                    <Label htmlFor={`${action}-min`}>Min Participants</Label>
                    <Input
                        id={`${action}-min`}
                        type="number"
                        min={1}
                        value={data.min_cap}
                        onChange={e => setData('min_cap', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 8"
                        required
                    />
                    {errors.min_cap && <p className="text-sm text-red-500">{errors.min_cap}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor={`${action}-max`}>Max Participants</Label>
                    <Input
                        id={`${action}-max`}
                        type="number"
                        min={1}
                        value={data.max_cap}
                        onChange={e => setData('max_cap', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 32"
                        required
                    />
                    {errors.max_cap && <p className="text-sm text-red-500">{errors.max_cap}</p>}
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
        <div className="border-t bg-gray-50 p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium">Edit — {module.name}</h3>
                <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
            </div>
            <ModuleForm
                defaults={{
                    name: module.name,
                    intro: module.intro,
                    how_to_play: module.how_to_play,
                    rules: module.rules,
                    registration: module.registration,
                    first_prize: module.first_prize,
                    second_prize: module.second_prize,
                    min_cap: module.min_cap,
                    max_cap: module.max_cap,
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
        if (!confirm('Delete this module? This cannot be undone.')) return;
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
                    <h1 className="text-2xl font-semibold">Modules</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage game/activity modules shown on the public site.</p>
                </div>
                <Button onClick={() => setShowAdd(v => !v)}>
                    {showAdd ? 'Cancel' : '+ Add Module'}
                </Button>
            </div>

            {props.flash?.success && (
                <div className="mb-6 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
                    {props.flash.success}
                </div>
            )}

            {showAdd && (
                <div className="mb-8 rounded-lg border bg-white p-6">
                    <h2 className="mb-4 text-lg font-medium">New Module</h2>
                    <ModuleForm
                        defaults={empty}
                        action="/admin/modules"
                        submitLabel="Create Module"
                        onSuccess={() => setShowAdd(false)}
                    />
                </div>
            )}

            <div className="rounded-lg border bg-white">
                {modules.length === 0 && (
                    <p className="p-6 text-sm text-gray-400">No modules yet. Add one above.</p>
                )}
                {modules.map((module, index) => (
                    <div key={module.id} className="border-b last:border-0">
                        <div className="flex items-start gap-4 p-4">
                            <div className="flex flex-col gap-1">
                                <Button size="sm" variant="ghost" onClick={() => move(index, 'up')} disabled={index === 0} title="Move up">↑</Button>
                                <Button size="sm" variant="ghost" onClick={() => move(index, 'down')} disabled={index === modules.length - 1} title="Move down">↓</Button>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{module.name}</p>
                                <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">{module.intro}</p>
                                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                                    <span>🏆 {module.first_prize}</span>
                                    <span>🥈 {module.second_prize}</span>
                                    <span>👥 {module.min_cap}–{module.max_cap} participants</span>
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
                ))}
            </div>
        </>
    );
}
