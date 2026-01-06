/**
 * Favorites panel UI management
 */
import { getFavorites, toggleFavorite } from '../core/favorites';
import { getCoverUrl, getReadUrl, truncate } from './bookCard';
import { UI_CONFIG } from '../config';
/**
 * Render the favorites panel content
 */
export function renderFavorites() {
    const favoritesContent = document.getElementById('favoritesContent');
    if (!favoritesContent)
        return;
    const favorites = getFavorites();
    if (favorites.length === 0) {
        favoritesContent.innerHTML = `
      <div class="favorites-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          <path d="M8 7h6M8 11h8"/>
        </svg>
        <p>No favorites yet</p>
        <small>Tap the book icon to save books here</small>
      </div>
    `;
        return;
    }
    favoritesContent.innerHTML = favorites
        .map((book) => {
        const coverUrl = getCoverUrl(book);
        const author = book.authors[0]?.name || 'Unknown Author';
        return `
      <div class="favorite-item" data-book-id="${book.id}">
        <div class="favorite-cover">
          ${coverUrl
            ? `<img src="${coverUrl}" alt="${book.title}" loading="lazy">`
            : `<div class="cover-placeholder-small">${truncate(book.title, UI_CONFIG.FAVORITE_PLACEHOLDER_MAX_LENGTH)}</div>`}
        </div>
        <div class="favorite-info">
          <h3>${truncate(book.title, UI_CONFIG.FAVORITE_TITLE_MAX_LENGTH)}</h3>
          <p>${author}</p>
        </div>
        <div class="favorite-actions">
          <a href="${getReadUrl(book)}" target="_blank" rel="noopener" class="favorite-read-btn" aria-label="Read book">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </a>
          <button class="favorite-remove-btn" data-book-id="${book.id}" aria-label="Remove from favorites">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    })
        .join('');
    // Setup remove buttons
    favoritesContent.querySelectorAll('.favorite-remove-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const bookId = parseInt(btn.getAttribute('data-book-id') ?? '0', 10);
            const favorites = getFavorites();
            const book = favorites.find((b) => b.id === bookId);
            if (book) {
                toggleFavorite(book);
                renderFavorites();
                // Update favorite buttons in the feed
                document.querySelectorAll(`.action-favorite-icon[data-book-id="${bookId}"]`).forEach((feedBtn) => {
                    feedBtn.classList.remove('favorited');
                });
            }
        });
    });
}
/**
 * Toggle the favorites panel open/closed
 */
export function toggleFavoritesPanel() {
    const panel = document.getElementById('favoritesPanel');
    if (!panel)
        return;
    const isOpen = panel.classList.contains('open');
    if (isOpen) {
        panel.classList.remove('open');
    }
    else {
        renderFavorites();
        panel.classList.add('open');
    }
}
//# sourceMappingURL=favoritesPanel.js.map