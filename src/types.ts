/**
 * Type definitions for BookWorm application
 */

// ============ Configuration Types ============

export interface Config {
  // API
  GUTENDEX_BASE_URL: string;

  // Feed Configuration
  PREFETCH_THRESHOLD: number;
  INITIAL_BATCH_SIZE: number;
  LOAD_BATCH_SIZE: number;
  LOAD_MORE_COUNT: number;
  MAX_ROUNDS: number;
  ID_MULTIPLIER: number;
  MAX_ID_ATTEMPTS_MULTIPLIER: number;

  // Catalog Settings
  MIN_CATALOG_ID: number;
  MAX_CATALOG_ID: number;
  MAX_CATALOG_PERCENTAGE: number;
  MAX_ID_BUFFER: number;

  // Timing
  LOADING_POLL_INTERVAL_MS: number;
  LOADING_TIMEOUT_MS: number;
  COPY_FEEDBACK_DURATION_MS: number;

  // Intersection Observer
  INTERSECTION_ROOT_MARGIN: string;
  INTERSECTION_THRESHOLD: number;
}

// ============ Gutendex API Types ============

export interface Author {
  name: string;
  birth_year: number | null;
  death_year: number | null;
}

export interface Translator {
  name: string;
  birth_year: number | null;
  death_year: number | null;
}

export interface BookFormats {
  'text/html'?: string;
  'application/epub+zip'?: string;
  'application/x-mobipocket-ebook'?: string;
  'text/plain; charset=us-ascii'?: string;
  'application/rdf+xml'?: string;
  'image/jpeg'?: string;
  'application/octet-stream'?: string;
  'text/plain; charset=utf-8'?: string;
  [key: string]: string | undefined;
}

export interface Book {
  id: number;
  title: string;
  authors: Author[];
  translators: Translator[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean | null;
  media_type: string;
  formats: BookFormats;
  download_count: number;
  summaries?: string[];
}

export interface GutendexResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}

// ============ Feed Types ============

export interface RandomBookFeedOptions {
  seed?: number;
  languages?: string | null;
  prefetchThreshold?: number;
}

export interface FeedStats {
  attempted: number;
  found: number;
  hitRate: string;
  bufferSize: number;
  seenCount: number;
}

export interface GetNextResult {
  books: Book[];
  hasMore: boolean;
}

// ============ Random Number Generator Types ============

export type SeededRandomFunction = () => number;

// ============ Utility Types ============

export type FavoritesList = Book[];
