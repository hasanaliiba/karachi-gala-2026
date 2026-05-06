<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\SocialPricing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SocialsController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/socials', [
            'socialQawaliDelegatePkr' => SocialPricing::delegatePkr(SocialPricing::QAWALI_NIGHT),
            'socialQawaliOutsiderPkr' => SocialPricing::outsiderPkr(SocialPricing::QAWALI_NIGHT),
            'socialBeachDelegatePkr' => SocialPricing::delegatePkr(SocialPricing::BEACH_PARTY),
            'socialBeachOutsiderPkr' => SocialPricing::outsiderPkr(SocialPricing::BEACH_PARTY),
            'socialQawaliImagePath' => Setting::get('social_qawali_image_path', ''),
            'socialBeachImagePath' => Setting::get('social_beach_image_path', ''),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'social_qawali_delegate_pkr' => ['required', 'integer', 'min:0', 'max:9999999'],
            'social_qawali_outsider_pkr' => ['required', 'integer', 'min:0', 'max:9999999'],
            'social_beach_delegate_pkr' => ['required', 'integer', 'min:0', 'max:9999999'],
            'social_beach_outsider_pkr' => ['required', 'integer', 'min:0', 'max:9999999'],

            'social_qawali_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'social_beach_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'remove_social_qawali_image' => ['nullable', 'boolean'],
            'remove_social_beach_image' => ['nullable', 'boolean'],
        ]);

        Setting::updateOrCreate(['key' => 'social_qawali_delegate_pkr'], ['value' => (string) $validated['social_qawali_delegate_pkr']]);
        Setting::updateOrCreate(['key' => 'social_qawali_outsider_pkr'], ['value' => (string) $validated['social_qawali_outsider_pkr']]);
        Setting::updateOrCreate(['key' => 'social_beach_delegate_pkr'], ['value' => (string) $validated['social_beach_delegate_pkr']]);
        Setting::updateOrCreate(['key' => 'social_beach_outsider_pkr'], ['value' => (string) $validated['social_beach_outsider_pkr']]);

        $this->handleImageUpdate(
            $request,
            fileKey: 'social_qawali_image',
            removeKey: 'remove_social_qawali_image',
            settingKey: 'social_qawali_image_path',
            folder: 'socials'
        );

        $this->handleImageUpdate(
            $request,
            fileKey: 'social_beach_image',
            removeKey: 'remove_social_beach_image',
            settingKey: 'social_beach_image_path',
            folder: 'socials'
        );

        return back()->with('success', 'Socials saved.');
    }

    private function handleImageUpdate(Request $request, string $fileKey, string $removeKey, string $settingKey, string $folder): void
    {
        $current = Setting::get($settingKey, '') ?? '';

        $remove = $request->boolean($removeKey);
        if ($remove && $current !== '' && ! str_starts_with($current, 'assets/')) {
            Storage::disk('public')->delete($current);
            $current = '';
        }

        if ($request->hasFile($fileKey)) {
            if ($current !== '' && ! str_starts_with($current, 'assets/')) {
                Storage::disk('public')->delete($current);
            }

            $current = $request->file($fileKey)->store($folder, 'public');
        }

        Setting::updateOrCreate(['key' => $settingKey], ['value' => (string) $current]);
    }
}

