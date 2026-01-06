/**
 * Gutendex API client for fetching books from Project Gutenberg
 */

import type { Book, GutendexResponse } from '../types';

const GUTENDEX_BASE_URL = 'https://gutendex.com';

/**
 * Fetch the maximum book ID in the catalog
 * @returns The highest book ID, or null if fetch fails
 */
export async function fetchMaxCatalogId(): Promise<number | null> {
  try {
    const response = await fetch(`${GUTENDEX_BASE_URL}/books?sort=descending`);
    const data: GutendexResponse = await response.json();
    if (data.results && data.results.length > 0) {
      return Math.max(...data.results.map((b) => b.id));
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch max catalog ID:', error);
    return null;
  }
}

/**
 * Fetch books by their IDs using Gutendex batch endpoint
 * @param ids - Array of book IDs to fetch
 * @param languages - Optional language filter (e.g., 'en')
 * @returns Array of books, empty if fetch fails
 */
export async function fetchBooksByIds(
  ids: number[],
  languages?: string | null
): Promise<Book[]> {
  if (ids.length === 0) return [];

  const url = new URL(`${GUTENDEX_BASE_URL}/books`);
  url.searchParams.append('ids', ids.join(','));

  if (languages) {
    url.searchParams.append('languages', languages);
  }

  try {
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: GutendexResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Batch fetch error:', error);
    return [];
  }
}
