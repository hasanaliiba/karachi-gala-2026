# Gallery Management Design
**Date:** 2026-04-27
**Project:** Karachi Gala League 2026

## Overview

Replace the hardcoded gallery array in `welcome.tsx` with a database-driven gallery managed through the admin portal. Admins can add, edit, delete, and reorder gallery items with real image uploads stored on Laravel's public disk.

---

## Architecture

### Storage
- Images stored via Laravel's public disk at `storage/app/public/gallery/`.
- Served via `public/storage/gallery/` symlink created with `php artisan storage:link`.
- `HomeController` passes image URLs using `Storage::url($item->image_path)`.
- File validation: mimes jpg/jpeg/png/webp, max 4MB.

### Database
- `gallery_items` table — stores label, image path, wide flag, and sort order.
- `GalleryItem` model with fillable fields.

### Ordering
- `sort_order` integer column determines display order (ascending).
- Admin uses ↑↓ buttons; a `reorder` endpoint accepts an ordered array of IDs and bulk-updates `sort_order`.

---

## Database

### `gallery_items` table
| Column | Type | Notes |
|---|---|---|
| id | bigIncrements | PK |
| label | string | Caption shown on hover |
| image_path | string | Relative path within public storage |
| wide | boolean | default false — spans 2 grid columns |
| sort_order | integer | default 0 — ascending display order |
| created_at / updated_at | timestamps | |

---

## Backend

### Model
- `App\Models\GalleryItem` — fillable: `label`, `image_path`, `wide`, `sort_order`.

### Controller
- `App\Http\Controllers\Admin\GalleryController`
  - `index()` — render `admin/gallery` with all items ordered by `sort_order`
  - `store(Request)` — validate + upload image, create record
  - `update(Request, GalleryItem)` — validate, optionally replace image, update record
  - `destroy(GalleryItem)` — delete image file + record
  - `reorder(Request)` — accept `['ids' => [3,1,2,...]]`, bulk-update `sort_order`

### HomeController update
- Pass `galleryItems` as Inertia prop: collection of `{id, label, image_url, wide, sort_order}` ordered by `sort_order`.

### Routes (added to `routes/admin.php`)
```
GET    /admin/gallery              → GalleryController@index       (auth:admin)
POST   /admin/gallery              → GalleryController@store       (auth:admin)
PATCH  /admin/gallery/{item}       → GalleryController@update      (auth:admin)
DELETE /admin/gallery/{item}       → GalleryController@destroy     (auth:admin)
POST   /admin/gallery/reorder      → GalleryController@reorder     (auth:admin)
```
Note: `/admin/gallery/reorder` must be defined **before** `/admin/gallery/{item}` to avoid route conflict.

### Seeder
- `GallerySeeder` — seeds the existing 9 hardcoded gallery items with placeholder image paths pointing to a default placeholder image. Called from `DatabaseSeeder`.
- A default placeholder image `public/images/gallery-placeholder.jpg` is copied to `storage/app/public/gallery/placeholder.jpg` during setup.

---

## Frontend

### Admin layout update
- `AdminLayout` gets a simple nav with two links: **Settings** (`/admin/settings`) and **Gallery** (`/admin/gallery`).

### Pages
- `resources/js/pages/admin/gallery.tsx`
  - Lists existing gallery items in a table: thumbnail, label, wide badge, ↑↓ reorder buttons, Edit button, Delete button.
  - "Add Image" form at the top: file input, label text field, wide checkbox, submit button.
  - Inline edit: clicking Edit opens the row's fields for editing (label, wide, optional new image).
  - Reorder: ↑↓ buttons POST to `/admin/gallery/reorder` with the updated order.
  - Flash success/error messages.

### Welcome page update
- Remove hardcoded `const GALLERY = [...]` array.
- Accept `galleryItems: GalleryItem[]` from `usePage().props`.
- Each item renders an `<img>` tag with `src={item.image_url}` instead of the CSS gradient background.
- Preserve existing grid layout, `wide` spanning, hover effects, and label overlay.

### Types
```ts
type GalleryItem = {
  id: number;
  label: string;
  image_url: string;
  wide: boolean;
  sort_order: number;
};
```

---

## Migration
- `2026_04_27_000001_create_gallery_items_table.php`

---

## Success Criteria
1. `GET /admin/gallery` lists all gallery items with thumbnails.
2. Uploading a new image with label and wide flag adds it to the gallery.
3. Editing updates label, wide flag, and optionally replaces the image.
4. Deleting removes the item and its image file from disk.
5. ↑↓ buttons reorder items; the public welcome page reflects the new order on next load.
6. The public welcome page shows real images from the database, not hardcoded gradients.
7. Unauthenticated access to `/admin/gallery` redirects to `/admin/login`.
