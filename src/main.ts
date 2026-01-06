/**
 * BookWorm - Main application entry point
 * Discover 70,000+ classic books from Project Gutenberg
 */

import { CONFIG } from './config';
import { RandomBookFeed } from './core/feed';
import {
  initializeFavoritesDOM,
  updateFavoritesCount,
  refreshFavoritesDOMCache,
} from './core/favorites';
import { setupLogoRefresh, createBookCard } from './ui/bookCard';
import {
  createLoadingCard,
  observeLoadingSentinel,
  preloadBookImages,
} from './ui/loading';
import { toggleFavoritesPanel } from './ui/favoritesPanel';

// ============ Application State ============

const bookFeed = new RandomBookFeed({
  languages: 'en',
  prefetchThreshold: CONFIG.PREFETCH_THRESHOLD,
});

// Use ref object so observer can see state changes
const isLoadingMore = { value: false };
let observer: IntersectionObserver | null = null;

// Phase 1 Improvement: Cached DOM references
const cachedDOM = {
  feed: document.getElementById('feed'),
  favoritesToggle: document.getElementById('favoritesToggle'),
  favoritesClose: document.getElementById('favoritesClose'),
  desktopHeader: document.getElementById('desktopHeader'),
};

// ============ Feed Management ============

/**
 * Load more books into the feed
 * Phase 1 Improvement: Simplified image preloading logic
 */
async function loadMoreBooks(count = CONFIG.LOAD_MORE_COUNT): Promise<void> {
  if (isLoadingMore.value || !cachedDOM.feed) return;
  isLoadingMore.value = true;

  try {
    const { books, hasMore } = await bookFeed.getNext(count);

    const sentinel = document.getElementById('loading-sentinel');
    if (sentinel) sentinel.remove();

    // Phase 1 Improvement: Simplified book card rendering
    books.forEach((book) => {
      const card = createBookCard(book, toggleFavoritesPanel);
      cachedDOM.feed!.appendChild(card);
    });

    // Phase 1 Improvement: Optimized image preloading (separate from rendering)
    preloadBookImages(books);

    if (hasMore) {
      cachedDOM.feed!.appendChild(createLoadingCard());
      setupIntersectionObserver();
    }
  } catch (error) {
    console.error('Failed to load books:', error);
  } finally {
    isLoadingMore.value = false;
  }
}

/**
 * Setup intersection observer for infinite scroll
 */
function setupIntersectionObserver(): void {
  if (observer) observer.disconnect();

  observer = observeLoadingSentinel(
    () => loadMoreBooks(CONFIG.LOAD_MORE_COUNT),
    isLoadingMore
  );
}

// ============ Initialization ============

/**
 * Initialize the application
 */
async function init(): Promise<void> {
  if (!cachedDOM.feed) return;

  cachedDOM.feed.appendChild(createLoadingCard());

  try {
    await bookFeed.initialize();
    cachedDOM.feed.innerHTML = '';
    await loadMoreBooks(CONFIG.LOAD_MORE_COUNT);
  } catch (error) {
    console.error('Failed to initialize:', error);
    cachedDOM.feed.innerHTML = `
      <div class="error-state">
        <h2>Something went wrong</h2>
        <p>We couldn't load the books. Please try again.</p>
        <button class="btn btn-primary" onclick="location.reload()">
          Refresh
        </button>
      </div>
    `;
  }
}

// ============ Event Listeners Setup ============

/**
 * Setup global event listeners
 */
function setupEventListeners(): void {
  // Setup desktop header logo refresh
  if (cachedDOM.desktopHeader) {
    setupLogoRefresh(cachedDOM.desktopHeader.querySelector('.app-name'));
  }

  // Setup favorites panel toggles
  if (cachedDOM.favoritesToggle) {
    cachedDOM.favoritesToggle.addEventListener('click', toggleFavoritesPanel);
  }

  if (cachedDOM.favoritesClose) {
    cachedDOM.favoritesClose.addEventListener('click', toggleFavoritesPanel);
  }

  // Prevent middle mouse button auto-scroll
  document.addEventListener('mousedown', (e) => {
    if (e.button === 1) {
      e.preventDefault();
    }
  });
}

// ============ Application Start ============

// Phase 1 Improvement: Initialize DOM caching for favorites
initializeFavoritesDOM();

// Setup all event listeners
setupEventListeners();

// Initialize favorites count display
updateFavoritesCount();

// Refresh DOM cache after initial setup
refreshFavoritesDOMCache();

// Start the application
init();
