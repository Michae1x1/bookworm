/**
 * Random Book Feed - Manages infinite book discovery with intelligent prefetching
 */

import type {
  Book,
  RandomBookFeedOptions,
  FeedStats,
  GetNextResult,
  SeededRandomFunction,
} from '../types';
import { CONFIG, MEMORY_CONFIG } from '../config';
import { createSeededRandom, seededShuffle } from '../utils/random';
import { fetchMaxCatalogId, fetchBooksByIds } from '../api/gutendex';

/**
 * RandomBookFeed - Samples individual random IDs across entire catalog
 * Uses batch ID queries for efficiency while maintaining true randomness
 */
export class RandomBookFeed {
  private seed: number;
  private random: SeededRandomFunction;
  private languages: string | null;
  private prefetchThreshold: number;
  private minId: number;
  private maxId: number;
  private buffer: Book[] = [];
  private seenIds = new Set<number>();
  private failedIds = new Set<number>();
  private isInitialized = false;
  private isLoading = false;
  private hasMore = true;
  private totalAttempted = 0;
  private totalFound = 0;

  constructor(options: RandomBookFeedOptions = {}) {
    this.seed = options.seed || Date.now();
    this.random = createSeededRandom(this.seed);
    this.languages = options.languages || null;
    this.prefetchThreshold = options.prefetchThreshold || CONFIG.PREFETCH_THRESHOLD;

    // ID range for Gutenberg (approximately 1 to 75000, with gaps)
    this.minId = CONFIG.MIN_CATALOG_ID;
    this.maxId = CONFIG.MAX_CATALOG_ID;
  }

  async initialize(): Promise<{ maxId: number; seed: number }> {
    if (this.isInitialized) {
      return { maxId: this.maxId, seed: this.seed };
    }

    // Get the highest ID to refine our range
    const maxCatalogId = await fetchMaxCatalogId();
    if (maxCatalogId !== null) {
      // Set maxId slightly above the highest known ID
      this.maxId = maxCatalogId + CONFIG.MAX_ID_BUFFER;
    }

    // Pre-fill buffer with initial batch
    await this.loadRandomBatch(CONFIG.INITIAL_BATCH_SIZE);
    this.isInitialized = true;

    return { maxId: this.maxId, seed: this.seed };
  }

  /**
   * Phase 1 Improvement: Clean up old IDs to prevent unlimited memory growth
   */
  private cleanupOldIds(): void {
    if (this.seenIds.size > MEMORY_CONFIG.MAX_SEEN_IDS) {
      // Keep only the most recent IDs
      const recentIds = Array.from(this.seenIds).slice(-MEMORY_CONFIG.CLEANUP_KEEP_COUNT);
      this.seenIds = new Set(recentIds);

      console.log(`Memory cleanup: Reduced seenIds from ${MEMORY_CONFIG.MAX_SEEN_IDS} to ${this.seenIds.size}`);
    }

    // Also cleanup failed IDs if they grow too large
    if (this.failedIds.size > MEMORY_CONFIG.MAX_SEEN_IDS) {
      const recentFailedIds = Array.from(this.failedIds).slice(-MEMORY_CONFIG.CLEANUP_KEEP_COUNT);
      this.failedIds = new Set(recentFailedIds);

      console.log(`Memory cleanup: Reduced failedIds from ${MEMORY_CONFIG.MAX_SEEN_IDS} to ${this.failedIds.size}`);
    }
  }

  /**
   * Generate N unique random IDs we haven't tried yet
   */
  private generateRandomIds(count: number): number[] {
    const ids = new Set<number>();
    let attempts = 0;
    const maxAttempts = count * CONFIG.MAX_ID_ATTEMPTS_MULTIPLIER;

    while (ids.size < count && attempts < maxAttempts) {
      const id = Math.floor(this.random() * this.maxId) + this.minId;
      if (!this.seenIds.has(id) && !this.failedIds.has(id)) {
        ids.add(id);
      }
      attempts++;
    }

    return Array.from(ids);
  }

  /**
   * Load a batch of random books
   */
  private async loadRandomBatch(targetCount = 10): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      let collected: Book[] = [];
      let rounds = 0;
      const maxRounds = CONFIG.MAX_ROUNDS;

      // Keep trying until we have enough books or hit max rounds
      while (collected.length < targetCount && rounds < maxRounds) {
        // Request more IDs than needed to account for invalid ones
        // Gutenberg has ~70k books across ~75k IDs, so ~93% hit rate
        const idsToTry = Math.ceil((targetCount - collected.length) * CONFIG.ID_MULTIPLIER);
        const randomIds = this.generateRandomIds(idsToTry);

        this.totalAttempted += randomIds.length;

        // Mark all as seen to prevent re-fetching
        randomIds.forEach((id) => this.seenIds.add(id));

        // Fetch books
        const books = await fetchBooksByIds(randomIds, this.languages);

        // Track which IDs were valid
        const foundIds = new Set(books.map((b) => b.id));
        randomIds.forEach((id) => {
          if (!foundIds.has(id)) {
            this.failedIds.add(id);
          }
        });

        this.totalFound += books.length;
        collected.push(...books);
        rounds++;
      }

      // Shuffle the collected books for extra randomness
      const shuffled = seededShuffle(collected, this.random);
      this.buffer.push(...shuffled);

      // Phase 1 Improvement: Cleanup memory periodically
      this.cleanupOldIds();

      // Check if we're running out of IDs
      if (this.seenIds.size + this.failedIds.size > this.maxId * CONFIG.MAX_CATALOG_PERCENTAGE) {
        this.hasMore = false;
      }
    } finally {
      this.isLoading = false;
    }
  }

  async getNext(count = 1): Promise<GetNextResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Prefetch if running low
    if (this.buffer.length < this.prefetchThreshold && this.hasMore && !this.isLoading) {
      this.loadRandomBatch(CONFIG.LOAD_BATCH_SIZE).catch(console.error);
    }

    // Wait for loading if buffer is empty
    if (this.buffer.length === 0 && this.isLoading) {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          clearInterval(check);
          reject(new Error('Loading timeout - books failed to load'));
        }, CONFIG.LOADING_TIMEOUT_MS);

        const check = setInterval(() => {
          if (!this.isLoading || this.buffer.length > 0) {
            clearInterval(check);
            clearTimeout(timeout);
            resolve();
          }
        }, CONFIG.LOADING_POLL_INTERVAL_MS);
      });
    }

    const books = this.buffer.splice(0, count);

    // Trigger background prefetch
    if (this.buffer.length < this.prefetchThreshold && this.hasMore && !this.isLoading) {
      this.loadRandomBatch(CONFIG.LOAD_BATCH_SIZE).catch(console.error);
    }

    return {
      books,
      hasMore: this.hasMore || this.buffer.length > 0,
    };
  }

  getStats(): FeedStats {
    return {
      attempted: this.totalAttempted,
      found: this.totalFound,
      hitRate:
        this.totalAttempted > 0
          ? ((this.totalFound / this.totalAttempted) * 100).toFixed(1) + '%'
          : 'N/A',
      bufferSize: this.buffer.length,
      seenCount: this.seenIds.size,
    };
  }
}
