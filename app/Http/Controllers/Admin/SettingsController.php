<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\SocialPricing;
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
            'earlyBirdEnabled' => Setting::get('early_bird_enabled', '0') === '1',
            'registrationDiscountPercent' => max(
                0,
                min(100, (int) Setting::get('registration_discount_percent', '25'))
            ),
            'socialQawaliDelegatePkr' => SocialPricing::delegatePkr(SocialPricing::QAWALI_NIGHT),
            'socialQawaliOutsiderPkr' => SocialPricing::outsiderPkr(SocialPricing::QAWALI_NIGHT),
            'socialBeachDelegatePkr' => SocialPricing::delegatePkr(SocialPricing::BEACH_PARTY),
            'socialBeachOutsiderPkr' => SocialPricing::outsiderPkr(SocialPricing::BEACH_PARTY),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'early_bird_date' => ['required', 'date_format:Y-m-d'],
            'early_bird_enabled' => ['required', 'boolean'],
            'registration_discount_percent' => ['required', 'integer', 'min:0', 'max:100'],
            'social_qawali_delegate_pkr' => ['required', 'integer', 'min:0', 'max:9999999'],
            'social_qawali_outsider_pkr' => ['required', 'integer', 'min:0', 'max:9999999'],
            'social_beach_delegate_pkr' => ['required', 'integer', 'min:0', 'max:9999999'],
            'social_beach_outsider_pkr' => ['required', 'integer', 'min:0', 'max:9999999'],
        ]);

        Setting::updateOrCreate(
            ['key' => 'early_bird_date'],
            ['value' => $request->early_bird_date]
        );
        Setting::updateOrCreate(
            ['key' => 'early_bird_enabled'],
            ['value' => $request->boolean('early_bird_enabled') ? '1' : '0']
        );
        Setting::updateOrCreate(
            ['key' => 'registration_discount_percent'],
            ['value' => (string) $request->integer('registration_discount_percent')]
        );

        Setting::updateOrCreate(
            ['key' => 'social_qawali_delegate_pkr'],
            ['value' => (string) $request->integer('social_qawali_delegate_pkr')]
        );
        Setting::updateOrCreate(
            ['key' => 'social_qawali_outsider_pkr'],
            ['value' => (string) $request->integer('social_qawali_outsider_pkr')]
        );
        Setting::updateOrCreate(
            ['key' => 'social_beach_delegate_pkr'],
            ['value' => (string) $request->integer('social_beach_delegate_pkr')]
        );
        Setting::updateOrCreate(
            ['key' => 'social_beach_outsider_pkr'],
            ['value' => (string) $request->integer('social_beach_outsider_pkr')]
        );

        return back()->with('success', 'Settings saved.');
    }
}
