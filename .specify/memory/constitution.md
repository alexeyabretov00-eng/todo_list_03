<!--
Sync Impact Report - Version 1.1.0 (React 19 Upgrade)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Version Change: 1.0.0 → 1.1.0
Type: Minor Amendment (Technology Stack Update)

Changes in v1.1.0:
  ✓ Updated Frontend Framework: React 18.x → React 19.x
  ✓ Rationale: React 19 compiler optimizations, improved concurrent features
  ✓ Ecosystem verified: Redux Toolkit, styled-components, testing libraries compatible

Principles Unchanged:
  ✓ I. Single-User Architecture
  ✓ II. Cross-Platform Responsive Design
  ✓ III. API-Driven State Management (NON-NEGOTIABLE)
  ✓ IV. Test-First Quality (NON-NEGOTIABLE)
  ✓ V. Component Isolation & Type Safety

Related Document Updates:
  ✓ plan.md - Language/Version updated to React 19.x
  ✓ research.md - Frontend Framework decision updated with React 19 rationale
  ✓ quickstart.md - React 19 installation instructions
  ✓ tasks.md - T003 updated to initialize React 19

Impact Analysis:
  ✓ Breaking Changes: None (React 19 maintains backward compatibility for our use cases)
  ✓ Dependency Updates: All specified libraries support React 19
  ✓ Migration Path: Install react@19 react-dom@19 instead of latest

Commit Message:
  docs: amend constitution v1.1.0 (upgrade to React 19.x)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-->

# Todo List Constitution

## Core Principles

### I. Single-User Architecture
The application is designed for a single user without authentication requirements. All functionality assumes single-user context: no user management, no access control, no multi-tenancy concerns. This simplifies architecture but MUST NOT compromise data integrity or future extensibility should multi-user support be required.

**Rationale**: Reduces complexity, eliminates authentication overhead, enables rapid development and deployment.

### II. Cross-Platform Responsive Design
The application MUST provide seamless experience across desktop and mobile devices through responsive layout. UI components MUST adapt to viewport dimensions, touch vs. mouse interactions, and varying screen densities. Progressive Web App (PWA) capabilities are mandatory for offline support and app-like experience on mobile.

**Rationale**: Single codebase serves all platforms, maximizing reach while minimizing maintenance burden.

### III. API-Driven State Management (NON-NEGOTIABLE)
All primary application data (lists, items, UI state) MUST be fetched from the REST API on load. Local persistence is FORBIDDEN except for the offline sync queue containing pending operations to retry when connectivity is restored. Redux store MUST NOT persist to localStorage. State is ephemeral; API is the single source of truth.

**Rationale**: Ensures data consistency, simplifies state management, enables server-side business logic and future multi-client support.

### IV. Test-First Quality (NON-NEGOTIABLE)
Minimum 80% code coverage is mandatory using Jest. Tests MUST be co-located with artifacts (e.g., `components/Button/__tests__/Button.test.tsx`). Storybook stories MUST be co-located similarly (`components/Button/__stories__/Button.stories.tsx`). Test-driven development approach preferred: Write failing tests, implement to pass, refactor.

**Rationale**: High test coverage ensures reliability, co-location improves discoverability and maintenance, TDD prevents regressions.

### V. Component Isolation & Type Safety
React components MUST be "stupid" (presentational), with containers handling data and business logic. Each component/container resides in its own folder with TypeScript naming conventions: UpperCamelCase (PascalCase) for components/containers, lowerCamelCase for variables/functions. Styled-components styling in separate `.styled.ts` files. Zod schemas enforce runtime validation; react-hook-form manages form state. TypeScript strict mode is mandatory.

**Rationale**: Clear separation of concerns, predictable structure, type safety prevents runtime errors, validation schemas document and enforce contracts.

## Technical Stack Requirements

### Frontend Stack
- **Framework**: React 19.x (SPA), TypeScript (strict mode), PWA-enabled
- **Build**: Webpack with ts-loader, typescript-plugin-styled-components
- **State Management**: Redux Toolkit (no persistence to localStorage)
- **Styling**: styled-components, Ant Design component library
- **Forms & Validation**: react-hook-form, Zod schemas
- **API Client**: fetch API (no CORS, same domain, dev proxy configured)
- **Testing**: Jest (≥80% coverage), Storybook for component documentation
- **Linting/Formatting**: ESLint, Prettier, eslint-plugin-simple-import-sort, commitlint
- **Module Resolution**: Path aliases configured in tsconfig.json and bundler:
  - `@components` → `./src/components`
  - `@hooks` → `./src/hooks`
  - `@utils` → `./src/utils`
  - `@api` → `./src/api`
  - `@styles` → `./src/styles`
  - `@assets` → `./src/assets`
  - `@services` → `./src/services`
  - `@types` → `./src/types`
  - Prefer relative paths for local imports within the same folder
  - Do NOT use trailing `/*` in aliases

### Backend Stack
- **Runtime**: Node.js (latest LTS)
- **Database**: Any suitable database (to be determined based on scale requirements)
- **Naming**: camelCase for all JavaScript/TypeScript backend code
- **API**: RESTful endpoints serving frontend, CORS configured for same domain

### Configuration Management
Environment-specific settings MUST be managed via `.env` files. Example: `API_PATH`, `DATABASE_URL`. Sensitive configuration MUST NOT be committed to version control.

## Development Standards

### Code Organization
- **Frontend Components**: `components/[ComponentName]/[ComponentName].tsx` + `[ComponentName].styled.ts`
- **Frontend Containers**: `containers/[ContainerName]/[ContainerName].tsx`
- **Tests**: `[artifact]/__tests__/[artifact].test.tsx` (co-located)
- **Stories**: `[artifact]/__stories__/[artifact].stories.tsx` (co-located)
- **No Routing**: Single-page application without routing library

### Naming Conventions
- **Frontend Components/Containers**: UpperCamelCase (PascalCase), e.g., `TodoList`, `AddItemContainer`
- **Variables/Functions**: lowerCamelCase, e.g., `handleSubmit`, `todoItems`
- **Files**: Match component/container name exactly, styled files include `.styled.` in name

### Import/Export Conventions
- **Named Imports/Exports**: MUST use named imports and exports exclusively. Wildcard imports (`import * as`) and wildcard exports (`export * from`) are FORBIDDEN.
- **Rationale**: Named imports/exports provide explicit dependencies, improve tree-shaking, enable better IDE autocompletion, and make refactoring safer by catching breaking changes at compile time.

### Data Persistence Rules
- **Primary Data**: MUST be fetched from API, MUST NOT persist to localStorage
- **Offline Queue**: ONLY persistent data allowed is the sync queue for pending operations
- **Redux State**: NO persistence; ephemeral session state only

### Dependency Management
- MUST use latest stable versions of all packages at time of installation
- Update dependencies regularly to incorporate security patches and features

## Governance

This constitution supersedes all other development practices and guidelines. All features, pull requests, and architectural decisions MUST be validated against these principles before approval.

**Amendment Process**:
- Proposed changes documented with rationale and impact analysis
- Version incremented per semantic versioning (MAJOR for breaking governance changes, MINOR for additions, PATCH for clarifications)
- Migration plan required for constitution changes affecting existing code

**Compliance**:
- All pull requests MUST verify alignment with constitution principles
- Deviations require explicit justification and approval
- Constitution Check in plan-template.md enforces validation gates

**Versioning Policy**:
- MAJOR: Backward-incompatible principle removals or redefinitions
- MINOR: New principles added or material guidance expansions
- PATCH: Clarifications, wording fixes, non-semantic refinements

**Version**: 1.1.0 | **Ratified**: 2026-02-16 | **Last Amended**: 2026-02-16
