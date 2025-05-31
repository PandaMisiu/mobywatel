# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and ESLint/Prettier configuration.

## Development Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and fix auto-fixable issues
- `npm run lint:check` - Run ESLint with zero warnings tolerance
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted correctly
- `npm run format:all` - Format all files in the project
- `npm run check` - Run both linting and format checks
- `npm run fix` - Run both ESLint fix and Prettier formatting

## Code Quality

This project uses ESLint and Prettier for code quality and formatting:

### ESLint Configuration
- TypeScript-specific rules for better type safety
- React hooks rules for proper React development
- Code quality rules to catch common issues
- Integration with Prettier for consistent formatting

### Prettier Configuration
- Single quotes for strings
- Semicolons enabled
- 2-space indentation
- 80-character line length
- Trailing commas where valid in ES5

### VS Code Integration
The project includes VS Code settings for:
- Auto-formatting on save
- ESLint auto-fix on save
- Proper file associations for TypeScript/React files

## Recommended VS Code Extensions
- ESLint
- Prettier - Code formatter
- TypeScript and JavaScript Language Features
- Auto Rename Tag
- Path Intellisense

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
