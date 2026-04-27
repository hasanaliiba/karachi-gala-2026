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
                    'id'         => $item->id,
                    'label'      => $item->label,
                    'image_url'  => Storage::disk('public')->url($item->image_path),
                    'wide'       => $item->wide,
                    'sort_order' => $item->sort_order,
                ]),
        ]);
    }
}
