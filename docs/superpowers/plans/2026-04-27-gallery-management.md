# Gallery Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded gallery array on the public welcome page with a database-driven gallery managed through the admin portal, supporting image upload, edit, delete, and reorder.

**Architecture:** `gallery_items` table stores label, image path, wide flag, and sort order. Images are uploaded to Laravel's public disk (`storage/app/public/gallery/`) and served via storage symlink. `HomeController` passes gallery items as an Inertia prop. Admin portal gets a `GalleryController` and a new `admin/gallery.tsx` page. `AdminLayout` gains a nav bar with Settings and Gallery links.

**Tech Stack:** Laravel 11, Inertia.js, React, TypeScript, Tailwind CSS, Laravel public disk storage

---

## File Map

**Create:**
- `database/migrations/2026_04_27_000001_create_gallery_items_table.php`
- `database/seeders/GallerySeeder.php`
- `app/Models/GalleryItem.php`
- `app/Http/Controllers/Admin/GalleryController.php`
- `resources/js/pages/admin/gallery.tsx`

**Modify:**
- `routes/admin.php` — add gallery routes (reorder before `{item}`)
- `app/Http/Controllers/HomeController.php` — add galleryItems prop
- `resources/js/layouts/admin-layout.tsx` — add Settings/Gallery nav
- `resources/js/pages/welcome.tsx` — replace hardcoded GALLERY with prop
- `database/seeders/DatabaseSeeder.php` — call GallerySeeder

---

## Task 1: Migration + storage symlink

**Files:**
- Create: `database/migrations/2026_04_27_000001_create_gallery_items_table.php`

- [ ] **Step 1: Create migration**

```bash
cd /Users/hasansali/Career/karachi-gala-2026 && php artisan make:migration create_gallery_items_table --create=gallery_items
```

Edit the generated file. Replace the `up()` body with:

```php
Schema::create('gallery_items', function (Blueprint $table) {
    $table->id();
    $table->string('label');
    $table->string('image_path');
    $table->boolean('wide')->default(false);
    $table->integer('sort_order')->default(0);
    $table->timestamps();
});
```

`down()` keeps `Schema::dropIfExists('gallery_items');`.

- [ ] **Step 2: Run migration**

```bash
php artisan migrate
```

Expected: `gallery_items` table listed as "Ran".

- [ ] **Step 3: Create storage symlink**

```bash
php artisan storage:link
```

Expected: `INFO The [public/storage] link has been connected to [storage/app/public].` (or "already exists" is also fine).

- [ ] **Step 4: Commit**

```bash
git add database/migrations/
git commit -m "feat: add gallery_items migration"
```

---

## Task 2: GalleryItem model

**Files:**
- Create: `app/Models/GalleryItem.php`

- [ ] **Step 1: Create model**

Create `app/Models/GalleryItem.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['label', 'image_path', 'wide', 'sort_order'])]
class GalleryItem extends Model
{
}
```

- [ ] **Step 2: Verify class loads**

```bash
php artisan tinker --execute="echo App\Models\GalleryItem::class;"
```

Expected: `App\Models\GalleryItem`

- [ ] **Step 3: Commit**

```bash
git add app/Models/GalleryItem.php
git commit -m "feat: add GalleryItem model"
```

---

## Task 3: GallerySeeder

**Files:**
- Create: `database/seeders/GallerySeeder.php`
- Modify: `database/seeders/DatabaseSeeder.php`

- [ ] **Step 1: Create GallerySeeder**

Create `database/seeders/GallerySeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\GalleryItem;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        $dir = storage_path('app/public/gallery');
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $placeholder = $dir . '/placeholder.png';
        if (! file_exists($placeholder)) {
            // 1×1 dark pixel PNG
            file_put_contents($placeholder, base64_decode(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIA' .
                'BQAAbjjWAwAAAABJRU5ErkJggg=='
            ));
        }

        $items = [
            ['label' => 'Opening Ceremony', 'wide' => true],
            ['label' => 'Chess Finals',     'wide' => false],
            ['label' => 'FIFA Showdown',    'wide' => false],
            ['label' => 'Cricket Match',    'wide' => false],
            ['label' => 'Badminton Court',  'wide' => false],
            ['label' => 'Tug of War',       'wide' => false],
            ['label' => 'Award Ceremony',   'wide' => true],
            ['label' => 'Table Tennis',     'wide' => false],
            ['label' => 'Carrom Battle',    'wide' => false],
            ['label' => 'Closing Night',    'wide' => false],
            ['label' => 'Team Photos',      'wide' => false],
        ];

        foreach ($items as $order => $item) {
            GalleryItem::firstOrCreate(
                ['label' => $item['label']],
                [
                    'image_path' => 'gallery/placeholder.png',
                    'wide'       => $item['wide'],
                    'sort_order' => $order,
                ]
            );
        }
    }
}
```

- [ ] **Step 2: Call GallerySeeder from DatabaseSeeder**

In `database/seeders/DatabaseSeeder.php`, add `$this->call(GallerySeeder::class);` after the AdminSeeder call:

```php
public function run(): void
{
    User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $this->call(AdminSeeder::class);
    $this->call(GallerySeeder::class);
}
```

- [ ] **Step 3: Run seeder**

```bash
php artisan db:seed --class=GallerySeeder
```

Expected: `INFO Seeding: Database\Seeders\GallerySeeder`

- [ ] **Step 4: Verify**

```bash
php artisan tinker --execute="echo App\Models\GalleryItem::count() . ' items, placeholder exists: ' . (file_exists(storage_path('app/public/gallery/placeholder.png')) ? 'yes' : 'no');"
```

Expected: `11 items, placeholder exists: yes`

- [ ] **Step 5: Commit**

```bash
git add database/seeders/GallerySeeder.php database/seeders/DatabaseSeeder.php
git commit -m "feat: add GallerySeeder with placeholder images"
```

---

## Task 4: GalleryController

**Files:**
- Create: `app/Http/Controllers/Admin/GalleryController.php`

- [ ] **Step 1: Create GalleryController**

Create `app/Http/Controllers/Admin/GalleryController.php`:

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/gallery', [
            'items' => GalleryItem::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'wide'  => ['nullable', 'boolean'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $path = $request->file('image')->store('gallery', 'public');

        GalleryItem::create([
            'label'      => $request->label,
            'wide'       => $request->boolean('wide'),
            'image_path' => $path,
            'sort_order' => GalleryItem::max('sort_order') + 1,
        ]);

        return back()->with('success', 'Image added.');
    }

    public function update(Request $request, GalleryItem $item): RedirectResponse
    {
        $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'wide'  => ['nullable', 'boolean'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $imagePath = $item->image_path;

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($item->image_path);
            $imagePath = $request->file('image')->store('gallery', 'public');
        }

        $item->update([
            'label'      => $request->label,
            'wide'       => $request->boolean('wide'),
            'image_path' => $imagePath,
        ]);

        return back()->with('success', 'Image updated.');
    }

    public function destroy(GalleryItem $item): RedirectResponse
    {
        Storage::disk('public')->delete($item->image_path);
        $item->delete();

        return back()->with('success', 'Image deleted.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['integer', 'exists:gallery_items,id'],
        ]);

        foreach ($request->ids as $order => $id) {
            GalleryItem::where('id', $id)->update(['sort_order' => $order]);
        }

        return back()->with('success', 'Order updated.');
    }
}
```

- [ ] **Step 2: Verify class loads**

```bash
php artisan tinker --execute="echo class_exists(App\Http\Controllers\Admin\GalleryController::class) ? 'OK' : 'MISSING';"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add app/Http/Controllers/Admin/GalleryController.php
git commit -m "feat: add Admin GalleryController with CRUD and reorder"
```

---

## Task 5: Admin routes

**Files:**
- Modify: `routes/admin.php`

- [ ] **Step 1: Update routes/admin.php**

Replace the entire file content with:

```php
<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\SettingsController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AuthController::class, 'showLogin'])->name('login');
        Route::post('login', [AuthController::class, 'login'])->name('login.store');
    });

    Route::middleware('auth:admin')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');

        Route::get('settings', [SettingsController::class, 'edit'])->name('settings.edit');
        Route::patch('settings', [SettingsController::class, 'update'])->name('settings.update');

        // Gallery — reorder must be before {item} to avoid route conflict
        Route::get('gallery', [GalleryController::class, 'index'])->name('gallery.index');
        Route::post('gallery', [GalleryController::class, 'store'])->name('gallery.store');
        Route::post('gallery/reorder', [GalleryController::class, 'reorder'])->name('gallery.reorder');
        Route::post('gallery/{item}', [GalleryController::class, 'update'])->name('gallery.update');
        Route::delete('gallery/{item}', [GalleryController::class, 'destroy'])->name('gallery.destroy');
    });
});
```

Note: gallery update uses `POST` (not PATCH) because browsers cannot send multipart/form-data with PATCH. The controller receives standard POST.

- [ ] **Step 2: Verify routes are registered**

```bash
php artisan route:list --path=admin/gallery
```

Expected: 5 gallery routes — index (GET), store (POST), reorder (POST), update (POST `{item}`), destroy (DELETE `{item}`).

- [ ] **Step 3: Commit**

```bash
git add routes/admin.php
git commit -m "feat: add gallery routes to admin"
```

---

## Task 6: Update HomeController

**Files:**
- Modify: `app/Http/Controllers/HomeController.php`

- [ ] **Step 1: Update HomeController to pass galleryItems**

Replace the entire file:

```php
<?php

namespace App\Http\Controllers;

use App\Models\GalleryItem;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('welcome', [
            'canRegister'   => Features::enabled(Features::registration()),
            'earlyBirdDate' => Setting::get('early_bird_date', '2026-05-28'),
            'galleryItems'  => GalleryItem::orderBy('sort_order')
                ->get()
                ->map(fn (GalleryItem $item) => [
                    'id'        => $item->id,
                    'label'     => $item->label,
                    'image_url' => Storage::disk('public')->url($item->image_path),
                    'wide'      => $item->wide,
                    'sort_order' => $item->sort_order,
                ]),
        ]);
    }
}
```

- [ ] **Step 2: Verify route still works**

```bash
php artisan route:list --name=home
```

Expected: `GET /` → `HomeController@index`

- [ ] **Step 3: Commit**

```bash
git add app/Http/Controllers/HomeController.php
git commit -m "feat: pass galleryItems from HomeController to welcome page"
```

---

## Task 7: Update AdminLayout with navigation

**Files:**
- Modify: `resources/js/layouts/admin-layout.tsx`

- [ ] **Step 1: Update admin-layout.tsx**

Replace the entire file:

```tsx
import { Link, router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

const navLinks = [
    { href: '/admin/settings', label: 'Settings' },
    { href: '/admin/gallery',  label: 'Gallery' },
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
```

- [ ] **Step 2: Commit**

```bash
git add resources/js/layouts/admin-layout.tsx
git commit -m "feat: add Settings and Gallery nav to AdminLayout"
```

---

## Task 8: Admin gallery page (frontend)

**Files:**
- Create: `resources/js/pages/admin/gallery.tsx`

- [ ] **Step 1: Create admin/gallery.tsx**

Create `resources/js/pages/admin/gallery.tsx`:

```tsx
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
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
        <form onSubmit={submit} className="mb-8 rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-medium">Add Image</h2>
            <div className="flex flex-col gap-4">
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

            <h1 className="mb-1 text-2xl font-semibold">Gallery</h1>
            <p className="mb-8 text-sm text-gray-500">
                Manage images shown in the gallery section of the public home page.
            </p>

            {props.flash?.success && (
                <div className="mb-6 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
                    {props.flash.success}
                </div>
            )}

            <AddForm />

            <div className="rounded-lg border bg-white">
                {items.length === 0 && (
                    <p className="p-6 text-sm text-gray-400">No gallery images yet. Add one above.</p>
                )}
                {items.map((item, index) => (
                    <div key={item.id} className="flex items-start gap-4 border-b p-4 last:border-0">
                        <img
                            src={`/storage/${item.image_path}`}
                            alt={item.label}
                            className="h-16 w-24 shrink-0 rounded object-cover bg-gray-100"
                        />
                        {editingId === item.id ? (
                            <EditForm item={item} onCancel={() => setEditingId(null)} />
                        ) : (
                            <div className="flex flex-1 items-center justify-between">
                                <div>
                                    <p className="font-medium">{item.label}</p>
                                    {item.wide && (
                                        <span className="mt-1 inline-block rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
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
```

- [ ] **Step 2: Commit**

```bash
git add resources/js/pages/admin/gallery.tsx
git commit -m "feat: add admin gallery management page"
```

---

## Task 9: Update welcome.tsx

**Files:**
- Modify: `resources/js/pages/welcome.tsx`

- [ ] **Step 1: Add GalleryItem type and update usePage call**

The file currently has:
```tsx
const { earlyBirdDate } = usePage<{ earlyBirdDate: string }>().props;
```

Replace with:
```tsx
type GalleryItem = { id: number; label: string; image_url: string; wide: boolean; sort_order: number };

const { earlyBirdDate, galleryItems } = usePage<{
    earlyBirdDate: string;
    galleryItems: GalleryItem[];
}>().props;
```

- [ ] **Step 2: Remove hardcoded GALLERY constant**

Delete these lines (around line 20–32, the `const GALLERY = [...]` block):
```tsx
const GALLERY = [
    { label: 'Opening Ceremony',  wide: true,  grad: 'linear-gradient(135deg,#08071A,#1A0A3A)' },
    { label: 'Chess Finals',      wide: false, grad: 'linear-gradient(135deg,#0A0820,#1C1050)' },
    { label: 'FIFA Showdown',     wide: false, grad: 'linear-gradient(135deg,#060A1A,#0E1840)' },
    { label: 'Cricket Match',     wide: false, grad: 'linear-gradient(135deg,#070E1A,#0A1E38)' },
    { label: 'Badminton Court',   wide: false, grad: 'linear-gradient(135deg,#0D0820,#1A0A3A)' },
    { label: 'Tug of War',        wide: false, grad: 'linear-gradient(135deg,#0A0818,#18083A)' },
    { label: 'Award Ceremony',    wide: true,  grad: 'linear-gradient(135deg,#08071A,#200E50)' },
    { label: 'Table Tennis',      wide: false, grad: 'linear-gradient(135deg,#060C1E,#0C1840)' },
    { label: 'Carrom Battle',     wide: false, grad: 'linear-gradient(135deg,#0A0720,#160A3A)' },
    { label: 'Closing Night',     wide: false, grad: 'linear-gradient(135deg,#050510,#120E30)' },
    { label: 'Team Photos',       wide: false, grad: 'linear-gradient(135deg,#08081A,#14103A)' },
```
(find and delete the full GALLERY array and its closing `];`)

- [ ] **Step 3: Replace gallery render block**

Find the gallery map (around line 566):
```tsx
{GALLERY.map(({ label, wide, grad }, i) => (
    <div key={i} className="gal-item"
        style={{ aspectRatio: wide ? '16/7' : '4/3', gridColumn: wide ? 'span 2' : undefined, background: grad }}
        onMouseEnter={() => setHoveredGal(i)}
        onMouseLeave={() => setHoveredGal(null)}
    >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,229,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.02) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="gal-overlay" />
        <div className="gal-label">{label}</div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hoveredGal === i ? .3 : .08, transition: 'opacity .3s' }}>
            <Activity size={36} color="#00E5FF" />
        </div>
    </div>
))}
```

Replace with:
```tsx
{galleryItems.map((item, i) => (
    <div key={item.id} className="gal-item"
        style={{ aspectRatio: item.wide ? '16/7' : '4/3', gridColumn: item.wide ? 'span 2' : undefined }}
        onMouseEnter={() => setHoveredGal(i)}
        onMouseLeave={() => setHoveredGal(null)}
    >
        <img
            src={item.image_url}
            alt={item.label}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="gal-overlay" />
        <div className="gal-label">{item.label}</div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hoveredGal === i ? .3 : .08, transition: 'opacity .3s' }}>
            <Activity size={36} color="#00E5FF" />
        </div>
    </div>
))}
```

- [ ] **Step 4: Build to verify no TypeScript errors**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ built in X.XXs` with no errors.

- [ ] **Step 5: Commit**

```bash
git add resources/js/pages/welcome.tsx
git commit -m "feat: welcome page gallery driven by backend galleryItems prop"
```

---

## Task 10: Final smoke test

- [ ] **Step 1: Verify all gallery routes exist**

```bash
php artisan route:list --path=admin/gallery
```

Expected: 5 routes — GET index, POST store, POST reorder, POST {item} update, DELETE {item} destroy.

- [ ] **Step 2: Verify HomeController returns galleryItems**

```bash
php artisan tinker --execute="
\$ctrl = new App\Http\Controllers\HomeController();
\$response = \$ctrl->index();
\$props = \$response->toResponse(request())->getData(true)['props'];
echo 'galleryItems count: ' . count(\$props['galleryItems']);
"
```

Expected: `galleryItems count: 11`

- [ ] **Step 3: Final production build**

```bash
npm run build 2>&1 | tail -3
```

Expected: `✓ built in X.XXs`

- [ ] **Step 4: Manual check — admin gallery page**

With `php artisan serve` running, visit `http://localhost:8000/admin/gallery` (log in as `iqra@kgl.com` / `kgl123` if needed). Verify:
- 11 seeded items are listed
- ↑↓ buttons are disabled at the top/bottom boundaries
- "Add Image" form is present

- [ ] **Step 5: Manual check — public gallery section**

Visit `http://localhost:8000`. Scroll to the Gallery section. Verify the 11 items render (placeholder thumbnails visible — small dark squares).
