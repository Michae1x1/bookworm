/**
 * Book card UI component and utilities
 */
import { CONFIG, UI_CONFIG } from '../config';
import { isFavorited, toggleFavorite } from '../core/favorites';
/**
 * Get the cover image URL from a book
 */
export function getCoverUrl(book) {
    return book.formats['image/jpeg'] || null;
}
/**
 * Get the Gutenberg project URL for a book
 */
export function getGutenbergUrl(book) {
    return `https://www.gutenberg.org/ebooks/${book.id}`;
}
/**
 * Get the reading URL (HTML format or fallback to Gutenberg page)
 */
export function getReadUrl(book) {
    return book.formats['text/html'] || getGutenbergUrl(book);
}
/**
 * Truncate text to a maximum length
 */
export function truncate(text, maxLength) {
    if (!text || text.length <= maxLength)
        return text || '';
    return text.substring(0, maxLength).trim() + '...';
}
/**
 * Setup logo refresh functionality - clicking the app name reloads the page
 */
export function setupLogoRefresh(element) {
    if (!element)
        return;
    element.addEventListener('click', () => location.reload());
    element.style.cursor = 'pointer';
}
/**
 * Create a book card element with all interactions
 */
export function createBookCard(book, onFavoritesPanelToggle) {
    const coverUrl = getCoverUrl(book);
    const author = book.authors[0]?.name || 'Unknown Author';
    const summary = book.summaries?.[0] || 'No summary available for this classic work.';
    const subjects = book.subjects?.slice(0, UI_CONFIG.MAX_TOTAL_TAGS) || [];
    const languages = book.languages || ['en'];
    const card = document.createElement('article');
    card.className = 'book-card';
    card.innerHTML = `
    <div class="card-bg">
      ${coverUrl ? `<img class="card-bg-image" src="${coverUrl}" alt="" loading="lazy">` : ''}
      <div class="card-bg-overlay"></div>
      <div class="card-bg-pattern"></div>
    </div>

    <div class="card-content">
      <header class="card-header">
        <span class="app-name">BookWorm</span>
        <button class="favorites-toggle-btn mobile-header-favorites" aria-label="View favorites">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span class="favorites-count">0</span>
        </button>
      </header>

      <div class="cover-container">
        <div class="book-cover">
          ${coverUrl
        ? `<img src="${coverUrl}" alt="${book.title}" loading="eager" class="cover-image" decoding="async">`
        : `<div class="cover-placeholder">${truncate(book.title, UI_CONFIG.COVER_PLACEHOLDER_MAX_LENGTH)}</div>`}
        </div>
      </div>

      <div class="book-info">
        <h1 class="book-title">${truncate(book.title, UI_CONFIG.TITLE_MAX_LENGTH)}</h1>
        <p class="book-author">
          <span class="author-line"></span>
          ${author}
        </p>
        <p class="book-summary">${truncate(summary, UI_CONFIG.SUMMARY_MAX_LENGTH)}</p>

        <div class="book-tags">
          ${languages.map((lang) => `<span class="tag language">${lang.toUpperCase()}</span>`).join('')}
          ${subjects
        .slice(0, UI_CONFIG.MAX_SUBJECTS_DISPLAYED)
        .map((s) => `<span class="tag">${truncate(s.split(' -- ')[0], UI_CONFIG.SUBJECT_MAX_LENGTH)}</span>`)
        .join('')}
        </div>
      </div>

      <div class="book-actions">
        <a href="${getReadUrl(book)}" target="_blank" rel="noopener" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Read
        </a>
        <div class="icon-wrapper favorite-wrapper">
          <svg class="action-favorite-icon ${isFavorited(book.id) ? 'favorited' : ''}" data-book-id="${book.id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" role="button" aria-label="Add to favorites">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <div class="icon-wrapper link-wrapper">
          <svg class="copy-link-icon" data-book-url="${getReadUrl(book)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" role="button" aria-label="Copy link">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
      </div>
    </div>
  `;
    // Setup logo refresh functionality
    setupLogoRefresh(card.querySelector('.app-name'));
    // Setup action favorite icon
    const actionFavoriteIcon = card.querySelector('.action-favorite-icon');
    if (actionFavoriteIcon) {
        actionFavoriteIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const isNowFavorited = toggleFavorite(book);
            actionFavoriteIcon.classList.toggle('favorited', isNowFavorited);
            actionFavoriteIcon.setAttribute('aria-label', isNowFavorited ? 'Remove from favorites' : 'Add to favorites');
        });
    }
    // Setup copy link icon
    const copyLinkIcon = card.querySelector('.copy-link-icon');
    if (copyLinkIcon) {
        copyLinkIcon.addEventListener('click', async (e) => {
            e.stopPropagation();
            const url = copyLinkIcon.dataset.bookUrl || '';
            try {
                await navigator.clipboard.writeText(url);
                // Visual feedback
                const originalHTML = copyLinkIcon.innerHTML;
                copyLinkIcon.innerHTML = `<path d="M20 6L9 17l-5-5"/>`;
                copyLinkIcon.classList.add('copied');
                setTimeout(() => {
                    copyLinkIcon.innerHTML = originalHTML;
                    copyLinkIcon.classList.remove('copied');
                }, CONFIG.COPY_FEEDBACK_DURATION_MS);
            }
            catch (err) {
                console.error('Failed to copy link:', err);
            }
        });
    }
    // Setup mobile header favorites toggle
    const mobileHeaderFavorites = card.querySelector('.mobile-header-favorites');
    if (mobileHeaderFavorites) {
        mobileHeaderFavorites.addEventListener('click', onFavoritesPanelToggle);
    }
    // Setup image load handler
    const coverImage = card.querySelector('.cover-image');
    if (coverImage) {
        coverImage.addEventListener('load', () => {
            coverImage.classList.add('loaded');
        });
        coverImage.addEventListener('error', () => {
            const placeholder = document.createElement('div');
            placeholder.className = 'cover-placeholder';
            placeholder.textContent = truncate(book.title, UI_CONFIG.COVER_PLACEHOLDER_MAX_LENGTH);
            coverImage.parentElement?.replaceChild(placeholder, coverImage);
        });
    }
    // Adjust title font size if it exceeds 2 lines - optimized with IntersectionObserver
    const titleElement = card.querySelector('.book-title');
    if (titleElement) {
        const checkTitleSize = () => {
            const lineHeight = parseFloat(getComputedStyle(titleElement).lineHeight);
            const height = titleElement.clientHeight;
            const lines = Math.round(height / lineHeight);
            if (lines > UI_CONFIG.TITLE_MAX_LINES) {
                titleElement.style.fontSize = UI_CONFIG.TITLE_FONT_SIZE_SMALL;
            }
        };
        // Use IntersectionObserver for better performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    checkTitleSize();
                    observer.disconnect(); // Only check once
                }
            });
        }, { rootMargin: UI_CONFIG.TITLE_OBSERVER_ROOT_MARGIN });
        observer.observe(card);
    }
    return card;
}
//# sourceMappingURL=bookCard.js.map