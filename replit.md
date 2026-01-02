# Age of Empires 4 Strategy Guide

## Overview

This is a web application that provides personalized Age of Empires 4 strategy guides based on players' most recent matches. Users search for their player name (or navigate directly to `/{profileId}-{playerName}`), and the app fetches their last game from the AoE4World API, then displays tailored guides including:

- **Your Civilization guide** - Build orders, unique units, and key strengths for the civilization they played
- **Map guide** - Resource locations, key points, and tactical approaches for the specific map
- **Opponent's Civilization guide** - Understanding the enemy's civilization strengths and unique units

All guides are displayed in free-form markdown format for easy reading. The application serves as a tactical learning tool for AoE4 players, helping them improve by understanding the strategic nuances of their recent matches.

## Recent Changes

### Moved Guides to Markdown Files
All strategy guides have been moved from inline TypeScript strings to dedicated markdown files for better maintainability:

**Changes Made:**
- Created `client/src/content/civilizations/` directory with 22 individual `.md` files (one per civilization)
- Created `client/src/content/maps/` directory with 12 individual `.md` files (one per map)
- Updated `client/src/lib/guides.ts` to import markdown content using Vite's `?raw` imports
- Added `client/src/vite-env.d.ts` with TypeScript declarations for markdown imports

**Benefits:**
- Easier to edit guide content in dedicated markdown files
- Better version control diffs (changes to one guide don't affect the entire guides.ts file)
- Syntax highlighting and markdown preview support in editors
- Cleaner separation of content from application logic

**File Structure:**
```
client/src/content/
├── civilizations/
│   ├── abbasid.md
│   ├── ayyubids.md
│   ├── ... (22 files total)
│   └── zhu_xis_legacy.md
└── maps/
    ├── altai.md
    ├── archipelago.md
    ├── ... (12 files total)
    └── sunkenlands.md
```

### Converted to Static Website
The application has been converted from a server-based proxy architecture to a fully static website:

**Changes Made:**
- Frontend now calls AoE4World API directly (CORS is not an issue as AoE4World allows cross-origin requests)
- Removed all backend server code and dependencies (Express, sessions, authentication packages)
- Application is now a pure static site that can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)
- Development runs Vite directly - no backend server involved
- Production builds create a standalone static site in `dist/public`

**Technical Details:**
- Updated `PlayerSearchInput.tsx` to call `https://aoe4world.com/api/v0/players/autocomplete` directly
- Updated `Home.tsx` to call `https://aoe4world.com/api/v0/players/{profileId}/games/last` directly
- Updated `fetchPlayerByName` and `fetchPlayerById` helper functions in `Home.tsx` to use AoE4World API
- All API calls include 10-second timeout protection using AbortController and proper error handling
- Added warning comments to `queryClient.ts` to prevent accidental use of legacy proxy functions
- Removed all server code (`/server` directory) - no longer needed

**Important Notes:**
- The application makes NO API calls to local endpoints (`/api/*`) - everything goes directly to AoE4World
- Legacy functions in `queryClient.ts` (`apiRequest`, `getQueryFn`) are NOT used and should NOT be used for new features
- All data fetching uses plain `fetch()` calls with proper timeout and error handling
- No backend server exists - this is a pure static site

**Deployment Options:**
1. **Static hosting**: Run `npm run build` to create production build in `dist/public`, then deploy to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.)
2. **Replit development**: Run Vite directly with `npx vite --port 5000 --host 0.0.0.0`

### Rating-to-Rank Conversion System
Complete redesign of rank and MMR display system with rating-based rank labels and filtered mode tooltips:

**Rank Display:**
- Rank labels now interpolated from rating numbers using tier thresholds (e.g., 1811 → "Conq 3")
- Rating extracted from `teams.[].{}.rating` field in game API response
- Tier system: Bronze (0-499), Silver (500-699), Gold (700-999), Platinum (1000-1199), Diamond (1200-1399), Conqueror (1400+)
- Each division has 3 tiers (1 = lowest, 3 = highest within division)

**MMR Display:**
- Shows `teams.[].{}.mmr` value directly from game API response
- Represents matchmaking rating for the current game

**Mode Filtering for Tooltips:**
- **Rank Tooltip (on rank hover)**: Displays ratings from standard modes only (modes without suffixes)
  - Includes: rm_solo, rm_team, rm_ffa, qm_1v1, qm_2v2, qm_3v3, qm_4v4, qm_ffa
  - Excludes: modes with suffixes like _elo, _ew, _chartacourse, _mapmonsters, etc.
- **MMR Tooltip (on MMR hover)**: Displays ratings from ELO modes only (modes with _elo suffix)
  - Includes: rm_1v1_elo, rm_2v2_elo, rm_3v3_elo, rm_4v4_elo
  - Shows per-mode ELO ratings separate from standard competitive rankings

**Implementation:**
- Created `rankUtils.ts` utility functions for rating-to-rank conversion and mode filtering
- Updated data extraction to use game-level rating/MMR instead of mode-specific rank_level
- Both tooltips appear instantly (delayDuration=0) for better UX

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool.

**UI Library**: shadcn/ui components built on Radix UI primitives, providing a comprehensive set of accessible, pre-styled components. The design follows a gaming-inspired aesthetic with dark mode as primary, featuring medieval theming balanced with modern data visualization.

**Styling**: 
- Tailwind CSS for utility-first styling
- Custom CSS variables for theming (defined in `client/src/index.css`)
- Design system inspired by gaming platforms (op.gg, AoE4World) with medieval elements
- Typography uses Inter for body text, Cinzel for headings (medieval serif), and JetBrains Mono for stats

**State Management**: 
- TanStack Query (React Query) for server state and API caching
- Local React state for UI interactions
- No global state management library needed due to simple data flow

**Routing**: Wouter for lightweight client-side routing with URL-based player selection:
- `/` - Home page with player search
- `/guides` - Redirects to `/guides/civilizations`
- `/guides/civilizations` - Browse all civilization guides with search functionality
- `/guides/maps` - Browse all map guides with search functionality
- `/{profileId}-{playerName}` - Automatically loads player data and displays guides (shareable URLs)
  - Format: `/11128754-Louis` where `11128754` is the profile ID and `Louis` is the player name
  - Profile ID ensures unique identification even when multiple players share the same name
  - URL is parsed to extract both profile ID and player name
  - Fallback support for legacy `/playerName` format
- When a player is selected, the URL updates to `/{profileId}-{playerName}` for easy sharing

**Auto-Update System**: Background polling feature for checking new games:
- **Toggle Button**: Icon button (RefreshCw) appears when a player is selected, allowing users to enable/disable auto-updates
- **Default State**: Disabled by default to avoid unnecessary API calls
- **Polling Interval**: Checks for new game data every 60 seconds when enabled
- **UX Design**: 
  - Uses "stale-while-revalidate" approach - main content stays visible during updates
  - Background updates use separate `isAutoUpdating` state to avoid full-page loading spinners
  - Button icon spins briefly during active updates for subtle visual feedback
  - Button variant changes to indicate enabled/disabled state (default when enabled, outline when disabled)
- **Implementation**: Uses React's `useEffect` with `setInterval` for timed polling, with proper cleanup on unmount or state changes

**Type Safety**: Full TypeScript coverage with shared types between client and server via the `/shared` directory.

### Backend Architecture

**Note**: This application is now a **static website** with **no backend server**.

**Current Architecture**:
- No backend code or dependencies - this is a pure client-side application
- Frontend makes API calls directly to AoE4World API via `fetch()`
- AoE4World API supports CORS, allowing direct browser requests
- Error handling and timeout logic (10 seconds) implemented in frontend
- Can be deployed to any static hosting service (no server runtime required)

**Data Flow**: 
1. User searches for player → Direct fetch to `https://aoe4world.com/api/v0/players/autocomplete`
2. User selects player → Direct fetch to `https://aoe4world.com/api/v0/players/{profileId}/games/last`
3. Client-side guide logic matches game data to pre-built strategy guides

### Data Storage

**Database**: None - this is a static website with no database.

**Data Storage**: All strategy guide content is stored as static markdown in `client/src/lib/guides.ts`. Dynamic player/game data comes from the AoE4World API at runtime.

**Rationale**: As a static website, there is no backend database. All guides are pre-written markdown content. Player match data is fetched directly from AoE4World API when needed.

**Schema**: Types defined in `shared/schema.ts` using Zod for runtime validation and type inference. These types match the AoE4World API responses for players, games, and civilization data.

### Guide System

**Architecture**: Static guide database stored in TypeScript objects within `client/src/lib/guides.ts`.

**Format**: All guides are written in **free-form markdown** for flexible, readable content that's easy to update and maintain.

**Structure**:
- `civilizationGuides` - Object mapping civilization keys to markdown guide content (key strengths, build orders, unique units & bonuses)
- `mapGuides` - Object mapping map names to markdown strategy content (map overview, key resources, strategic approach)
- **Display Options**:
  - **Player-based view** (`/` or `/{profileId}-{playerName}`): Layout adapts based on game mode:
    - **Team Games (1v1, 2v2, 3v3, 4v4)**: Three-column layout
      1. Left column: Player's team civilization guides
      2. Center column: Map guide
      3. Right column: Opponent team civilization guides
    - **FFA Games (Free-For-All)**: Grid layout optimized for 8+ players
      1. Map guide displayed at top (centered, max-width)
      2. All player civilization guides shown in responsive grid (1/2/3 columns)
      3. Searched player's card titled "Your Civilization", others show player names
  - **Guides browser** (`/guides`): Browse all guides independently without player search
    - Tab-based interface for civilizations and maps
    - Search functionality within each tab
    - Grid layout with responsive columns
    - Accessible via "Browse Guides" button in header

**Game Mode Detection**: FFA mode is automatically detected when `teams.length > 2` in the API response. FFA games have 8 teams with 1 player each, while team games have 2 teams with multiple players each.

**Rendering**: Guides are rendered using `react-markdown` with GitHub-flavored markdown support, styled to match the gaming theme with proper typography hierarchy.

**Rationale**: Static markdown guides provide:
- Fast load times (no database queries)
- Easy version control and updates
- Type safety with TypeScript
- Flexible content formatting
- Simple deployment (no database migration concerns)

Future enhancement could move guides to database for:
- Community contributions
- Dynamic updates without redeployment
- Personalization based on player MMR/rank
- A/B testing different guide strategies

### External Dependencies

**Third-Party APIs**:
- **AoE4World API** (`https://aoe4world.com/api/v0/`) - Primary data source for player profiles, match history, and game statistics. Free public API with no authentication required.

**UI Component Libraries**:
- **Radix UI** - Headless, accessible component primitives for dialogs, dropdowns, tooltips, etc.
- **shadcn/ui** - Pre-styled components built on Radix UI
- **Lucide React** - Icon library for consistent iconography

**Development Tools**:
- **Vite** - Fast development server and build tool
- **TypeScript** - Type safety across the stack
- **TanStack Query** - Server state management
- **Wouter** - Lightweight routing

**Styling**:
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Type-safe component variants
- **Google Fonts** - Inter, Cinzel, and JetBrains Mono

**Content Rendering**:
- **react-markdown** - Markdown rendering for guide content
- **remark-gfm** - GitHub-flavored markdown support

**Build & Deployment**:
- **Vite** - Production builds and static asset bundling
- **Replit plugins** - Development tooling for Replit environment
