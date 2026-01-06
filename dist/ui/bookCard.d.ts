/**
 * Book card UI component and utilities
 */
import type { Book } from '../types';
/**
 * Get the cover image URL from a book
 */
export declare function getCoverUrl(book: Book): string | null;
/**
 * Get the Gutenberg project URL for a book
 */
export declare function getGutenbergUrl(book: Book): string;
/**
 * Get the reading URL (HTML format or fallback to Gutenberg page)
 */
export declare function getReadUrl(book: Book): string;
/**
 * Truncate text to a maximum length
 */
export declare function truncate(text: string | undefined, maxLength: number): string;
/**
 * Setup logo refresh functionality - clicking the app name reloads the page
 */
export declare function setupLogoRefresh(element: Element | null): void;
/**
 * Create a book card element with all interactions
 */
export declare function createBookCard(book: Book, onFavoritesPanelToggle: () => void): HTMLElement;
//# sourceMappingURL=bookCard.d.ts.map