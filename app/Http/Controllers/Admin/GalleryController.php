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
            if ($item->image_path && ! str_starts_with($item->image_path, 'assets/')) {
                Storage::disk('public')->delete($item->image_path);
            }
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
        if ($item->image_path && ! str_starts_with($item->image_path, 'assets/')) {
            Storage::disk('public')->delete($item->image_path);
        }
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
