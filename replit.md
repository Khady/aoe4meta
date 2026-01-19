# Age of Empires 4 Strategy Guide

## Overview

This web application provides personalized Age of Empires 4 strategy guides. Users search for their player name, and the app fetches their most recent game from the AoE4World API. It then displays tailored guides including: "Your Civilization," "Map," and "Opponent's Civilization." The guides are presented in free-form markdown, serving as a tactical learning tool to help players improve by understanding strategic nuances from their recent matches. The project aims to enhance the learning experience for AoE4 players, offering quick, relevant strategic insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with **React** and **TypeScript**, using **Vite** for development and building. **shadcn/ui** components, based on **Radix UI**, provide a gaming-inspired dark mode aesthetic with medieval theming. Styling is managed with **Tailwind CSS** and custom CSS variables. **TanStack Query** handles server state and API caching, while **Wouter** provides lightweight client-side routing. The application supports shareable URLs (`/{profileId}-{playerName}`) and includes an auto-update system that polls for new game data every 60 seconds. Full TypeScript coverage ensures type safety.

### Backend Architecture

The application is a **static website** with **no backend server**. The frontend directly calls the **AoE4World API** for all data, leveraging its CORS support. All error handling and timeout logic (10 seconds) are implemented client-side, allowing deployment to any static hosting service.

### Data Storage

There is no database. All strategy guide content is stored as static markdown files (`.md`) within the client-side `src/content/` directory. Player and game data are fetched dynamically from the AoE4World API. Zod is used for runtime validation and type inference of data matching AoE4World API responses.

### Guide System

Strategy guides are static markdown content. They are structured into `civilizationGuides` and `mapGuides`. The display layout adapts based on the game mode:
- **Team Games**: A three-column layout showing player's team civ guides, map guide, and opponent team civ guides.
- **FFA Games**: A grid layout optimized for multiple players, featuring the map guide at the top and individual player civ guides in a responsive grid.
Guides are rendered using `react-markdown` with GitHub-flavored markdown support.

## External Dependencies

### Third-Party APIs

- **AoE4World API** (`https://aoe4world.com/api/v0/`): The primary data source for player profiles, match history, and game statistics.

### UI Component Libraries

- **Radix UI**: Headless, accessible component primitives.
- **shadcn/ui**: Pre-styled components built on Radix UI.
- **Lucide React**: Icon library.

### Development Tools

- **Vite**: Fast development server and build tool.
- **TypeScript**: Language for type safety.
- **TanStack Query**: Server state management.
- **Wouter**: Lightweight routing library.

### Styling

- **Tailwind CSS**: Utility-first CSS framework.
- **class-variance-authority**: Type-safe component variants.
- **Google Fonts**: Inter, Cinzel, and JetBrains Mono for typography.

### Content Rendering

- **react-markdown**: For rendering markdown content.
- **remark-gfm**: GitHub-flavored markdown support.