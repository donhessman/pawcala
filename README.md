# Pawcala 🐾

A delightful Mancala game with adorable paw animations! Watch as cute dog and cat paws distribute stones across the board in this classic strategic board game. Awwwwwe!

**[Play now on pawcala.vercel.app →](https://pawcala.vercel.app/)**

## Features

- **Adorable Animations**: Real paw images (dog and cat) animate across the board as stones are distributed
- **Classic Mancala Gameplay**: Full implementation of traditional Mancala rules including captures and extra turns
- **Beautiful UI**: Built with Material-UI (MUI) and styled with Emotion for a polished, responsive design
- **Switchable Players**: Choose which player is the dog or cat
- **Game Notifications**: Visual feedback for captures and extra turns
- **Fully Tested**: Comprehensive test coverage with Vitest and React Testing Library

## Tech Stack

- **Framework**: [Next.js 15.5.6](https://nextjs.org) with App Router and Turbopack
- **Language**: TypeScript
- **UI Library**: [Material-UI v7](https://mui.com) (MUI)
- **Styling**: Emotion (CSS-in-JS)
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint with Prettier
- **Optimizations**: React Compiler enabled

## Getting Started

### Prerequisites

- Node.js (managed via nvm)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd pawcala

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play the game locally.

## Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Building
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm run test         # Run tests in watch mode
npm run test:ui      # Open Vitest UI
npm run test:run     # Run tests once (CI mode)
npm run test:coverage # Generate coverage report
```

## Game Rules

Pawcala follows traditional Mancala (Kalah) rules:

1. **Setup**: Each player has 6 pits with 4 stones each, plus a store on their right
2. **Gameplay**:
   - Pick up all stones from one of your pits
   - Distribute them counter-clockwise, one per pit
   - Skip your opponent's store
3. **Captures**: Landing in an empty pit on your side captures opposite stones
4. **Extra Turns**: Landing in your own store grants another turn
5. **Winning**: Game ends when one side is empty; player with most stones wins

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with theme
│   ├── page.tsx           # Main game page
│   ├── icon.tsx           # Favicon (paw icon)
│   └── apple-icon.tsx     # Apple touch icon
├── components/
│   ├── ThemeRegistry/     # MUI theme setup
│   └── game/              # Game components
│       ├── GameControls/  # Reset and switch buttons
│       ├── MancalaBoard/  # Game board layout
│       ├── PawAnimation/  # Paw animation component
│       └── Pit/           # Individual pit component
├── hooks/
│   └── useGameState.ts    # Game state management
├── types/
│   └── game.ts            # TypeScript type definitions
└── utils/
    └── gameLogic.ts       # Game rules and logic
```

## Architecture Highlights

### Component Pattern

- **Const arrow functions**: All components use const arrow function syntax
- **Styled components**: Separation of concerns with `styles.ts` files
- **Component folders**: Each component in its own folder with `index.tsx` and `styles.ts`

### State Management

- Custom `useGameState` hook manages all game logic
- Animation state synchronized with game state
- Optimized with `useCallback` for performance

### Animation System

- Smooth paw animations using CSS transitions
- Coordinated timing between UI updates and animations
- Dynamic paw selection based on player position

### Code Quality

- ESLint with React Hooks Extra plugin
- Prettier for consistent formatting
- TypeScript for type safety
- 33 passing tests with >90% coverage

## Deployment

This project is deployed on [Vercel](https://vercel.com):

**Live Demo**: [https://pawcala.vercel.app/](https://pawcala.vercel.app/)

To deploy your own instance:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Development Notes

### React Compiler

The project uses the React Compiler experimental feature. Some components (like `PawAnimation`) opt out of certain rules where synchronous state updates in effects are necessary for animation coordination.

### Testing

Tests cover both utility functions and React components:

- Game logic (utils/gameLogic.test.ts)
- Component behavior (components/game/Pit/Pit.test.tsx)

Run tests with:

```bash
npm run test:ui  # Interactive UI
npm run test:coverage  # With coverage
```

### CI/CD

GitHub Actions workflow runs on all pull requests to `main`:

- **Tests**: Runs full test suite
- **Linting**: Checks code style with ESLint
- **Formatting**: Validates Prettier formatting
- **Build**: Verifies production build succeeds

See [`.github/workflows/pr-checks.yml`](.github/workflows/pr-checks.yml) for details.

## Contributing

This is a personal project, but feel free to fork and modify for your own use!

## License

MIT

---

Built with ❤️ and 🐾 by [Your Name]
