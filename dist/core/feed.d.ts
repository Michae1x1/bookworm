/**
 * Random Book Feed - Manages infinite book discovery with intelligent prefetching
 */
import type { RandomBookFeedOptions, FeedStats, GetNextResult } from '../types';
/**
 * RandomBookFeed - Samples individual random IDs across entire catalog
 * Uses batch ID queries for efficiency while maintaining true randomness
 */
export declare class RandomBookFeed {
    private seed;
    private random;
    private languages;
    private prefetchThreshold;
    private minId;
    private maxId;
    private buffer;
    private seenIds;
    private failedIds;
    private isInitialized;
    private isLoading;
    private hasMore;
    private totalAttempted;
    private totalFound;
    constructor(options?: RandomBookFeedOptions);
    initialize(): Promise<{
        maxId: number;
        seed: number;
    }>;
    /**
     * Phase 1 Improvement: Clean up old IDs to prevent unlimited memory growth
     */
    private cleanupOldIds;
    /**
     * Generate N unique random IDs we haven't tried yet
     */
    private generateRandomIds;
    /**
     * Load a batch of random books
     */
    private loadRandomBatch;
    getNext(count?: number): Promise<GetNextResult>;
    getStats(): FeedStats;
}
//# sourceMappingURL=feed.d.ts.map