/**
 * Loading UI components and infinite scroll management
 */
import type { Book } from '../types';
/**
 * Create a loading sentinel card for infinite scroll
 */
export declare function createLoadingCard(): HTMLElement;
/**
 * Phase 1 Improvement: Optimized image preloading
 * Preloads the first N book cover images
 */
export declare function preloadBookImages(books: Book[], count?: number): void;
/**
 * Setup intersection observer for loading sentinel
 */
export declare function observeLoadingSentinel(onIntersect: () => void, isLoadingMore: {
    value: boolean;
}): IntersectionObserver;
//# sourceMappingURL=loading.d.ts.map