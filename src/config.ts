/**
 * Configuration constants for BookWorm application
 */

import type { Config } from './types';

export const CONFIG: Config = {
  // API
  GUTENDEX_BASE_URL: 'https://gutendex.com',

  // Feed Configuration
  PREFETCH_THRESHOLD: 25, // Start prefetching when 25 books remain in buffer
  INITIAL_BATCH_SIZE: 50, // Load 50 books upfront for large initial cache
  LOAD_BATCH_SIZE: 30, // Load 30 more books in background
  LOAD_MORE_COUNT: 7,
  MAX_ROUNDS: 5,
  ID_MULTIPLIER: 2.0, // Request 2x IDs to minimize API round trips (~93% hit rate)
  MAX_ID_ATTEMPTS_MULTIPLIER: 10,

  // Catalog Settings
  MIN_CATALOG_ID: 1,
  MAX_CATALOG_ID: 75000,
  MAX_CATALOG_PERCENTAGE: 0.9, // Stop when 90% of IDs have been tried
  MAX_ID_BUFFER: 500, // Add buffer when determining max ID

  // Timing
  LOADING_POLL_INTERVAL_MS: 100,
  LOADING_TIMEOUT_MS: 30000, // 30 seconds max wait
  COPY_FEEDBACK_DURATION_MS: 2000,

  // Intersection Observer
  INTERSECTION_ROOT_MARGIN: '200px',
  INTERSECTION_THRESHOLD: 0,
};

// UI Configuration (extracted magic numbers)
export const UI_CONFIG = {
  // Title font sizing
  TITLE_MAX_LINES: 2,
  TITLE_FONT_SIZE_SMALL: 'clamp(1.2rem, 4.5vw, 1.7rem)',
  TITLE_FONT_SIZE_DEFAULT: 'clamp(1.4rem, 5vw, 1.9rem)',

  // Text truncation
  TITLE_MAX_LENGTH: 70,
  AUTHOR_DISPLAY_MAX_LENGTH: 50,
  SUMMARY_MAX_LENGTH: 200,
  SUBJECT_MAX_LENGTH: 12,
  COVER_PLACEHOLDER_MAX_LENGTH: 40,
  FAVORITE_TITLE_MAX_LENGTH: 50,
  FAVORITE_PLACEHOLDER_MAX_LENGTH: 20,

  // UI limits
  MAX_SUBJECTS_DISPLAYED: 2,
  MAX_TOTAL_TAGS: 3,

  // Image preloading
  PRELOAD_IMAGE_COUNT: 3,

  // IntersectionObserver
  TITLE_OBSERVER_ROOT_MARGIN: '50px',
};

// Memory Management Configuration (Phase 1 improvement)
export const MEMORY_CONFIG = {
  MAX_SEEN_IDS: 10000, // Maximum IDs to keep in memory
  CLEANUP_KEEP_COUNT: 5000, // How many recent IDs to keep after cleanup
  FAVORITES_STORAGE_KEY: 'bookworm_favorites',
  LOCALSTORAGE_SAVE_DEBOUNCE_MS: 300,
};
