# Quickstart Guide: Hierarchical Todo Management

**Feature**: 001-hierarchical-todos  
**Date**: 2026-02-16  
**Branch**: `001-hierarchical-todos`

## Prerequisites

Before starting development, ensure you have the following installed:

- **Node.js**: 20.x LTS or later ([download](https://nodejs.org/))
- **npm**: 10.x or later (included with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - styled-components

**Verify Installation**:
```bash
node --version  # Should show v20.x or higher
npm --version   # Should show 10.x or higher
```

## Project Setup

### 1. Initialize Project Structure

Create the backend and frontend directories:

```bash
# From repository root
mkdir -p backend/src backend/tests
mkdir -p frontend/src frontend/public
```

### 2. Backend Setup

#### Initialize Backend

```bash
cd backend

# Initialize package.json
npm init -y

# Install core dependencies
npm install express cors dotenv better-sqlite3

# Install TypeScript and types
npm install --save-dev typescript @types/node @types/express @types/better-sqlite3 @types/cors

# Install development tools
npm install --save-dev nodemon ts-node ts-node-dev

# Install testing frameworks
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

#### Configure TypeScript (backend/tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node", "jest"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### Configure Package Scripts (backend/package.json)

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

#### Create Environment File (backend/.env)

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_PATH=./data/todos.db

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

Copy to `.env.example` for version control (without sensitive values).

### 3. Frontend Setup

#### Initialize Frontend

```bash
cd ../frontend

# Initialize package.json
npm init -y

# Install React and core dependencies
npm install react react-dom

# Install TypeScript
npm install --save-dev typescript @types/react @types/react-dom

# Install state management
npm install @reduxjs/toolkit react-redux

# Install styling
npm install styled-components antd
npm install --save-dev @types/styled-components typescript-plugin-styled-components

# Install forms and validation
npm install react-hook-form zod @hookform/resolvers

# Install drag-and-drop
npm install react-beautiful-dnd
npm install --save-dev @types/react-beautiful-dnd

# Install PWA/offline support
npm install idb workbox-webpack-plugin

# Install Webpack and build tools
npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin
npm install --save-dev ts-loader style-loader css-loader

# Install testing frameworks
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev @types/jest ts-jest

# Install Storybook
npx storybook@latest init --type react

# Install linting and formatting
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-react
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev eslint-plugin-simple-import-sort

# Install commit linting
npm install --save-dev @commitlint/cli @commitlint/config-conventional husky
```

#### Configure TypeScript (frontend/tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "isolatedModules": true,
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@containers/*": ["containers/*"],
      "@hooks/*": ["hooks/*"],
      "@utils/*": ["utils/*"],
      "@api/*": ["api/*"],
      "@styles/*": ["styles/*"],
      "@assets/*": ["assets/*"],
      "@services/*": ["services/*"],
      "@types/*": ["types/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "build", "dist"]
}
```

#### Configure Webpack (frontend/webpack.config.js)

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: isDevelopment,
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@containers': path.resolve(__dirname, 'src/containers'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@types': path.resolve(__dirname, 'src/types'),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      !isDevelopment && new WorkboxWebpackPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
      }),
    ].filter(Boolean),
    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
  };
};
```

#### Configure Package Scripts (frontend/package.json)

```json
{
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\""
  }
}
```

#### Create Environment File (frontend/.env)

```env
REACT_APP_API_URL=/api
NODE_ENV=development
```

### 4. Linting and Formatting Setup

#### ESLint Configuration (frontend/.eslintrc.json)

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["react", "@typescript-eslint", "simple-import-sort"],
  "rules": {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

#### Prettier Configuration (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

#### Commitlint Configuration (commitlint.config.js)

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

## Development Workflow

### 1. Start Backend Server

```bash
cd backend
npm run dev
```

Backend listens on http://localhost:3001

### 2. Start Frontend Dev Server

```bash
cd frontend
npm start
```

Frontend available at http://localhost:3000 (proxies API to backend)

### 3. Run Tests

**Backend:**
```bash
cd backend
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

**Frontend:**
```bash
cd frontend
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

### 4. Run Storybook

```bash
cd frontend
npm run storybook
```

Storybook available at http://localhost:6006

### 5. Lint and Format

```bash
cd frontend
npm run lint         # Check linting
npm run lint:fix     # Fix linting issues
npm run format       # Format with Prettier
```

## Project Structure Reference

See [plan.md](./plan.md) for complete directory structure.

**Key Directories:**

```
backend/
├── src/
│   ├── db/           # Database setup and migrations
│   ├── models/       # Entity models
│   ├── services/     # Business logic
│   ├── api/          # Express routes and middleware
│   └── types/        # TypeScript types
└── tests/            # Backend tests

frontend/
├── src/
│   ├── components/   # Presentational components
│   ├── containers/   # Smart containers with Redux
│   ├── store/        # Redux slices and store
│   ├── api/          # API client functions
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions, validation
│   ├── styles/       # Theme, global styles
│   └── types/        # TypeScript types
└── public/           # Static assets, manifest
```

## First Implementation Steps

### Backend First Steps

1. **Database Setup** (`backend/src/db/database.ts`):
   - Initialize SQLite connection with better-sqlite3
   - Run schema migrations (create tables)
   - Setup indexes

2. **Models** (`backend/src/models/`):
   - TodoList model with CRUD operations
   - TodoElement model with CRUD operations
   - SubItem model with CRUD operations

3. **API Routes** (`backend/src/api/routes/`):
   - Implement list endpoints
   - Implement element endpoints
   - Implement sub-item endpoints

4. **Testing**:
   - Unit tests for models
   - Integration tests for API endpoints
   - Contract tests matching OpenAPI spec

### Frontend First Steps

1. **Redux Store** (`frontend/src/store/`):
   - Setup store configuration
   - Create slices for lists, elements, sub-items, offline queue
   - Define async thunks for API calls

2. **API Client** (`frontend/src/api/`):
   - Implement fetch wrapper with error handling
   - Create API functions for all endpoints
   - Add retry logic for offline support

3. **Core Components** (`frontend/src/components/`):
   - TodoListCard component with tests and stories
   - TodoElement component with tests and stories
   - SubItem component with tests and stories

4. **App Container** (`frontend/src/containers/App/`):
   - Setup Redux provider
   - Initialize app state (fetch lists on mount)
   - Handle online/offline status

## Common Development Tasks

### Add a New Component

1. Create component directory:
   ```bash
   mkdir -p frontend/src/components/MyComponent/{__tests__,__stories__}
   ```

2. Create files:
   - `MyComponent.tsx` - Component implementation
   - `MyComponent.styled.ts` - Styled components
   - `__tests__/MyComponent.test.tsx` - Jest tests
   - `__stories__/MyComponent.stories.tsx` - Storybook stories

3. Follow naming conventions:
   - Component: PascalCase (`MyComponent`)
   - Variables/functions: camelCase (`handleClick`)
   - Styled file: `MyComponent.styled.ts`

### Add a New API Endpoint

1. **Define in OpenAPI spec** (`specs/001-hierarchical-todos/contracts/api-spec.yaml`)

2. **Backend implementation**:
   - Add route handler in `backend/src/api/routes/`
   - Implement service function in `backend/src/services/`
   - Add validation middleware
   - Write tests

3. **Frontend implementation**:
   - Add API function in `frontend/src/api/`
   - Create async thunk in Redux slice
   - Connect to component/container
   - Add optimistic updates if appropriate

### Run Database Migrations

```bash
cd backend
npm run migrate  # Run pending migrations
npm run migrate:rollback  # Rollback last migration
```

### Generate Test Coverage Report

```bash
# Backend
cd backend
npm run test:coverage
open coverage/lcov-report/index.html

# Frontend
cd frontend
npm run test:coverage
open coverage/lcov-report/index.html
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9
```

### TypeScript Path Alias Not Resolving

- Verify `tsconfig.json` paths configuration
- Verify Webpack alias configuration matches
- Restart TypeScript server in VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

### Tests Failing with Module Import Errors

- Check `jest.config.js` has correct `moduleNameMapper` for path aliases
- Verify `ts-jest` preset configured
- Clear Jest cache: `npm test -- --clearCache`

### Styled Components Not Working

- Verify `typescript-plugin-styled-components` installed
- Check `ts-loader` options include plugin in Webpack config
- Restart dev server

## Next Steps

Once development environment is ready:

1. Review [data-model.md](./data-model.md) for entity definitions
2. Review [contracts/api-spec.yaml](./contracts/api-spec.yaml) for API specs
3. Review [research.md](./research.md) for technology decisions
4. **Generate tasks**: Run `/speckit.tasks` to break plan into implementation tasks
5. **Start implementing**: Follow task order in tasks.md

## Resources

- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [styled-components Documentation](https://styled-components.com/docs)
- [Ant Design Components](https://ant.design/components/overview/)
- [react-beautiful-dnd Documentation](https://github.com/atlassian/react-beautiful-dnd)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Storybook Documentation](https://storybook.js.org/docs)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Express Documentation](https://expressjs.com/)

## Support

For questions or issues during development:
- Refer to [constitution.md](../../.specify/memory/constitution.md) for architectural principles
- Check [spec.md](./spec.md) for functional requirements
- Review [plan.md](./plan.md) for technical decisions

Happy coding! 🚀
