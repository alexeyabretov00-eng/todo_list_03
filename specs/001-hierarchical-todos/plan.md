# Implementation Plan: Hierarchical Todo Management

**Branch**: `001-hierarchical-todos` | **Date**: 2026-02-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-hierarchical-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a hierarchical todo management application with 3-level organization (Lists → Elements → Sub-items). Single-user Progressive Web App with cross-platform responsive design (desktop + mobile). Full offline support with automatic sync. Tech stack: React + TypeScript + Redux Toolkit frontend, Node.js + SQLite backend, REST API. Constitution mandates: API-driven state (no localStorage), 80% test coverage, component isolation, drag-and-drop interactions, PWA capabilities.

## Technical Context

**Language/Version**: 
- **Frontend**: TypeScript 5.x (strict mode), React 19.x
- **Backend**: Node.js 20.x LTS, TypeScript 5.x

**Primary Dependencies**:
- **Frontend**: React, Redux Toolkit, styled-components, Ant Design, react-hook-form, Zod, Webpack 5
- **Backend**: Express.js, better-sqlite3, cors, dotenv
- **Testing**: Jest, React Testing Library, Storybook
- **Tools**: ESLint, Prettier, eslint-plugin-simple-import-sort, commitlint

**Storage**: SQLite (file-based database, zero configuration, single-user optimized)

**Testing**: Jest (≥80% coverage requirement), co-located tests (`__tests__/`) and stories (`__stories__/`)

**Target Platform**: Web browsers (Chrome, Firefox, Safari desktop + iOS Safari, Android Chrome mobile), PWA-enabled

**Project Type**: Web application (frontend + backend structure)

**Performance Goals**:
- Initial load: <2 seconds on broadband
- UI response: <100ms (optimistic updates)
- Offline sync: <5 seconds after reconnection
- Touch targets: ≥44x44 CSS pixels (mobile accessibility)

**Constraints**:
- Single-user architecture (no authentication)
- API-driven state management (no localStorage except offline queue)
- Offline-capable (service worker + sync queue)
- Drag-and-drop for all reorder/move operations
- Scale limits: Max 20 lists, 100 elements/list, 20 sub-items/element

**Scale/Scope**:
- Single user, local deployment
- Max 20 lists × 100 elements × 20 sub-items = 40,000 max items
- PWA with service worker for offline support
- Responsive UI (320px mobile → 4K desktop)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Single-User Architecture
✅ **PASS** - No authentication, no user management, single-user context throughout

### Principle II: Cross-Platform Responsive Design
✅ **PASS** - PWA with responsive layout, desktop + mobile optimized, service worker for offline

### Principle III: API-Driven State Management (NON-NEGOTIABLE)
✅ **PASS** - Redux without persistence, all data from REST API on load, offline queue only persistent data

### Principle IV: Test-First Quality (NON-NEGOTIABLE)  
✅ **PASS** - Jest with 80% coverage requirement, co-located tests and stories

### Principle V: Component Isolation & Type Safety
✅ **PASS** - Presentational components + containers, TypeScript strict mode, styled-components separation, Zod validation

### Technical Stack Compliance
✅ **PASS** - All required technologies specified: React, TypeScript, Webpack, Redux Toolkit, styled-components, Ant Design, Zod, react-hook-form, Jest, Storybook, ESLint, Prettier, commitlint, Node.js, SQLite

### Code Organization Compliance
✅ **PASS** - Component structure with `[Name].tsx` + `[Name].styled.ts`, co-located tests and stories

### Naming Conventions Compliance
✅ **PASS** - PascalCase components, camelCase variables/functions, path aliases configured

### Module Resolution Compliance
✅ **PASS** - Path aliases planned: `@components`, `@hooks`, `@utils`, `@api`, `@styles`, `@assets`, `@services`, `@types` (no trailing `/`)*

**GATE STATUS**: ✅ **ALL GATES PASSED** - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-hierarchical-todos/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── api-spec.yaml    # OpenAPI 3.0 specification
│   └── README.md        # API documentation
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── db/
│   │   ├── database.ts          # SQLite connection and initialization
│   │   ├── migrations.ts        # Database schema migrations
│   │   └── schema.sql           # SQL schema definitions
│   ├── models/
│   │   ├── TodoList.ts          # List entity model
│   │   ├── TodoElement.ts       # Element entity model
│   │   └── SubItem.ts           # Sub-item entity model
│   ├── services/
│   │   ├── listService.ts       # List CRUD operations
│   │   ├── elementService.ts    # Element CRUD operations
│   │   └── subItemService.ts    # Sub-item CRUD operations
│   ├── api/
│   │   ├── routes/
│   │   │   ├── lists.ts         # List endpoints
│   │   │   ├── elements.ts      # Element endpoints
│   │   │   └── subItems.ts      # Sub-item endpoints
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts  # Global error handling
│   │   │   └── validator.ts     # Request validation middleware
│   │   └── app.ts               # Express app configuration
│   ├── types/
│   │   └── index.ts             # Shared TypeScript types
│   └── server.ts                # Entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── contract/
├── .env.example                # Environment variables template
├── package.json
├── tsconfig.json
└── jest.config.js

frontend/
├── src/
│   ├── components/
│   │   ├── TodoListCard/
│   │   │   ├── TodoListCard.tsx
│   │   │   ├── TodoListCard.styled.ts
│   │   │   ├── __tests__/
│   │   │   │   └── TodoListCard.test.tsx
│   │   │   └── __stories__/
│   │   │       └── TodoListCard.stories.tsx
│   │   ├── TodoElement/
│   │   │   ├── TodoElement.tsx
│   │   │   ├── TodoElement.styled.ts
│   │   │   ├── __tests__/
│   │   │   └── __stories__/
│   │   ├── SubItem/
│   │   │   ├── SubItem.tsx
│   │   │   ├── SubItem.styled.ts
│   │   │   ├── __tests__/
│   │   │   └── __stories__/
│   │   └── shared/              # Shared UI components (Button, Input, etc.)
│   ├── containers/
│   │   ├── TodoListContainer/
│   │   │   └── TodoListContainer.tsx
│   │   ├── TodoElementContainer/
│   │   │   └── TodoElementContainer.tsx
│   │   └── App/
│   │       └── App.tsx          # Root container
│   ├── store/
│   │   ├── slices/
│   │   │   ├── listsSlice.ts    # Redux slice for lists
│   │   │   ├── elementsSlice.ts # Redux slice for elements
│   │   │   ├── subItemsSlice.ts # Redux slice for sub-items
│   │   │   └── offlineSlice.ts  # Redux slice for offline queue
│   │   ├── store.ts             # Redux store configuration
│   │   └── hooks.ts             # Typed useDispatch/useSelector hooks
│   ├── api/
│   │   ├── client.ts            # Fetch API wrapper
│   │   ├── listsApi.ts          # List API calls
│   │   ├── elementsApi.ts       # Element API calls
│   │   └── subItemsApi.ts       # Sub-item API calls
│   ├── services/
│   │   ├── offlineQueue.ts      # Offline operation queue manager
│   │   └── syncService.ts       # Online/offline sync coordinator
│   ├── hooks/
│   │   ├── useDragAndDrop.ts    # Drag-and-drop logic
│   │   ├── useOfflineStatus.ts  # Network status detection
│   │   └── useTodoOperations.ts # Todo CRUD operations
│   ├── utils/
│   │   ├── validation.ts        # Zod schemas
│   │   └── constants.ts         # App constants (max limits, etc.)
│   ├── styles/
│   │   ├── theme.ts             # Styled-components theme
│   │   └── globalStyles.ts      # Global styles
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── assets/
│   │   └── icons/               # SVG icons, images
│   ├── service-worker.ts        # PWA service worker
│   └── index.tsx                # Entry point
├── public/
│   ├── manifest.json            # PWA manifest
│   ├── index.html
│   └── icons/                   # PWA icons (various sizes)
├── tests/
│   ├── integration/
│   └── e2e/
├── .env.example
├── package.json
├── tsconfig.json
├── webpack.config.js
├── jest.config.js
└── .storybook/
    ├── main.js
    └── preview.js
```

**Structure Decision**: Web application structure (Option 2) selected because:
- Clear separation between frontend (React SPA) and backend (Node.js REST API)
- Constitution mandates API-driven architecture (Principle III)
- PWA requires dedicated frontend build process (Webpack, service worker)
- Backend serves as REST API layer over SQLite
- Enables independent development and testing of frontend/backend
- Aligns with single-page application requirements (no routing)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations - Constitution Check passed all gates. No additional complexity justification required.
