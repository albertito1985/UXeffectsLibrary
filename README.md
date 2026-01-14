# UX Effects

A React and TypeScript library of web UX effects and interactive components built with Vite.

## Features

- 🎨 Reusable React components for common UX effects
- 📦 Distributed as an npm package
- 🔧 Built with React, TypeScript, and Vite
- 🎯 Tree-shakeable with ESM support
- 💅 CSS-in-JS and CSS Module support

## Installation

```bash
npm install ux-effects
# or
yarn add ux-effects
# or
pnpm add ux-effects
```

## Usage

```tsx
import { /* component name */ } from 'ux-effects'
import 'ux-effects/css'

function App() {
  return (
    <>
      {/* Use components here */}
    </>
  )
}
```
## zoom component
the zoom component is divided in sections in where each section = 100vh


## License

MIT
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
