# Pokemon Battle Companion

A mobile-first Progressive Web App (PWA) for Pokemon battles, featuring type effectiveness calculations, Pokemon search, and comprehensive type charts. Built with SvelteKit 5 and styled with retro 8-bit fonts inspired by the classic Pokedex.

## Features

- **Battle Helper** - Search any Pokemon with autocomplete and instantly see what types to use against it
- **Type Recommendations** - Color-coded super effective, not very effective, and immune types
- **Type Reference** - Complete type matchup chart for all 18 Pokemon types
- **Autocomplete Search** - Fast Pokemon search by name or number (all 1000+ Pokemon)
- **Offline-First** - Uses IndexedDB and service workers for full offline functionality
- **Retro 8-bit Design** - Press Start 2P and VT323 fonts with Pokedex-inspired colors

## Tech Stack

- **SvelteKit 5** with Svelte 5.41+ (Runes API)
- **TypeScript** (strict mode)
- **Vite 7** for blazing fast builds
- **@vite-pwa/sveltekit** for Progressive Web App functionality
- **IndexedDB** (via idb) for offline data storage
- **PokeAPI** for Pokemon data
- **Google Fonts** (Press Start 2P, VT323)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start dev server and open browser
npm run dev -- --open
```

The app will be available at http://localhost:5173/

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Development Commands

```bash
# Type checking
npm run check

# Type checking with watch mode
npm run check:watch

# Format code
npm run format

# Lint code
npm run lint
```

## PWA Features

- **Offline Support** - Full functionality without internet after initial load
- **Install Prompt** - Can be installed on mobile devices as a standalone app
- **Service Worker** - Caches PokeAPI requests for 30 days
- **IndexedDB Storage** - Pokemon data cached locally for instant access
- **Manifest** - Configured with Pokedex red theme color

## Project Structure

```
src/
├── lib/
│   ├── components/        # Reusable components (TypeBadge, Autocomplete, Footer)
│   ├── data/              # Type chart and color data
│   ├── services/          # PokeAPI and IndexedDB services
│   └── types/             # TypeScript type definitions
├── routes/
│   ├── +page.svelte       # Battle Helper (home)
│   └── chart/             # Type reference chart
└── app.css                # Global styles with Pokedex theme
```

## Color Palette

The app uses colors extracted from the classic red Pokedex:

- Primary Red: `#DC0A2D`
- Secondary Blue: `#3B4CCA`
- Accent Yellow: `#FFCB05`
- Background Cream: `#FFFBF7`

## Data & Caching

- **Pokemon Names**: All 1000+ Pokemon names cached in localStorage for instant autocomplete
- **Progressive Caching**: Full Pokemon data cached as you search them in IndexedDB
- **Cache Duration**: 30 days for Pokemon data
- **Offline Fallback**: Returns cached data when offline
- **Smart Loading**: Only fetches Pokemon details when you select from autocomplete

## Browser Support

- Modern browsers with ES6+ support
- IndexedDB support required for offline functionality
- Service Worker support required for PWA features

## License

This project uses data from [PokeAPI](https://pokeapi.co/), a free and open Pokemon API.

Pokemon and Pokemon character names are trademarks of Nintendo.
