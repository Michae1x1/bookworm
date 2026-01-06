/**
 * Seeded random number generation utilities
 */
/**
 * Creates a seeded pseudo-random number generator using SplitMix32 algorithm
 * Based on MurmurHash3's finalizer
 *
 * @param seed - Initial seed value (will be normalized to 32-bit integer)
 * @returns Function that returns random numbers in range [0, 1)
 */
export function createSeededRandom(seed) {
    // Normalize seed to handle edge cases
    // Convert to number, default to current timestamp if invalid
    let normalizedSeed = Number(seed);
    // Handle NaN, Infinity, or other invalid values
    if (!isFinite(normalizedSeed)) {
        normalizedSeed = Date.now();
    }
    // Convert to 32-bit integer to ensure consistent behavior
    normalizedSeed = normalizedSeed | 0;
    return function () {
        // SplitMix32 algorithm
        // 0x6D2B79F5 is a magic constant from MurmurHash3
        let t = (normalizedSeed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        // Convert to [0, 1) range
        // >>> 0 converts to unsigned 32-bit integer
        // Division by 2^32 normalizes to [0, 1)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
/**
 * Shuffles an array using the Fisher-Yates algorithm with a seeded RNG
 * Creates a new array; does not mutate the original
 *
 * @param array - Array to shuffle (shallow copied)
 * @param random - Seeded random function returning [0, 1)
 * @returns New shuffled array
 */
export function seededShuffle(array, random) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
//# sourceMappingURL=random.js.map