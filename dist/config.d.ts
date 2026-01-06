/**
 * Configuration constants for BookWorm application
 */
import type { Config } from './types';
export declare const CONFIG: Config;
export declare const UI_CONFIG: {
    TITLE_MAX_LINES: number;
    TITLE_FONT_SIZE_SMALL: string;
    TITLE_FONT_SIZE_DEFAULT: string;
    TITLE_MAX_LENGTH: number;
    AUTHOR_DISPLAY_MAX_LENGTH: number;
    SUMMARY_MAX_LENGTH: number;
    SUBJECT_MAX_LENGTH: number;
    COVER_PLACEHOLDER_MAX_LENGTH: number;
    FAVORITE_TITLE_MAX_LENGTH: number;
    FAVORITE_PLACEHOLDER_MAX_LENGTH: number;
    MAX_SUBJECTS_DISPLAYED: number;
    MAX_TOTAL_TAGS: number;
    PRELOAD_IMAGE_COUNT: number;
    TITLE_OBSERVER_ROOT_MARGIN: string;
};
export declare const MEMORY_CONFIG: {
    MAX_SEEN_IDS: number;
    CLEANUP_KEEP_COUNT: number;
    FAVORITES_STORAGE_KEY: string;
    LOCALSTORAGE_SAVE_DEBOUNCE_MS: number;
};
//# sourceMappingURL=config.d.ts.map