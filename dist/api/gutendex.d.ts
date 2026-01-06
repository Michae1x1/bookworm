/**
 * Gutendex API client for fetching books from Project Gutenberg
 */
import type { Book } from '../types';
/**
 * Fetch the maximum book ID in the catalog
 * @returns The highest book ID, or null if fetch fails
 */
export declare function fetchMaxCatalogId(): Promise<number | null>;
/**
 * Fetch books by their IDs using Gutendex batch endpoint
 * @param ids - Array of book IDs to fetch
 * @param languages - Optional language filter (e.g., 'en')
 * @returns Array of books, empty if fetch fails
 */
export declare function fetchBooksByIds(ids: number[], languages?: string | null): Promise<Book[]>;
//# sourceMappingURL=gutendex.d.ts.map