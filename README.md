# BookWorm

A modern, TikTok-style book discovery app for classic literature from Project Gutenberg.

## Features

- Browse 70,000+ classic books
- Seeded random feed (consistent per session)
- Save favorites (localStorage)
- Mobile-first, responsive design
- Infinite scroll with prefetching
- Share book links

## Tech Stack

- **TypeScript** 
- **Vite** 
- **Vanilla DOM** 
- **CSS3** 

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

### Development

The app will be available at `http://localhost:3000/`

Hot module replacement (HMR) is enabled - changes to TypeScript and CSS will update instantly.

## Project Structure

```
bookworm/
├── src/
│   ├── main.ts           # Main application logic
│   └── types.ts          # TypeScript type definitions
├── index.html            # HTML entry point
├── styles.css            # Global styles
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```


## API

Data is fetched from the free [Gutendex API](https://gutendex.com/):
- No authentication required
- RESTful JSON API
- Covers the entire Project Gutenberg catalog


## Browser Support

- Modern browsers with ES2020 support
- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## License

MIT

## Author

Developed by Michae1x1
