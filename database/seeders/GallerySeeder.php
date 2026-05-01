<?php

namespace Database\Seeders;

use App\Models\GalleryItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        foreach (GalleryItem::cursor() as $item) {
            if ($item->image_path && ! str_starts_with($item->image_path, 'assets/')) {
                Storage::disk('public')->delete($item->image_path);
            }
        }

        GalleryItem::query()->delete();

        $items = [
            ['label' => 'Karachi Gala — Moments 1', 'image_path' => 'assets/past_events/1.jpeg', 'wide' => true],
            ['label' => 'Karachi Gala — Moments 2', 'image_path' => 'assets/past_events/2.jpeg', 'wide' => false],
            ['label' => 'Karachi Gala — Moments 3', 'image_path' => 'assets/past_events/3.jpeg', 'wide' => false],
            ['label' => 'Karachi Gala — Moments 4', 'image_path' => 'assets/past_events/4.jpeg', 'wide' => false],
            ['label' => 'Karachi Gala — Moments 5', 'image_path' => 'assets/past_events/5.jpeg', 'wide' => true],
        ];

        foreach ($items as $order => $row) {
            GalleryItem::create([
                'label'      => $row['label'],
                'image_path' => $row['image_path'],
                'wide'       => $row['wide'],
                'sort_order' => $order,
            ]);
        }
    }
}
