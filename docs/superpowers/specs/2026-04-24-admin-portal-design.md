# Admin Portal Design
**Date:** 2026-04-24
**Project:** Karachi Gala League 2026

## Overview

A separate admin portal accessible at `/admin/login` that uses its own `admins` table and `admin` auth guard. Authenticated admins can update site-wide settings, starting with the early bird discount deadline shown on the public welcome page.

---

## Architecture

### Authentication
- **Separate `admins` table** — completely isolated from the `users` table.
- **`admin` guard** registered in `config/auth.php` using an `admins` Eloquent provider.
- **Custom `Admin\AuthController`** handles login and logout — no Fortify involvement.
- Admin session is stored under the `admin` guard; it does not touch the `web` guard.

### Settings Storage
- **`settings` table** — simple key/value store (`key` unique string, `value` text).
- Initial seeded key: `early_bird_date` with value `2026-05-28`.
- A `Setting` model with a static helper `Setting::get('key')` for easy retrieval.

### Early Bird Date on Welcome Page
- The `web.php` route for `/` is replaced with a controller method (`HomeController@index`) that reads `early_bird_date` from the `settings` table and passes it as an Inertia prop.
- The `welcome.tsx` page replaces the hardcoded `'2026-05-28T00:00:00+05:00'` with the prop value.

---

## Database

### `admins` table
| Column | Type | Notes |
|---|---|---|
| id | bigIncrements | PK |
| name | string | |
| email | string | unique |
| password | string | hashed |
| remember_token | string | nullable |
| created_at / updated_at | timestamps | |

### `settings` table
| Column | Type | Notes |
|---|---|---|
| id | bigIncrements | PK |
| key | string | unique |
| value | text | nullable |
| created_at / updated_at | timestamps | |

---

## Backend

### Models
- `App\Models\Admin` — extends `Authenticatable`, guard `admin`, fillable: `name`, `email`, `password`.
- `App\Models\Setting` — fillable: `key`, `value`. Static helper: `Setting::get(string $key): ?string`.

### Auth Config (`config/auth.php`)
Add guard:
```php
'admin' => ['driver' => 'session', 'provider' => 'admins'],
```
Add provider:
```php
'admins' => ['driver' => 'eloquent', 'model' => App\Models\Admin::class],
```

### Controllers
- `App\Http\Controllers\Admin\AuthController` — `showLogin()`, `login()`, `logout()`
- `App\Http\Controllers\Admin\SettingsController` — `edit()`, `update()`
- `App\Http\Controllers\HomeController` — `index()` (replaces the inline `Route::inertia`)

### Middleware
All `/admin/*` routes (except login) wrapped in `auth:admin` middleware.
Redirect unauthenticated admin requests to `/admin/login`.

### Routes (`routes/admin.php`)
```
GET  /admin/login           → Admin\AuthController@showLogin    (guest:admin)
POST /admin/login           → Admin\AuthController@login        (guest:admin)
POST /admin/logout          → Admin\AuthController@logout       (auth:admin)
GET  /admin/settings        → Admin\SettingsController@edit     (auth:admin)
PATCH /admin/settings       → Admin\SettingsController@update   (auth:admin)
```
`routes/admin.php` is required from `bootstrap/app.php` alongside `web.php`.

### Seeder
`Database\Seeders\AdminSeeder`:
- Creates admin: `name = Iqra`, `email = iqra@kgl.com`, `password = kgl123`
- Creates setting: `early_bird_date = 2026-05-28`

`DatabaseSeeder` calls `AdminSeeder`.

---

## Frontend

### Pages
- `resources/js/pages/admin/login.tsx` — simple centered login form (email + password). No AppLayout — standalone page.
- `resources/js/pages/admin/settings.tsx` — date picker input for early bird date with a save button.

### Layout
- `resources/js/layouts/admin-layout.tsx` — minimal shell: top bar with "KGL Admin" title and a logout button. No sidebar.

### `app.tsx` routing
Add `name.startsWith('admin/')` → `AdminLayout` in the layout switch (except `admin/login` which returns `null`).

### Welcome page update
Replace hardcoded:
```ts
const EARLY_BIRD = new Date('2026-05-28T00:00:00+05:00').getTime();
```
With prop:
```ts
const { earlyBirdDate } = usePage().props;
const EARLY_BIRD = new Date(earlyBirdDate).getTime();
```
The date string is passed as `earlyBirdDate` from `HomeController`.

---

## Seeder Credentials
| Field | Value |
|---|---|
| Name | Iqra |
| Email | iqra@kgl.com |
| Password | kgl123 |

---

## Success Criteria
1. `GET /admin/login` shows a login form.
2. Logging in with Iqra / kgl123 redirects to `/admin/settings`.
3. Changing the date and saving updates the `settings` table.
4. The welcome page countdown reflects the updated date immediately on next page load.
5. Visiting `/admin/settings` without being logged in redirects to `/admin/login`.
6. Admin session does not interfere with regular user auth (`web` guard).
