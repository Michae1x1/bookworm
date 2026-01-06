/**
 * Seeded random number generation utilities
 */
import type { SeededRandomFunction } from '../types';
/**
 * Creates a seeded pseudo-random number generator using SplitMix32 algorithm
 * Based on MurmurHash3's finalizer
 *
 * @param seed - Initial seed value (will be normalized to 32-bit integer)
 * @returns Function that returns random numbers in range [0, 1)
 */
export declare function createSeededRandom(seed: number): SeededRandomFunction;
/**
 * Shuffles an array using the Fisher-Yates algorithm with a seeded RNG
 * Creates a new array; does not mutate the original
 *
 * @param array - Array to shuffle (shallow copied)
 * @param random - Seeded random function returning [0, 1)
 * @returns New shuffled array
 */
export declare function seededShuffle<T>(array: T[], random: SeededRandomFunction): T[];
//# sourceMappingURL=random.d.ts.map