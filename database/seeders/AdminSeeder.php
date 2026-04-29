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

        Setting::firstOrCreate(
            ['key' => 'early_bird_enabled'],
            ['value' => '0']
        );
    }
}
