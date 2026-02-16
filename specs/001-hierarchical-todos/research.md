# Research: Hierarchical Todo Management

**Feature**: 001-hierarchical-todos  
**Date**: 2026-02-16  
**Phase**: 0 - Research & Technology Decisions

## Overview

This document captures technology choices, best practices research, and architectural decisions for the hierarchical todo management application. All NEEDS CLARIFICATION items from Technical Context have been resolved.

## Technology Decisions

### Frontend Framework: React 19.x with TypeScript

**Decision**: Use React 19 with TypeScript strict mode

**Rationale**:
- Constitution mandates React + TypeScript (Principle V)
- React 19 provides improved compiler optimizations and performance (React Compiler)
- Enhanced concurrent features for better UX (improved Suspense, transitions, Actions)
- TypeScript strict mode catches errors at compile time
- Large ecosystem with mature React 19 support (Redux Toolkit, styled-components)
- Excellent PWA support through custom Webpack config

**Alternatives Considered**:
- Vue 3 + TypeScript: Rejected - Constitution specifies React
- Next.js: Rejected - Adds unnecessary routing complexity for SPA requirement
- Vite instead of Webpack: Considered but Webpack specified in constitution

### State Management: Redux Toolkit

**Decision**: Redux Toolkit with no persistence (ephemeral state)

**Rationale**:
- Constitution mandates Redux Toolkit (Principle III)
- Modern Redux with reduced boilerplate (createSlice, createAsyncThunk)
- Immutable state updates via Immer
- DevTools integration for debugging
- No persistence to localStorage per constitution (API is source of truth)
- Separate offline queue slice for pending operations

**Alternatives Considered**:
- Zustand: Rejected - Constitution specifies Redux Toolkit
- React Context API: Rejected - Insufficient for complex state management
- Redux with persistence: Rejected - Violates Constitution Principle III

### Styling: styled-components + Ant Design

**Decision**: styled-components for custom styling, Ant Design for component library

**Rationale**:
- Constitution mandates both styled-components and Ant Design
- styled-components provides CSS-in-JS with TypeScript support
- typescript-plugin-styled-components improves DX
- Ant Design provides accessible, production-ready components
- Custom styled components for todo-specific UI
- Ant Design for modals, form inputs, buttons, layout primitives

**Alternatives Considered**:
- Material-UI: Rejected - Constitution specifies Ant Design
- Tailwind CSS: Rejected - Constitution specifies styled-components
- CSS Modules: Rejected - Constitution specifies styled-components

### Backend Framework: Express.js + TypeScript

**Decision**: Express.js with TypeScript for REST API

**Rationale**:
- Most popular Node.js web framework (mature, stable, extensive middleware)
- Simple, unopinionated structure fits single-user app requirements
- Excellent TypeScript support via @types/express
- Easy integration with SQLite via better-sqlite3
- Minimal overhead for small-scale application
- Built-in middleware ecosystem (cors, body-parser, etc.)

**Alternatives Considered**:
- Fastify: Rejected - Overkill for small-scale, single-user app
- NestJS: Rejected - Too heavyweight, enforces patterns unnecessary for simple CRUD
- Koa: Rejected - Less mature ecosystem than Express
- Raw Node.js http: Rejected - Too low-level, reinventing middleware

### Database: SQLite with better-sqlite3

**Decision**: SQLite file-based database with better-sqlite3 driver

**Rationale**:
- Clarification session chose SQLite (zero config, single-user optimized)
- better-sqlite3 is faster than node-sqlite3 (synchronous API, native bindings)
- No separate database server required
- Perfect for single-user, local deployment
- ACID compliance ensures data integrity
- Foreign key constraints support hierarchical relationships
- Simple backup (copy .db file)

**Alternatives Considered**:
- PostgreSQL: Rejected - Overkill for single-user, adds deployment complexity
- MongoDB: Rejected - Relational structure better fits hierarchical data with constraints
- node-sqlite3: Rejected - Slower than better-sqlite3, async API adds complexity

### Drag-and-Drop: react-beautiful-dnd or react-dnd

**Decision**: react-beautiful-dnd for drag-and-drop interactions

**Rationale**:
- Beautiful, accessible drag-and-drop out of the box
- Mobile touch support built-in
- Smooth animations and visual feedback
- Handles reordering lists automatically
- Accessibility compliant (keyboard navigation)
- Smaller learning curve than react-dnd

**Alternatives Considered**:
- react-dnd: Rejected - More complex API, requires more boilerplate
- Native HTML5 Drag API: Rejected - Poor mobile support, requires significant custom code
- sortablejs: Rejected - Not React-specific, manual React integration needed
- dnd-kit: Considered alternative, but react-beautiful-dnd more mature

### Offline Support: Service Worker + IndexedDB

**Decision**: Service Worker for caching, IndexedDB for offline queue via idb library

**Rationale**:
- Service Worker required for PWA capabilities (constitution Principle II)
- Workbox library simplifies service worker setup (caching strategies, precaching)
- IndexedDB for persistent offline operation queue (constitutional exception for sync queue)
- idb library provides Promise-based IndexedDB API
- Queue stores operations (create, update, delete) to replay on reconnection
- Service worker caches app bundle and static assets

**Alternatives Considered**:
- localStorage for queue: Rejected - 5-10MB limits, synchronous API blocks UI
- sessionStorage: Rejected - Cleared on tab close, insufficient for offline persistence
- WebSQL: Rejected - Deprecated standard
- Manual service worker: Rejected - Workbox provides battle-tested patterns

### Form Management: react-hook-form + Zod

**Decision**: react-hook-form for form state, Zod for validation schemas

**Rationale**:
- Constitution mandates both libraries
- react-hook-form minimizes re-renders (uncontrolled components)
- Zod provides TypeScript-first schema validation
- Type inference from Zod schemas ensures type safety
- Validation messages from Zod schemas
- Integrates via @hookform/resolvers/zod

**Alternatives Considered**:
- Formik: Rejected - Constitution specifies react-hook-form
- Yup validation: Rejected - Constitution specifies Zod
- Manual form state: Rejected - Error-prone, boilerplate-heavy

## Best Practices Research

### Component Architecture

**Pattern**: Dumb Components + Smart Containers

**Implementation**:
- **Components** (`src/components/`): Presentational, receive data via props, no business logic
  - TodoListCard: Display list with name, element count, drag handle
  - TodoElement: Display element with completion checkbox, text, progress, expand/collapse
  - SubItem: Display sub-item with completion checkbox, text
  - Shared components: Button, Input, Card, Modal from Ant Design + custom styled wrappers

- **Containers** (`src/containers/`): Connect to Redux, handle events, business logic
  - TodoListContainer: Fetch lists, handle CRUD, orchestrate drag-drop
  - TodoElementContainer: Manage elements, sub-items, completion cascading
  - App: Root container, initialize store, handle online/offline status

**Benefits**:
- Testable components in isolation (stories, unit tests)
- Reusable presentational layer
- Clear separation of concerns per Constitution Principle V

### Testing Strategy

**Approach**: Unit → Integration → E2E (80% coverage minimum)

**Unit Tests** (Jest + React Testing Library):
- Component rendering, props, user interactions
- Redux slice reducers, action creators
- Utility functions, validation schemas
- Co-located in `__tests__/` directories

**Integration Tests**:
- API endpoint tests (request/response contracts)
- Redux store integration (actions → state updates)
- Service integration (offline queue, sync service)

**E2E Tests** (optional, beyond MVP):
- Full user scenarios (create list → add element → add sub-item → complete)
- Cross-browser testing (Chrome, Firefox, Safari)

**Coverage Tools**:
- Jest coverage reporter (--coverage flag)
- Codecov or Coveralls for CI integration
- Storybook for visual regression testing

### API Design Patterns

**Pattern**: RESTful CRUD with resource nesting

**Endpoints**:
```
GET    /api/lists                    # Get all lists
POST   /api/lists                    # Create list
GET    /api/lists/:listId            # Get single list
PUT    /api/lists/:listId            # Update list
DELETE /api/lists/:listId            # Delete list
PUT    /api/lists/reorder            # Reorder lists

GET    /api/lists/:listId/elements              # Get elements for list
POST   /api/lists/:listId/elements              # Create element
PUT    /api/elements/:elementId                 # Update element
DELETE /api/elements/:elementId                 # Delete element
PUT    /api/elements/:elementId/complete        # Toggle completion
PUT    /api/lists/:listId/elements/reorder      # Reorder elements
PUT    /api/elements/:elementId/move            # Move element to different list

GET    /api/elements/:elementId/sub-items       # Get sub-items for element
POST   /api/elements/:elementId/sub-items       # Create sub-item
PUT    /api/sub-items/:subItemId                # Update sub-item
DELETE /api/sub-items/:subItemId                # Delete sub-item
PUT    /api/sub-items/:subItemId/complete       # Toggle sub-item completion
PUT    /api/elements/:elementId/sub-items/reorder # Reorder sub-items
```

**Benefits**:
- Clean resource hierarchy matches data model
- RESTful conventions (GET, POST, PUT, DELETE)
- Specific endpoints for completion and reordering operations
- Easy to document via OpenAPI spec

### Database Schema Design

**Pattern**: Relational with foreign keys and cascading deletes

**Tables**:
- `lists`: id, name, display_order, created_at
- `elements`: id, list_id, text, is_completed, display_order, created_at
- `sub_items`: id, element_id, text, is_completed, display_order, created_at

**Foreign Keys**:
- elements.list_id → lists.id (CASCADE DELETE)
- sub_items.element_id → elements.id (CASCADE DELETE)

**Indexes**:
- lists: PRIMARY KEY(id), INDEX(display_order)
- elements: PRIMARY KEY(id), INDEX(list_id, display_order)
- sub_items: PRIMARY KEY(id), INDEX(element_id, display_order)

**Benefits**:
- Referential integrity enforced by database
- Cascading deletes simplify deletion logic
- display_order column enables custom sorting
- Indexes optimize common queries (get elements by list, get sub-items by element)

### Offline-First Architecture

**Pattern**: Optimistic UI + Operation Queue + Background Sync

**Flow**:
1. User performs action (e.g., mark element complete)
2. UI updates immediately (optimistic)
3. Action added to offline queue (IndexedDB)
4. If online: Send to API, remove from queue on success
5. If offline: Keep in queue, show pending indicator
6. On reconnection: Process queue in order, handle conflicts (last-write-wins)

**Implementation**:
- Service worker intercepts failed requests, caches successful responses
- Redux `offlineSlice` tracks pending operations
- `syncService` monitors online/offline status (navigator.onLine + fetch timeout)
- Background sync API for reliable queue processing (if available)

**Benefits**:
- Seamless offline experience
- No data loss during network issues
- Predictable conflict resolution
- Constitutional compliance (offline queue as only persistent data)

## Performance Optimizations

### Frontend

- **Code Splitting**: Lazy load non-critical components (React.lazy + Suspense)
- **Memoization**: Use React.memo for expensive components, useMemo for calculations
- **Virtual Scrolling**: If lists exceed 100+ items, implement virtual scrolling (react-window)
- **Bundle Optimization**: Webpack tree-shaking, minification, gzip compression
- **Image Optimization**: Use SVG for icons, optimize bitmap images
- **Service Worker Caching**: Precache app shell, runtime cache API responses

### Backend

- **Database Indexes**: Index foreign keys, display_order columns
- **Connection Pooling**: Not needed for SQLite (single connection)
- **Query Optimization**: Use prepared statements, avoid N+1 queries
- **Response Compression**: gzip middleware for API responses
- **Caching**: Cache list counts, progress calculations in memory if needed

## Security Considerations

**Note**: Single-user app, no authentication required per Constitution Principle I

**Input Validation**:
- Validate all inputs on backend (Zod schemas)
- Sanitize text inputs to prevent XSS (though React escapes by default)
- Enforce length limits (500 chars), count limits (20/100 items)

**CORS**:
- Configure CORS for same domain (dev proxy in Webpack, production same origin)
- No third-party API calls required

**Service Worker**:
- Scope service worker to app root only
- Cache same-origin responses only
- Validate cache integrity on updates

## Deployment Considerations

**Development**:
- Frontend: Webpack dev server with hot reload, proxy to backend (port 3000 → 3001)
- Backend: nodemon for auto-restart on changes
- Database: SQLite file in backend/data/todos.db

**Production**:
- Frontend: Static build (npm run build), serve via nginx or Express static
- Backend: PM2 or systemd for process management
- Database: SQLite file with regular backups (cron job to copy .db file)
- PWA: Serve over HTTPS for service worker, generate PWA assets (icons, manifest)

**Environment Variables**:
- Frontend: `REACT_APP_API_URL` (proxy in dev, same origin in prod)
- Backend: `PORT`, `DB_PATH`, `NODE_ENV`

## Dependencies Summary

### Frontend

**Core**:
- react, react-dom (18.x)
- typescript (5.x)
- webpack, webpack-cli, webpack-dev-server (5.x)
- ts-loader, typescript-plugin-styled-components

**State & Data**:
- @reduxjs/toolkit, react-redux
- @hookform/resolvers, react-hook-form, zod

**UI & Styling**:
- styled-components, antd
- react-beautiful-dnd

**PWA & Offline**:
- workbox-webpack-plugin
- idb (IndexedDB wrapper)

**Testing**:
- jest, @testing-library/react, @testing-library/jest-dom
- @storybook/react, @storybook/addon-*

**Linting & Formatting**:
- eslint, prettier, @commitlint/*, eslint-plugin-simple-import-sort

### Backend

**Core**:
- express, cors, dotenv
- typescript, ts-node, @types/express, @types/node

**Database**:
- better-sqlite3, @types/better-sqlite3

**Testing**:
- jest, @types/jest, supertest

**Development**:
- nodemon, ts-node-dev

## Open Questions / Decisions Deferred

**None** - All NEEDS CLARIFICATION items resolved through:
- Constitution requirements
- Spec clarifications (session 2026-02-16)
- Best practice research

**Next Steps**: Proceed to Phase 1 (data-model.md, contracts/, quickstart.md)
