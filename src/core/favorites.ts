/**
 * Favorites management with localStorage persistence and DOM caching
 */

import type { Book, FavoritesList } from '../types';
import { MEMORY_CONFIG } from '../config';

// Cache for favorites to avoid repeated localStorage reads
let favoritesCache: FavoritesList | null = null;

// Cache DOM elements to avoid repeated queries
let cachedDOMElements: {
  favoritesCount: HTMLElement[];
} | null = null;

/**
 * Initialize and cache frequently accessed DOM elements
 */
export function initializeFavoritesDOM(): void {
  cachedDOMElements = {
    favoritesCount: Array.from(document.querySelectorAll('.favorites-count')),
  };
}

/**
 * Get cached DOM elements, initializing if needed
 */
function getDOMElements() {
  if (!cachedDOMElements) {
    initializeFavoritesDOM();
  }
  return cachedDOMElements!;
}

/**
 * Get favorites from cache or localStorage
 */
export function getFavorites(): FavoritesList {
  // Return cached value if available
  if (favoritesCache !== null) {
    return favoritesCache;
  }

  try {
    const stored = localStorage.getItem(MEMORY_CONFIG.FAVORITES_STORAGE_KEY);
    const favorites: FavoritesList = stored ? JSON.parse(stored) : [];
    favoritesCache = favorites;
    return favorites;
  } catch (e) {
    console.error('Failed to load favorites:', e);
    favoritesCache = [];
    return [];
  }
}

/**
 * Save favorites to localStorage and update cache
 */
export function saveFavorites(favorites: FavoritesList): void {
  try {
    localStorage.setItem(MEMORY_CONFIG.FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    // Update cache on successful save
    favoritesCache = favorites;
  } catch (e) {
    console.error('Failed to save favorites:', e);

    // Handle quota exceeded error
    if (e instanceof Error && e.name === 'QuotaExceededError') {
      alert('Storage quota exceeded! Your favorites list is full. Please remove some items to add new ones.');
    } else {
      alert('Failed to save favorites. Please try again.');
    }

    // Re-throw to let caller know save failed
    throw e;
  }
}

/**
 * Check if a book is favorited
 */
export function isFavorited(bookId: number): boolean {
  const favorites = getFavorites();
  return favorites.some((book) => book.id === bookId);
}

/**
 * Toggle favorite status of a book
 * @returns true if added, false if removed
 */
export function toggleFavorite(book: Book): boolean {
  const favorites = getFavorites();
  const index = favorites.findIndex((b) => b.id === book.id);

  if (index >= 0) {
    // Remove from favorites
    favorites.splice(index, 1);
  } else {
    // Add to favorites
    favorites.push(book);
  }

  try {
    saveFavorites(favorites);
    updateFavoritesCount();
    return index < 0; // Return true if added, false if removed
  } catch (e) {
    // Save failed, revert the change
    if (index >= 0) {
      favorites.push(book);
    } else {
      favorites.pop();
    }
    return index >= 0; // Return current state (unchanged)
  }
}

/**
 * Phase 1 Improvement: Update favorites count using cached DOM elements
 */
export function updateFavoritesCount(): void {
  const count = getFavorites().length;
  const elements = getDOMElements();

  elements.favoritesCount.forEach((el) => {
    el.textContent = count.toString();
    // Keep badge hidden
    el.style.display = 'none';
  });
}

/**
 * Refresh cached DOM elements (call after DOM updates)
 */
export function refreshFavoritesDOMCache(): void {
  cachedDOMElements = null;
  initializeFavoritesDOM();
}
