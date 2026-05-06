import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/** Files under `public/assets/` vs uploads in `storage/app/public/` (same rule as HomeController). */
export function publicMediaUrl(path: string | null | undefined): string | null {
    if (!path) {
        return null;
    }

    if (path.startsWith('assets/')) {
        return '/' + path;
    }

    return '/storage/' + path;
}
