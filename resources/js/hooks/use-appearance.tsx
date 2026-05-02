/**
 * App theme is fixed to dark (no user-facing appearance settings).
 */
export type ResolvedAppearance = 'dark';
export type Appearance = 'dark';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    /** No-op — kept for compatibility with older call sites. */
    readonly updateAppearance: (mode: Appearance) => void;
};

export function initializeTheme(): void {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
}

export function useAppearance(): UseAppearanceReturn {
    return {
        appearance: 'dark',
        resolvedAppearance: 'dark',
        updateAppearance: () => {},
    };
}
