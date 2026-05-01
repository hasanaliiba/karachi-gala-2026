import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { publicMediaUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type GalleryItem = {
    id: number;
    label: string;
    image_path: string;
    wide: boolean;
    sort_order: number;
};

function AddForm() {
    const { data, setData, post, processing, errors, reset } = useForm<{
        label: string;
        wide: boolean;
        image: File | null;
    }>({ label: '', wide: false, image: null });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/gallery', {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <form onSubmit={submit} className="mb-8 flex flex-col gap-4" style={{
            background: '#13123A',
            borderTop: '2px solid rgba(0,229,255,0.2)',
            padding: '24px',
        }}>
            <h2 className="text-lg font-medium" style={{ fontFamily: 'Russo One, sans-serif', letterSpacing: '.04em', textTransform: 'uppercase', fontSize: '14px', color: '#00E5FF' }}>Add Image</h2>
            <div className="grid gap-1.5">
                <Label htmlFor="add-label">Label</Label>
                <Input
                    id="add-label"
                    value={data.label}
                    onChange={e => setData('label', e.target.value)}
                    placeholder="e.g. Opening Ceremony"
                    required
                />
                {errors.label && <p className="text-sm text-red-500">{errors.label}</p>}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="add-image">Image (JPG, PNG, WEBP — max 4 MB)</Label>
                <Input
                    id="add-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={e => setData('image', e.target.files?.[0] ?? null)}
                    required
                />
                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
            </div>
            <div className="flex items-center gap-2">
                <Checkbox
                    id="add-wide"
                    checked={data.wide}
                    onCheckedChange={v => setData('wide', Boolean(v))}
                />
                <Label htmlFor="add-wide">Wide (spans 2 columns in gallery)</Label>
            </div>
            <div>
                <Button type="submit" disabled={processing}>
                    {processing && <Spinner />}
                    Add Image
                </Button>
            </div>
        </form>
    );
}

function EditForm({ item, onCancel }: { item: GalleryItem; onCancel: () => void }) {
    const { data, setData, post, processing, errors } = useForm<{
        label: string;
        wide: boolean;
        image: File | null;
    }>({ label: item.label, wide: item.wide, image: null });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/admin/gallery/${item.id}`, {
            forceFormData: true,
            onSuccess: () => onCancel(),
        });
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-2 p-2 flex-1">
            <Input
                value={data.label}
                onChange={e => setData('label', e.target.value)}
                placeholder="Label"
                required
            />
            {errors.label && <p className="text-xs text-red-500">{errors.label}</p>}
            <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={e => setData('image', e.target.files?.[0] ?? null)}
            />
            {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
            <div className="flex items-center gap-2">
                <Checkbox
                    id={`wide-${item.id}`}
                    checked={data.wide}
                    onCheckedChange={v => setData('wide', Boolean(v))}
                />
                <Label htmlFor={`wide-${item.id}`} className="text-sm">Wide</Label>
            </div>
            <div className="flex gap-2 mt-1">
                <Button type="submit" size="sm" disabled={processing}>
                    {processing && <Spinner />}
                    Save
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}

export default function AdminGallery({ items }: { items: GalleryItem[] }) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const [editingId, setEditingId] = useState<number | null>(null);

    function deleteItem(id: number) {
        if (!confirm('Delete this gallery image? This cannot be undone.')) return;
        router.delete(`/admin/gallery/${id}`);
    }

    function move(index: number, direction: 'up' | 'down') {
        const next = [...items];
        const target = direction === 'up' ? index - 1 : index + 1;
        [next[index], next[target]] = [next[target], next[index]];
        router.post('/admin/gallery/reorder', { ids: next.map(i => i.id) });
    }

    return (
        <>
            <Head title="Gallery Management" />

            <h1 className="mb-1 text-2xl font-semibold" style={{ fontFamily: 'Russo One, sans-serif', letterSpacing: '.04em', textTransform: 'uppercase' }}>Gallery</h1>
            <p className="mb-8 text-sm" style={{ color: '#8B8BAF' }}>
                Manage images shown in the gallery section of the public home page.
            </p>

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

            <AddForm />

            <div style={{ background: '#13123A', border: '1px solid rgba(0,229,255,0.1)', borderRadius: '8px' }}>
                {items.length === 0 && (
                    <p className="p-6 text-sm" style={{ color: '#8B8BAF' }}>No gallery images yet. Add one above.</p>
                )}
                {items.map((item, index) => (
                    <div key={item.id} className="flex items-start gap-4 p-4" style={{ borderBottom: index < items.length - 1 ? '1px solid rgba(0,229,255,0.08)' : 'none' }}>
                        <img
                            src={publicMediaUrl(item.image_path) ?? ''}
                            alt={item.label}
                            className="h-16 w-24 shrink-0 rounded object-cover"
                            style={{ background: 'rgba(0,229,255,0.05)' }}
                        />
                        {editingId === item.id ? (
                            <EditForm item={item} onCancel={() => setEditingId(null)} />
                        ) : (
                            <div className="flex flex-1 items-center justify-between">
                                <div>
                                    <p className="font-medium">{item.label}</p>
                                    {item.wide && (
                                        <span className="mt-1 inline-block px-2 py-0.5 text-xs" style={{
                                            background: 'rgba(0,229,255,0.1)',
                                            color: '#00E5FF',
                                            border: '1px solid rgba(0,229,255,0.2)',
                                            borderRadius: '4px',
                                        }}>
                                            Wide
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button size="sm" variant="ghost" onClick={() => move(index, 'up')} disabled={index === 0} title="Move up">↑</Button>
                                    <Button size="sm" variant="ghost" onClick={() => move(index, 'down')} disabled={index === items.length - 1} title="Move down">↓</Button>
                                    <Button size="sm" variant="ghost" onClick={() => setEditingId(item.id)}>Edit</Button>
                                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => deleteItem(item.id)}>Delete</Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
