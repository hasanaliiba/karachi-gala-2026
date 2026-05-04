<?php

namespace App\Support;

use App\Models\Setting;

final class SocialPricing
{
    public const QAWALI_NIGHT = 'qawali_night';

    public const BEACH_PARTY = 'beach_party';

    /** Registered delegate add-on (delegation checkout). */
    public static function delegatePkr(string $social): int
    {
        return match ($social) {
            self::QAWALI_NIGHT => max(0, (int) Setting::get('social_qawali_delegate_pkr', '0')),
            self::BEACH_PARTY => max(0, (int) Setting::get('social_beach_delegate_pkr', '3500')),
            default => 0,
        };
    }

    /** Non-delegate / outsider ticket (home page & future outsider sales). */
    public static function outsiderPkr(string $social): int
    {
        return match ($social) {
            self::QAWALI_NIGHT => max(0, (int) Setting::get('social_qawali_outsider_pkr', '1500')),
            self::BEACH_PARTY => max(0, (int) Setting::get('social_beach_outsider_pkr', '4000')),
            default => 0,
        };
    }

    /**
     * @param  array<int, string>  $selections
     */
    public static function delegateSelectionTotalPkr(array $selections): int
    {
        $sum = 0;
        foreach (array_unique($selections) as $key) {
            $sum += self::delegatePkr((string) $key);
        }

        return $sum;
    }

    /**
     * @param  array<int, string>  $selections
     */
    public static function outsiderSelectionTotalPkr(array $selections): int
    {
        $sum = 0;
        foreach (array_unique($selections) as $key) {
            $sum += self::outsiderPkr((string) $key);
        }

        return $sum;
    }
}
