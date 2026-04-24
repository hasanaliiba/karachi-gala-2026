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
