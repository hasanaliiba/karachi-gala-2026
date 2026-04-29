<?php

namespace App\Http\Controllers;

use App\Models\GalleryItem;
use App\Models\Module;
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
            'earlyBirdEnabled' => Setting::get('early_bird_enabled', '0') === '1',
            'galleryItems'  => GalleryItem::orderBy('sort_order')
                ->get()
                ->map(fn (GalleryItem $item) => [
                    'id'         => $item->id,
                    'label'      => $item->label,
                    'image_url'  => '/storage/' . $item->image_path,
                    'wide'       => $item->wide,
                    'sort_order' => $item->sort_order,
                ]),
            'modules'       => Module::orderBy('sort_order')
                ->get()
                ->map(fn (Module $m) => [
                    'id'           => $m->id,
                    'name'         => $m->name,
                    'image_url'    => $m->image_path ? '/storage/' . $m->image_path : null,
                    'intro'        => $m->intro,
                    'how_to_play'  => $m->how_to_play,
                    'rules'        => $m->rules,
                    'registration' => $m->registration,
                    'early_bird_price' => $m->early_bird_price,
                    'normal_price' => $m->normal_price,
                    'first_prize'  => $m->first_prize,
                    'second_prize' => $m->second_prize,
                    'min_cap'      => $m->min_cap,
                    'max_cap'      => $m->max_cap,
                ]),
        ]);
    }
}
