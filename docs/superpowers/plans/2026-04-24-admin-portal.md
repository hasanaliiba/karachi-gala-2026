# Admin Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separate admin portal at `/admin/login` with its own auth guard, a seeded admin user (Iqra/kgl123), and a settings page to change the early bird countdown date on the public welcome page.

**Architecture:** Separate `admins` table + `admin` session guard — completely isolated from the `users`/`web` guard. Settings are stored in a `settings` key/value table read by both `HomeController` (public) and `Admin\SettingsController` (admin). The welcome page receives `earlyBirdDate` as an Inertia prop instead of a hardcoded value.

**Tech Stack:** Laravel 11, Inertia.js, React, TypeScript, Tailwind CSS

---

## File Map

**Create:**
- `database/migrations/XXXX_create_admins_table.php`
- `database/migrations/XXXX_create_settings_table.php`
- `database/seeders/AdminSeeder.php`
- `app/Models/Admin.php`
- `app/Models/Setting.php`
- `app/Http/Controllers/HomeController.php`
- `app/Http/Controllers/Admin/AuthController.php`
- `app/Http/Controllers/Admin/SettingsController.php`
- `routes/admin.php`
- `resources/js/layouts/admin-layout.tsx`
- `resources/js/pages/admin/login.tsx`
- `resources/js/pages/admin/settings.tsx`

**Modify:**
- `config/auth.php` — add `admin` guard + `admins` provider
- `database/seeders/DatabaseSeeder.php` — call `AdminSeeder`
- `routes/web.php` — replace `Route::inertia('/')` with `HomeController`, require admin.php
- `resources/js/app.tsx` — add admin layout routing
- `resources/js/pages/welcome.tsx` — accept `earlyBirdDate` prop, remove hardcoded date

---

## Task 1: Database migrations

**Files:**
- Create: `database/migrations/2026_04_24_000001_create_admins_table.php`
- Create: `database/migrations/2026_04_24_000002_create_settings_table.php`

- [ ] **Step 1: Create admins migration**

```bash
php artisan make:migration create_admins_table --create=admins
```

Replace the generated `up()` body with:

```php
Schema::create('admins', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->rememberToken();
    $table->timestamps();
});
```

`down()` keeps `Schema::dropIfExists('admins');`.

- [ ] **Step 2: Create settings migration**

```bash
php artisan make:migration create_settings_table --create=settings
```

Replace the generated `up()` body with:

```php
Schema::create('settings', function (Blueprint $table) {
    $table->id();
    $table->string('key')->unique();
    $table->text('value')->nullable();
    $table->timestamps();
});
```

`down()` keeps `Schema::dropIfExists('settings');`.

- [ ] **Step 3: Run migrations**

```bash
php artisan migrate
```

Expected output: two new migration lines marked as "Ran" — `create_admins_table` and `create_settings_table`.

- [ ] **Step 4: Commit**

```bash
git add database/migrations/
git commit -m "feat: add admins and settings migrations"
```

---

## Task 2: Models

**Files:**
- Create: `app/Models/Admin.php`
- Create: `app/Models/Setting.php`

- [ ] **Step 1: Create Admin model**

Create `app/Models/Admin.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password'])]
class Admin extends Authenticatable
{
    use Notifiable;

    protected $hidden = ['password', 'remember_token'];

    protected $guard = 'admin';

    protected function casts(): array
    {
        return ['password' => 'hashed'];
    }
}
```

- [ ] **Step 2: Create Setting model**

Create `app/Models/Setting.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['key', 'value'])]
class Setting extends Model
{
    public static function get(string $key, ?string $default = null): ?string
    {
        return static::where('key', $key)->value('value') ?? $default;
    }
}
```

- [ ] **Step 3: Verify classes load**

```bash
php artisan tinker --execute="echo App\Models\Admin::class . PHP_EOL . App\Models\Setting::class;"
```

Expected output:
```
App\Models\Admin
App\Models\Setting
```

- [ ] **Step 4: Commit**

```bash
git add app/Models/Admin.php app/Models/Setting.php
git commit -m "feat: add Admin and Setting models"
```

---

## Task 3: Auth guard configuration

**Files:**
- Modify: `config/auth.php`

- [ ] **Step 1: Add admin guard and provider**

In `config/auth.php`, update the `guards` array:

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'admin' => [
        'driver' => 'session',
        'provider' => 'admins',
    ],
],
```

Update the `providers` array:

```php
'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => env('AUTH_MODEL', User::class),
    ],
    'admins' => [
        'driver' => 'eloquent',
        'model' => App\Models\Admin::class,
    ],
],
```

Add the `use App\Models\Admin;` import is NOT needed here — the class is referenced as a string via `App\Models\Admin::class`, but since this is a PHP config file we need to ensure the full namespace is used. Use the full class path as a string:

```php
'admins' => [
    'driver' => 'eloquent',
    'model' => \App\Models\Admin::class,
],
```

- [ ] **Step 2: Verify guard is recognized**

```bash
php artisan tinker --execute="echo config('auth.guards.admin.driver');"
```

Expected output: `session`

- [ ] **Step 3: Commit**

```bash
git add config/auth.php
git commit -m "feat: add admin auth guard and provider"
```

---

## Task 4: Seeder

**Files:**
- Create: `database/seeders/AdminSeeder.php`
- Modify: `database/seeders/DatabaseSeeder.php`

- [ ] **Step 1: Create AdminSeeder**

Create `database/seeders/AdminSeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::firstOrCreate(
            ['email' => 'iqra@kgl.com'],
            [
                'name'     => 'Iqra',
                'password' => Hash::make('kgl123'),
            ]
        );

        Setting::firstOrCreate(
            ['key' => 'early_bird_date'],
            ['value' => '2026-05-28']
        );
    }
}
```

- [ ] **Step 2: Call AdminSeeder from DatabaseSeeder**

In `database/seeders/DatabaseSeeder.php`, update `run()`:

```php
public function run(): void
{
    User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $this->call(AdminSeeder::class);
}
```

- [ ] **Step 3: Run seeder**

```bash
php artisan db:seed --class=AdminSeeder
```

Expected output: `INFO Seeding: Database\Seeders\AdminSeeder`

- [ ] **Step 4: Verify seeded data**

```bash
php artisan tinker --execute="echo App\Models\Admin::where('email','iqra@kgl.com')->value('name') . ' | ' . App\Models\Setting::get('early_bird_date');"
```

Expected output: `Iqra | 2026-05-28`

- [ ] **Step 5: Commit**

```bash
git add database/seeders/AdminSeeder.php database/seeders/DatabaseSeeder.php
git commit -m "feat: add AdminSeeder with Iqra admin and early_bird_date setting"
```

---

## Task 5: HomeController

**Files:**
- Create: `app/Http/Controllers/HomeController.php`
- Modify: `routes/web.php`

- [ ] **Step 1: Create HomeController**

Create `app/Http/Controllers/HomeController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Setting;
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
        ]);
    }
}
```

- [ ] **Step 2: Update routes/web.php**

Replace:
```php
Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');
```

With:
```php
Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
```

Also add at the very end of `routes/web.php`:
```php
require __DIR__.'/admin.php';
```

The final `routes/web.php` should look like:

```php
<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
```

- [ ] **Step 3: Verify home route works**

```bash
php artisan route:list --name=home
```

Expected output: shows `GET /` mapped to `HomeController@index`.

- [ ] **Step 4: Commit**

```bash
git add app/Http/Controllers/HomeController.php routes/web.php
git commit -m "feat: add HomeController passing earlyBirdDate to welcome page"
```

---

## Task 6: Admin routes

**Files:**
- Create: `routes/admin.php`

- [ ] **Step 1: Create routes/admin.php**

```php
<?php

use App\Http\Controllers\Admin\AuthController;
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
    });
});
```

- [ ] **Step 2: Verify admin routes are registered**

```bash
php artisan route:list --path=admin
```

Expected output: 5 routes — `admin/login` (GET, POST), `admin/logout` (POST), `admin/settings` (GET, PATCH).

- [ ] **Step 3: Commit**

```bash
git add routes/admin.php
git commit -m "feat: add admin routes"
```

---

## Task 7: Admin\AuthController

**Files:**
- Create: `app/Http/Controllers/Admin/AuthController.php`

- [ ] **Step 1: Create AuthController**

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response|RedirectResponse
    {
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.settings.edit');
        }

        return Inertia::render('admin/login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->route('admin.settings.edit');
        }

        return back()->withErrors(['email' => 'These credentials do not match our records.']);
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
```

- [ ] **Step 2: Verify controller resolves**

```bash
php artisan tinker --execute="echo class_exists(App\Http\Controllers\Admin\AuthController::class) ? 'OK' : 'MISSING';"
```

Expected output: `OK`

- [ ] **Step 3: Commit**

```bash
git add app/Http/Controllers/Admin/AuthController.php
git commit -m "feat: add Admin AuthController with login/logout"
```

---

## Task 8: Admin\SettingsController

**Files:**
- Create: `app/Http/Controllers/Admin/SettingsController.php`

- [ ] **Step 1: Create SettingsController**

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/settings', [
            'earlyBirdDate' => Setting::get('early_bird_date', '2026-05-28'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'early_bird_date' => ['required', 'date_format:Y-m-d'],
        ]);

        Setting::updateOrCreate(
            ['key' => 'early_bird_date'],
            ['value' => $request->early_bird_date]
        );

        return back()->with('success', 'Settings saved.');
    }
}
```

- [ ] **Step 2: Verify controller resolves**

```bash
php artisan tinker --execute="echo class_exists(App\Http\Controllers\Admin\SettingsController::class) ? 'OK' : 'MISSING';"
```

Expected output: `OK`

- [ ] **Step 3: Commit**

```bash
git add app/Http/Controllers/Admin/SettingsController.php
git commit -m "feat: add Admin SettingsController for early bird date"
```

---

## Task 9: Admin layout (frontend)

**Files:**
- Create: `resources/js/layouts/admin-layout.tsx`

- [ ] **Step 1: Create admin-layout.tsx**

```tsx
import { router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export default function AdminLayout({ children }: PropsWithChildren) {
    const { url } = usePage();

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
```

- [ ] **Step 2: Update app.tsx to use AdminLayout**

In `resources/js/app.tsx`, add the import at the top:

```tsx
import AdminLayout from '@/layouts/admin-layout';
```

Update the `layout` switch:

```tsx
layout: (name) => {
    switch (true) {
        case name === 'welcome':
        case name === 'admin/login':
            return null;
        case name.startsWith('auth/'):
            return AuthLayout;
        case name.startsWith('settings/'):
            return [AppLayout, SettingsLayout];
        case name.startsWith('admin/'):
            return AdminLayout;
        default:
            return AppLayout;
    }
},
```

- [ ] **Step 3: Commit**

```bash
git add resources/js/layouts/admin-layout.tsx resources/js/app.tsx
git commit -m "feat: add AdminLayout and register admin route layout in app.tsx"
```

---

## Task 10: Admin login page (frontend)

**Files:**
- Create: `resources/js/pages/admin/login.tsx`

- [ ] **Step 1: Create admin/login.tsx**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add resources/js/pages/admin/login.tsx
git commit -m "feat: add admin login page"
```

---

## Task 11: Admin settings page (frontend)

**Files:**
- Create: `resources/js/pages/admin/settings.tsx`

- [ ] **Step 1: Create admin/settings.tsx**

```tsx
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    earlyBirdDate: string;
};

export default function AdminSettings({ earlyBirdDate }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();

    const { data, setData, patch, processing, errors } = useForm({
        early_bird_date: earlyBirdDate,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch('/admin/settings');
    }

    return (
        <>
            <Head title="Admin Settings" />

            <div className="max-w-lg">
                <h1 className="mb-1 text-2xl font-semibold">Settings</h1>
                <p className="mb-8 text-sm text-gray-500">
                    Update site-wide configuration for Karachi Gala League 2026.
                </p>

                {props.flash?.success && (
                    <div className="mb-6 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
                        {props.flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="grid gap-1.5">
                        <Label htmlFor="early_bird_date">Early Bird Deadline</Label>
                        <p className="text-xs text-gray-400">
                            The countdown on the public home page counts down to this date (midnight PKT, UTC+5).
                        </p>
                        <Input
                            id="early_bird_date"
                            type="date"
                            value={data.early_bird_date}
                            onChange={e => setData('early_bird_date', e.target.value)}
                            required
                        />
                        {errors.early_bird_date && (
                            <p className="text-sm text-red-500">{errors.early_bird_date}</p>
                        )}
                    </div>

                    <div>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            Save settings
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add resources/js/pages/admin/settings.tsx
git commit -m "feat: add admin settings page for early bird date"
```

---

## Task 12: Update welcome page to use earlyBirdDate prop

**Files:**
- Modify: `resources/js/pages/welcome.tsx`

- [ ] **Step 1: Add usePage import**

At the top of `resources/js/pages/welcome.tsx`, the first import line is:
```tsx
import { Head, Link } from '@inertiajs/react';
```

Replace with:
```tsx
import { Head, Link, usePage } from '@inertiajs/react';
```

- [ ] **Step 2: Read earlyBirdDate from page props**

The function signature on line 34 is currently:
```tsx
export default function Welcome() {
```

Replace with:
```tsx
export default function Welcome() {
    const { earlyBirdDate } = usePage<{ earlyBirdDate: string }>().props;
```

Then on line 43, replace the hardcoded line:
```tsx
    // Early bird deadline: 2 weeks before June 11 2026 = May 28 2026 00:00 PKT (UTC+5)
    const EARLY_BIRD = new Date('2026-05-28T00:00:00+05:00').getTime();
```

With:
```tsx
    const EARLY_BIRD = new Date(earlyBirdDate + 'T00:00:00+05:00').getTime();
```

- [ ] **Step 3: Update the display text (line ~505)**

Find this line in the early bird section:
```tsx
                        Register before <span style={{ color: '#00E5FF' }}>May 28, 2026</span> to unlock early bird pricing
```

Replace with:
```tsx
                        Register before{' '}
                        <span style={{ color: '#00E5FF' }}>
                            {new Date(earlyBirdDate + 'T00:00:00+05:00').toLocaleDateString('en-US', {
                                month: 'long', day: 'numeric', year: 'numeric',
                            })}
                        </span>{' '}
                        to unlock early bird pricing
```

- [ ] **Step 4: Build to verify no TypeScript errors**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ built in X.XXs` with no errors.

- [ ] **Step 5: Commit**

```bash
git add resources/js/pages/welcome.tsx
git commit -m "feat: welcome page reads earlyBirdDate from backend prop"
```

---

## Task 13: Smoke test

- [ ] **Step 1: Start dev server**

```bash
php artisan serve &
npm run dev &
```

- [ ] **Step 2: Verify admin login page loads**

Open `http://localhost:8000/admin/login` — should show "KGL Admin" heading with email/password form.

- [ ] **Step 3: Log in as Iqra**

Enter `iqra@kgl.com` / `kgl123` and submit — should redirect to `/admin/settings`.

- [ ] **Step 4: Change the early bird date**

Set the date to `2026-06-01` and click "Save settings" — should show green success toast.

- [ ] **Step 5: Verify public page reflects change**

Open `http://localhost:8000` — countdown and date text should reflect `June 1, 2026`.

- [ ] **Step 6: Verify unauthenticated redirect**

Log out, then navigate to `http://localhost:8000/admin/settings` — should redirect to `/admin/login`.

- [ ] **Step 7: Final build**

```bash
npm run build 2>&1 | tail -3
```

Expected: `✓ built in X.XXs`
