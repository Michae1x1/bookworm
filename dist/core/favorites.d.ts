/**
 * Favorites management with localStorage persistence and DOM caching
 */
import type { Book, FavoritesList } from '../types';
/**
 * Initialize and cache frequently accessed DOM elements
 */
export declare function initializeFavoritesDOM(): void;
/**
 * Get favorites from cache or localStorage
 */
export declare function getFavorites(): FavoritesList;
/**
 * Save favorites to localStorage and update cache
 */
export declare function saveFavorites(favorites: FavoritesList): void;
/**
 * Check if a book is favorited
 */
export declare function isFavorited(bookId: number): boolean;
/**
 * Toggle favorite status of a book
 * @returns true if added, false if removed
 */
export declare function toggleFavorite(book: Book): boolean;
/**
 * Phase 1 Improvement: Update favorites count using cached DOM elements
 */
export declare function updateFavoritesCount(): void;
/**
 * Refresh cached DOM elements (call after DOM updates)
 */
export declare function refreshFavoritesDOMCache(): void;
//# sourceMappingURL=favorites.d.ts.map