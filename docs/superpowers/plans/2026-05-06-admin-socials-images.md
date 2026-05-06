# Admin Socials Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin page to upload social event images (and optionally manage pricing) and display those images on the public `welcome.tsx` socials section, with config available app-wide.

**Architecture:** Persist paths in the existing `settings` table, store uploaded files on Laravel’s `public` disk, and expose URLs through `HomeController` plus a shared Inertia prop in `HandleInertiaRequests`.

**Tech Stack:** Laravel, Inertia.js (React), Vite, TypeScript.

---

### Task 1: Add admin routes and controller for socials

**Files:**
- Create: `app/Http/Controllers/Admin/SocialsController.php`
- Modify: `routes/admin.php`

- [ ] **Step 1: Add routes**

Add:
- `GET /admin/socials` → `Admin\SocialsController@edit`
- `PATCH /admin/socials` → `Admin\SocialsController@update`

- [ ] **Step 2: Implement controller edit()**

Return `Inertia::render('admin/socials', [...])` with initial values:
- Social pricing keys (existing): `social_qawali_delegate_pkr`, `social_qawali_outsider_pkr`, `social_beach_delegate_pkr`, `social_beach_outsider_pkr`
- Image path keys (new): `social_qawali_image_path`, `social_beach_image_path`

- [ ] **Step 3: Implement controller update()**

Validate:
- Pricing: integers in range
- Images: `nullable|image|max:5120` (or similar)
- Remove flags: booleans

Store new images under `public` disk (e.g. `socials/`) and persist relative paths in `settings`.
If removing, delete old file and clear the setting.

---

### Task 2: Add admin navbar link + new Inertia page with Pricing/Images nav

**Files:**
- Modify: `resources/js/layouts/admin-layout.tsx`
- Create: `resources/js/pages/admin/socials.tsx`

- [ ] **Step 1: Add nav link**

Add `{ href: '/admin/socials', label: 'Socials' }` to the admin navbar.

- [ ] **Step 2: Implement UI**

Page includes a small internal nav (tabs/links):
- Pricing: 4 numeric inputs (same meaning as current settings page)
- Images: 2 file inputs with preview + remove checkbox/button

Submit via Inertia `useForm` as `FormData` (multipart) to `PATCH /admin/socials`.

---

### Task 3: Wire image URLs into welcome socials + share config app-wide

**Files:**
- Modify: `app/Http/Controllers/HomeController.php`
- Modify: `app/Http/Middleware/HandleInertiaRequests.php`

- [ ] **Step 1: HomeController**

Read `Setting::get('social_qawali_image_path')` / `Setting::get('social_beach_image_path')` and set `socialEvents[*].image_url` to:
- `null` if empty
- `'/storage/'.$path` if stored path is relative (non-`assets/`)

- [ ] **Step 2: Shared prop**

Add a shared Inertia prop like `socialConfig` containing:
- pricing numbers (delegate/outsider)
- image URLs (or null)

So any page (delegations, etc.) can consume the same config.

---

### Task 4: Verify

**Files:**
- (none)

- [ ] **Step 1: Typecheck + lint**

Run:
- `npm run types:check`
- `npm run lint:check`

- [ ] **Step 2: Smoke test**

Manually:
- Visit `/admin/socials`
- Upload images, save
- Confirm public home page `/` shows uploaded socials images

