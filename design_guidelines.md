# Age of Empires 4 Strategy Guide - Design Guidelines

## Design Approach

**Reference-Based with Gaming Focus**: Drawing inspiration from gaming strategy platforms (op.gg, AoE4World, dotabuff) combined with medieval/strategy game aesthetics. The design balances information density with visual appeal for gamers seeking quick, actionable strategy insights.

**Core Principle**: Create a tactical command center interface - professional, data-rich, and efficient, with subtle medieval theming that honors the Age of Empires franchise without overwhelming the utility focus.

---

## Color Palette

**Dark Mode Primary** (Gaming-optimized):
- Background Base: 220 15% 8% (Deep charcoal)
- Surface Elevated: 220 12% 12% (Card backgrounds)
- Surface Interactive: 220 10% 16% (Hover states)

**Accent Colors**:
- Primary Gold: 45 95% 55% (Medieval gold for CTAs and highlights)
- Info Blue: 210 85% 58% (Game data, stats)
- Success Green: 142 70% 48% (Win indicators)
- Danger Red: 0 72% 55% (Loss indicators)

**Text Hierarchy**:
- Primary Text: 220 8% 95%
- Secondary Text: 220 8% 70%
- Muted Text: 220 8% 50%

---

## Typography

**Font Families**:
- Primary: 'Inter' (Google Fonts) - Clean, readable for data display
- Headings: 'Cinzel' (Google Fonts) - Medieval serif for section titles, used sparingly
- Monospace: 'JetBrains Mono' for stats and numbers

**Scale**:
- Hero Title: text-4xl/5xl font-bold (Cinzel)
- Section Headers: text-2xl/3xl font-semibold (Cinzel)
- Card Titles: text-lg/xl font-medium (Inter)
- Body Text: text-sm/base (Inter)
- Stats/Numbers: text-base font-mono

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, and 12 for consistent rhythm
- Container: max-w-7xl mx-auto
- Section Padding: py-12 to py-16
- Card Padding: p-6 to p-8
- Element Gaps: gap-4, gap-6, gap-8

**Grid Structure**:
- Three-column guide layout: grid grid-cols-1 lg:grid-cols-3 gap-6
- Responsive collapse to single column on mobile
- Sticky search/input section at top

---

## Component Library

### Navigation & Header
- Compact top bar with app branding (AoE4 themed logo/text)
- Player search prominently displayed in header with autocomplete dropdown
- Subtle medieval border accent (1px gold) on bottom edge

### Search Input Component
- Large, prominent search field with icon (shield/sword motif)
- Autocomplete dropdown with player avatars, ratings, and rank badges
- Loading state with subtle pulse animation
- Recent searches or example usernames as placeholder


### Strategy Guide Cards (3-column layout)
**Player Civilization Guide**:
- Civilization banner header with icon
- Key strengths bullet points
- Recommended build order timeline
- Unique units/bonuses section

**Map Guide**:
- Map thumbnail at top
- Terrain type (Land/Hybrid/Water) badge
- Resource locations
- Strategic points of interest
- Common strategies for this map

**Opponent Civilization Guides** (Team/FFA):
- Multiple civilization guides for opponent team members
- Each displays player name, rank, MMR, and civilization info
- Comprehensive guide content for each opponent's civilization
- Links to AoE4World profiles and civilization-specific guides

### Visual Elements
- Civilization icons as circular avatars with gold ring borders
- Map thumbnails with dark overlay for text readability
- Rank badges/shields from AoE4 (Bronze/Silver/Gold/Platinum/Diamond/Conqueror)
- Subtle parchment/paper texture on guide cards
- Medieval corner decorations on card borders (optional flourish)

### Data Display
- Stats in bordered boxes with icon labels
- Color-coded win/loss records (green/red)
- Progress bars for matchup advantages
- Tooltip icons for additional information

---

## Images

**Hero Section**: 
- Full-width medieval battle scene or AoE4 game screenshot (1920x600px)
- Dark gradient overlay (bottom to top, 80% opacity)
- Centered search input overlaid on hero image
- Text: "Discover Your Strategy" or "Battle-Tested Guides for Every Match"

**Civilization Icons**: 
- Use official AoE4 civilization emblems from AoE4World CDN
- Display at 64x64 for main cards, 32x32 for compact views

**Map Thumbnails**:
- Fetch from AoE4World assets (example: dry_arabia.png)
- Display at 300x200 in map guide card header
- Use as background with dark overlay for guide content

**Rank Badges**:
- Include visual rank indicators (Bronze through Conqueror shields)
- Source from AoE4World or create simple colored shield SVGs

---

## Interactive States

- **Hover**: Subtle lift (shadow-lg) and brightness increase (brightness-105)
- **Active**: Slight scale down (scale-98)
- **Loading**: Skeleton screens with pulse animation for guide cards
- **Error**: Red border with error message, retry button
- **Empty State**: Friendly message with example username suggestions

---

## Accessibility & UX

- High contrast text on all backgrounds (WCAG AA minimum)
- Keyboard navigation support for search autocomplete
- Clear loading indicators during API calls
- Error handling with helpful messages
- Responsive breakpoints: mobile (base), tablet (md:768px), desktop (lg:1024px)
- Quick reference icons with tooltips for game terminology

---

## Special Considerations

- **Shareable URLs**: Player searches update URL to `/{profileId}-{playerName}` for easy sharing
- **Deep Links**: Civilization and map guides support anchor links (e.g., `/guides/civilizations#english`)
- **External Links**: Links to AoE4World for player profiles and civilization details
- **Auto-Update Feature**: Optional background polling for new game data (60-second intervals)
- **Responsive Layouts**: Three-column for team games, grid layout for FFA games with 8+ players
- **SEO Optimization**: Unique titles and meta descriptions for each page