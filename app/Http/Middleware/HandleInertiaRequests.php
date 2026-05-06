<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use App\Support\SocialPricing;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    private function publicMediaUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return str_starts_with($path, 'assets/')
            ? '/'.$path
            : '/storage/'.$path;
    }

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'socialConfig' => [
                'pricing' => [
                    SocialPricing::QAWALI_NIGHT => [
                        'delegate_pkr' => SocialPricing::delegatePkr(SocialPricing::QAWALI_NIGHT),
                        'outsider_pkr' => SocialPricing::outsiderPkr(SocialPricing::QAWALI_NIGHT),
                    ],
                    SocialPricing::BEACH_PARTY => [
                        'delegate_pkr' => SocialPricing::delegatePkr(SocialPricing::BEACH_PARTY),
                        'outsider_pkr' => SocialPricing::outsiderPkr(SocialPricing::BEACH_PARTY),
                    ],
                ],
                'images' => [
                    SocialPricing::QAWALI_NIGHT => $this->publicMediaUrl(Setting::get('social_qawali_image_path')),
                    SocialPricing::BEACH_PARTY => $this->publicMediaUrl(Setting::get('social_beach_image_path')),
                ],
            ],
        ];
    }
}
