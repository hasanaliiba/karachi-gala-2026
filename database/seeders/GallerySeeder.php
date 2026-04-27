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
