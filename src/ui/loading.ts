/**
 * Loading UI components and infinite scroll management
 */

import type { Book } from '../types';
import { CONFIG, UI_CONFIG } from '../config';
import { createBookCard, getCoverUrl } from './bookCard';

/**
 * Create a loading sentinel card for infinite scroll
 */
export function createLoadingCard(): HTMLElement {
  const card = document.createElement('div');
  card.className = 'loading-card';
  card.id = 'loading-sentinel';
  card.innerHTML = `
    <div class="loader"></div>
    <p class="loading-text">Discovering more books...</p>
  `;
  return card;
}

/**
 * Phase 1 Improvement: Optimized image preloading
 * Preloads the first N book cover images
 */
export function preloadBookImages(books: Book[], count: number = UI_CONFIG.PRELOAD_IMAGE_COUNT): void {
  books.slice(0, Math.min(count, books.length)).forEach((book) => {
    const coverUrl = getCoverUrl(book);
    if (coverUrl) {
      const img = new Image();
      img.src = coverUrl;
    }
  });
}

/**
 * Setup intersection observer for loading sentinel
 */
export function observeLoadingSentinel(
  onIntersect: () => void,
  isLoadingMore: { value: boolean }
): IntersectionObserver {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && !isLoadingMore.value) {
        onIntersect();
      }
    },
    {
      rootMargin: CONFIG.INTERSECTION_ROOT_MARGIN,
      threshold: CONFIG.INTERSECTION_THRESHOLD,
    }
  );

  const sentinel = document.getElementById('loading-sentinel');
  if (sentinel) {
    observer.observe(sentinel);
  }

  return observer;
}
