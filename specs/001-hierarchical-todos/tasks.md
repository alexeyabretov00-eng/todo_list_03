# Tasks: Hierarchical Todo Management

**Feature**: 001-hierarchical-todos  
**Input**: Design documents from `/specs/001-hierarchical-todos/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- All file paths are relative to project root

## Implementation Strategy

**MVP Scope**: User Story 1 (Basic List and Element Management) provides immediate value as a functional two-level todo tracker. Stories 2-4 add incrementally:
- US2 adds third hierarchical level (sub-items)
- US3 adds organization features (reorder, edit, delete)
- US4 ensures cross-platform compatibility (already built-in through responsive design)

**Suggested Delivery Order**:
1. Phase 1-2: Setup and foundation
2. Phase 3: User Story 1 → **MVP Release 🎯**
3. Phase 4: User Story 2 → Feature Enhancement
4. Phase 5: User Story 4 → Platform Validation (can run in parallel with US2)
5. Phase 6: User Story 3 → Polish Features
6. Phase 7: Final polish and optimization

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project directory structure: `backend/` and `frontend/` as defined in [plan.md](./plan.md#L52-L105)
- [X] T002 Initialize backend package with Node.js 20.x: `backend/package.json` with TypeScript, Express, better-sqlite3, cors, dotenv dependencies per [quickstart.md](./quickstart.md#L23-L32)
- [X] T003 [P] Initialize frontend package with React 19.x: `frontend/package.json` with React 19, Redux Toolkit, styled-components, Ant Design, react-hook-form, Zod, react-beautiful-dnd per [quickstart.md](./quickstart.md#L88-L111)
- [X] T004 [P] Configure backend TypeScript: `backend/tsconfig.json` with strict mode, ES2022 target, node module resolution per [quickstart.md](./quickstart.md#L59-L73)
- [X] T005 [P] Configure frontend TypeScript: `frontend/tsconfig.json` with strict mode, path aliases (@components, @hooks, etc.) per [quickstart.md](./quickstart.md#L113-L136)
- [X] T006 [P] Configure Webpack: `frontend/webpack.config.js` with ts-loader, HtmlWebpackPlugin, WorkboxWebpackPlugin, dev server proxy per [quickstart.md](./quickstart.md#L138-L184)
- [X] T007 [P] Setup linting: `frontend/.eslintrc.json` with TypeScript parser, React plugin, simple-import-sort per [quickstart.md](./quickstart.md#L214-L231)
- [X] T008 [P] Setup formatting: `.prettierrc` with project code style rules per [quickstart.md](./quickstart.md#L233-L241)
- [X] T009 [P] Setup commit linting: `commitlint.config.js` with conventional commits per [quickstart.md](./quickstart.md#L243-L247)
- [X] T010 [P] Create backend environment template: `backend/.env.example` with PORT, DB_PATH, CORS_ORIGIN per [quickstart.md](./quickstart.md#L87)
- [X] T011 [P] Create frontend environment template: `frontend/.env.example` with REACT_APP_API_URL per [quickstart.md](./quickstart.md#L212)
- [X] T012 [P] Create HTML entry point: `frontend/public/index.html` with PWA meta tags and app root div
- [X] T013 [P] Configure Jest for backend: `backend/jest.config.js` with ts-jest preset, coverage thresholds ≥80%
- [X] T014 [P] Configure Jest for frontend: `frontend/jest.config.js` with React Testing Library, moduleNameMapper for path aliases, coverage thresholds ≥80%
- [X] T015 [P] Initialize Storybook: `frontend/.storybook/` configuration for React components per [quickstart.md](./quickstart.md#L109)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [X] T016 Setup SQLite database connection: `backend/src/db/database.ts` with better-sqlite3 initialization, connection pooling, error handling per [data-model.md](./data-model.md#L367-L389)
- [X] T017 Create database migration v1: `backend/src/db/migrations/001_initial_schema.sql` with TodoList, TodoElement, SubItem tables per [data-model.md](./data-model.md#L367-L389)
- [X] T018 Implement migration runner: `backend/src/db/migrate.ts` to execute migrations on startup per [data-model.md](./data-model.md#L391-L397)
- [X] T019 Create database indexes: Add indexes for listId, elementId, displayOrder per [data-model.md](./data-model.md#L221-L249)
- [X] T020 [P] Define TypeScript types: `backend/src/types/entities.ts` with TodoList, TodoElement, SubItem interfaces per [data-model.md](./data-model.md#L251-L324)
- [X] T021 [P] Define API request/response types: `backend/src/types/api.ts` with Create/Update/Reorder request types per [data-model.md](./data-model.md#L285-L324)
- [X] T022 Setup Express app: `backend/src/app.ts` with CORS middleware, JSON parser, error handler per [research.md](./research.md#L57-L65)
- [X] T023 [P] Create error handling middleware: `backend/src/api/middleware/errorHandler.ts` for consistent error responses per [contracts/README.md](./contracts/README.md#L148-L171)
- [X] T024 [P] Create validation middleware: `backend/src/api/middleware/validator.ts` for request validation per [contracts/README.md](./contracts/README.md#L173-L183)
- [X] T025 Create server entry point: `backend/src/server.ts` to start Express app on PORT from env per [quickstart.md](./quickstart.md#L75)

### Frontend Foundation

- [X] T026 Define TypeScript types: `frontend/src/types/entities.ts` with TodoList, TodoElement, SubItem, matching backend types per [data-model.md](./data-model.md#L251-L284)
- [X] T027 [P] Create Redux store: `frontend/src/store/index.ts` with configureStore, rootReducer per [research.md](./research.md#L25-L38)
- [X] T028 [P] Create API client utility: `frontend/src/api/client.ts` with fetch wrapper, error handling, retry logic per [research.md](./research.md#L73-L78)
- [X] T029 [P] Create theme configuration: `frontend/src/styles/theme.ts` with colors, typography, spacing, breakpoints for styled-components per [research.md](./research.md#L11-L17)
- [X] T030 [P] Create global styles: `frontend/src/styles/GlobalStyles.ts` with CSS reset, base styles per [research.md](./research.md#L11-L17)
- [X] T031 Create app entry point: `frontend/src/index.tsx` with React.render, Redux Provider, theme provider per [quickstart.md](./quickstart.md#L138-L184)
- [X] T032 [P] Setup service worker: `frontend/src/serviceWorkerRegistration.ts` for PWA offline support per [research.md](./research.md#L109-L123)
- [X] T033 [P] Create offline queue types: `frontend/src/types/offlineQueue.ts` with QueuedOperation interface per [data-model.md](./data-model.md#L326-L347)
- [X] T034 [P] Implement IndexedDB wrapper: `frontend/src/services/offlineStorage.ts` using idb library for queue persistence per [research.md](./research.md#L115-L123)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic List and Element Management (Priority: P1) 🎯 MVP

**Goal**: Enable users to create todo lists, add elements to lists, mark elements complete/incomplete, and persist data via REST API. This is the core MVP delivering immediate value as a functional two-level todo tracker.

**Independent Test**: Create a list named "Shopping", add 3 elements ("Buy milk", "Buy bread", "Buy eggs"), mark 1 element complete, refresh page and verify all data persists. System should show completed element with visual distinction (strikethrough, checkmark).

### Backend: Lists API

- [X] T035 [P] [US1] Create TodoList model: `backend/src/models/TodoList.ts` with CRUD methods (create, findAll, findById, update, delete) per [data-model.md](./data-model.md#L15-L39)
- [X] T036 [P] [US1] Create TodoList service: `backend/src/services/todoListService.ts` with business logic, validation (max 20 lists, name required/max 500 chars) per [data-model.md](./data-model.md#L143-L167)
- [X] T037 [US1] Implement GET /api/lists: `backend/src/api/routes/lists.ts` to fetch all lists per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L11-L32)
- [X] T038 [US1] Implement POST /api/lists: `backend/src/api/routes/lists.ts` to create new list with validation per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L33-L70)
- [X] T039 [US1] Implement GET /api/lists/:listId: `backend/src/api/routes/lists.ts` to fetch single list with optional elements per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L71-L109)
- [X] T040 [US1] Implement PUT /api/lists/:listId: `backend/src/api/routes/lists.ts` to update list name per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L110-L153)
- [X] T041 [US1] Implement DELETE /api/lists/:listId: `backend/src/api/routes/lists.ts` with CASCADE deletion per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L154-L180)

### Backend: Elements API

- [X] T042 [P] [US1] Create TodoElement model: `backend/src/models/TodoElement.ts` with CRUD methods, completion state management per [data-model.md](./data-model.md#L41-L84)
- [X] T043 [P] [US1] Create TodoElement service: `backend/src/services/todoElementService.ts` with business logic, validation (max 100 per list, text required/max 500 chars) per [data-model.md](./data-model.md#L143-L167)
- [X] T044 [US1] Implement GET /api/lists/:listId/elements: `backend/src/api/routes/elements.ts` to fetch all elements in list per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L210-L248)
- [X] T045 [US1] Implement POST /api/lists/:listId/elements: `backend/src/api/routes/elements.ts` to create element with validation per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L249-L290)
- [X] T046 [US1] Implement GET /api/elements/:elementId: `backend/src/api/routes/elements.ts` to fetch single element with optional sub-items per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L291-L329)
- [X] T047 [US1] Implement PUT /api/elements/:elementId: `backend/src/api/routes/elements.ts` to update element text per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L330-L373)
- [X] T048 [US1] Implement DELETE /api/elements/:elementId: `backend/src/api/routes/elements.ts` with CASCADE deletion per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L374-L400)
- [X] T049 [US1] Implement PUT /api/elements/:elementId/complete: `backend/src/api/routes/elements.ts` to toggle completion state per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L401-L438)

### Frontend: Redux State Management

- [X] T050 [P] [US1] Create lists slice: `frontend/src/store/slices/listsSlice.ts` with reducers (addList, updateList, deleteList, setLists) and async thunks (fetchLists, createList, updateList, deleteList) per [research.md](./research.md#L25-L38)
- [X] T051 [P] [US1] Create elements slice: `frontend/src/store/slices/elementsSlice.ts` with reducers (addElement, updateElement, deleteElement, toggleComplete, setElements) and async thunks per [research.md](./research.md#L25-L38)
- [X] T052 [P] [US1] Create offline queue slice: `frontend/src/store/slices/offlineQueueSlice.ts` with enqueue/dequeue actions per [research.md](./research.md#L115-L123)

### Frontend: API Client Functions

- [X] T053 [P] [US1] Implement lists API client: `frontend/src/api/lists.ts` with functions (fetchLists, createList, updateList, deleteList) calling backend endpoints per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L11-L180)
- [X] T054 [P] [US1] Implement elements API client: `frontend/src/api/elements.ts` with functions (fetchElements, createElement, updateElement, deleteElement, toggleElementComplete) per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L210-L438)

### Frontend: Core Components

- [X] T055 [P] [US1] Create TodoListCard component: `frontend/src/components/TodoListCard/TodoListCard.tsx` with styled-components, display name, element count, actions per [research.md](./research.md#L19-L23)
- [X] T056 [P] [US1] Create TodoListCard styles: `frontend/src/components/TodoListCard/TodoListCard.styled.ts` with responsive card layout per Constitution principle
- [X] T057 [P] [US1] Create TodoListCard tests: `frontend/src/components/TodoListCard/__tests__/TodoListCard.test.tsx` with RTL per [research.md](./research.md#L92-L100)
- [X] T058 [P] [US1] Create TodoListCard stories: `frontend/src/components/TodoListCard/__stories__/TodoListCard.stories.tsx` for Storybook per [research.md](./research.md#L92-L100)
- [X] T059 [P] [US1] Create TodoElement component: `frontend/src/components/TodoElement/TodoElement.tsx` with checkbox, text, completion state visual distinction (strikethrough) per [spec.md](./spec.md#L32)
- [X] T060 [P] [US1] Create TodoElement styles: `frontend/src/components/TodoElement/TodoElement.styled.ts` with completion styles (strikethrough, checkmark, color change) per FR-025
- [X] T061 [P] [US1] Create TodoElement tests: `frontend/src/components/TodoElement/__tests__/TodoElement.test.tsx` testing completion toggle per [research.md](./research.md#L92-L100)
- [X] T062 [P] [US1] Create TodoElement stories: `frontend/src/components/TodoElement/__stories__/TodoElement.stories.tsx` with completed/uncompleted states per [research.md](./research.md#L92-L100)
- [X] T063 [P] [US1] Create EmptyState component: `frontend/src/components/EmptyState/EmptyState.tsx` for no lists/elements scenarios per [spec.md](./spec.md#L101-L102)
- [X] T064 [P] [US1] Create Button component: `frontend/src/components/Button/Button.tsx` reusable styled button with variants (primary, secondary, danger)
- [X] T065 [P] [US1] Create Input component: `frontend/src/components/Input/Input.tsx` reusable styled input with validation states

### Frontend: Smart Containers

- [X] T066 [US1] Create AppContainer: `frontend/src/containers/AppContainer/AppContainer.tsx` with Redux Provider, theme provider, online/offline status handling, global error boundary per [research.md](./research.md#L19-L23)
- [X] T067 [US1] Create TodoListsViewContainer: `frontend/src/containers/TodoListsViewContainer/TodoListsViewContainer.tsx` fetching lists on mount, dispatching create/update/delete actions per [research.md](./research.md#L19-L23)
- [X] T068 [US1] Create CreateListFormContainer: `frontend/src/containers/CreateListFormContainer/CreateListFormContainer.tsx` with react-hook-form, Zod validation (required, max 500 chars) per [research.md](./research.md#L127-L138)
- [X] T069 [US1] Create TodoElementsListContainer: `frontend/src/containers/TodoElementsListContainer/TodoElementsListContainer.tsx` displaying elements for selected list, dispatching toggle complete per [research.md](./research.md#L19-L23)
- [X] T070 [US1] Create CreateElementFormContainer: `frontend/src/containers/CreateElementFormContainer/CreateElementFormContainer.tsx` with react-hook-form, Zod validation per [research.md](./research.md#L127-L138)

### Integration & Testing

- [X] T071 [US1] Implement optimistic UI updates: Update Redux slices to optimistically apply changes before API confirmation per [research.md](./research.md#L115-L123)
- [X] T072 [US1] Implement offline queue processing: Add sync service to process queued operations on connectivity restore per [research.md](./research.md#L115-L123)
- [ ] T073 [US1] Integrate Workbox service worker: Configure caching strategies for API responses, static assets per [research.md](./research.md#L109-L123)
- [ ] T074 [US1] Add loading states: Implement loading indicators during API calls in containers per [research.md](./research.md#L92-L100)
- [ ] T075 [US1] Add error handling: Display error messages for validation failures, network errors per [contracts/README.md](./contracts/README.md#L148-L171)
- [ ] T076 [US1] Backend integration tests: `backend/tests/integration/lists-elements.test.ts` testing full CRUD workflows per [research.md](./research.md#L92-L100)
- [ ] T077 [US1] Frontend integration tests: `frontend/src/__tests__/integration/list-element-workflow.test.tsx` testing create list → add element → mark complete flow per [spec.md](./spec.md#L32-L42)

**Checkpoint**: At this point, User Story 1 (MVP) should be fully functional. Users can create lists, add elements, mark complete, and data persists after refresh. **This is a shippable increment.**

---

## Phase 4: User Story 2 - Sub-Item Management (Priority: P2)

**Goal**: Enable users to expand elements and add sub-items for task breakdown. Sub-items can be marked complete independently. Parent elements show progress indication (e.g., "2 of 3 complete"). Visual indicators show which elements have sub-items.

**Independent Test**: Create element "Prepare presentation", add 3 sub-items ("Research topic", "Create slides", "Practice delivery"), mark 2 sub-items complete, verify parent shows "2 of 3 complete" progress, mark parent complete to auto-complete all sub-items per FR-041.

### Backend: SubItems API

- [ ] T078 [P] [US2] Create SubItem model: `backend/src/models/SubItem.ts` with CRUD methods per [data-model.md](./data-model.md#L86-L118)
- [ ] T079 [P] [US2] Create SubItem service: `backend/src/services/subItemService.ts` with business logic, validation (max 20 per element, text required/max 500 chars) per [data-model.md](./data-model.md#L143-L167)
- [ ] T080 [US2] Implement GET /api/elements/:elementId/subitems: `backend/src/api/routes/subitems.ts` to fetch all sub-items for element per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L469-L507)
- [ ] T081 [US2] Implement POST /api/elements/:elementId/subitems: `backend/src/api/routes/subitems.ts` to create sub-item with validation per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L508-L549)
- [ ] T082 [US2] Implement GET /api/subitems/:subItemId: `backend/src/api/routes/subitems.ts` to fetch single sub-item per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L550-L580)
- [ ] T083 [US2] Implement PUT /api/subitems/:subItemId: `backend/src/api/routes/subitems.ts` to update sub-item text per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L581-L624)
- [ ] T084 [US2] Implement DELETE /api/subitems/:subItemId: `backend/src/api/routes/subitems.ts` to delete sub-item per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L625-L651)
- [ ] T085 [US2] Implement PUT /api/subitems/:subItemId/complete: `backend/src/api/routes/subitems.ts` to toggle sub-item completion per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L652-L689)
- [ ] T086 [US2] Implement completion cascading: Update TodoElement service to auto-complete all sub-items when parent marked complete per [spec.md](./spec.md#L58) and [data-model.md](./data-model.md#L65-L71)
- [ ] T087 [US2] Implement progress calculation: Update GET /api/elements/:elementId to include computed subItemCount, completedSubItemCount per [data-model.md](./data-model.md#L73-L76)

### Frontend: SubItems State & API

- [ ] T088 [P] [US2] Create subItems slice: `frontend/src/store/slices/subItemsSlice.ts` with reducers (addSubItem, updateSubItem, deleteSubItem, toggleComplete, setSubItems) per [research.md](./research.md#L25-L38)
- [ ] T089 [P] [US2] Implement subItems API client: `frontend/src/api/subItems.ts` with functions (fetchSubItems, createSubItem, updateSubItem, deleteSubItem, toggleSubItemComplete) per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L469-L689)

### Frontend: SubItem Components

- [ ] T090 [P] [US2] Create SubItem component: `frontend/src/components/SubItem/SubItem.tsx` with checkbox, text, completion styles per [research.md](./research.md#L19-L23)
- [ ] T091 [P] [US2] Create SubItem styles: `frontend/src/components/SubItem/SubItem.styled.ts` with indentation, completion visual per FR-025
- [ ] T092 [P] [US2] Create SubItem tests: `frontend/src/components/SubItem/__tests__/SubItem.test.tsx` per [research.md](./research.md#L92-L100)
- [ ] T093 [P] [US2] Create SubItem stories: `frontend/src/components/SubItem/__stories__/SubItem.stories.tsx` per [research.md](./research.md#L92-L100)
- [ ] T094 [US2] Update TodoElement component: Add expand/collapse functionality, progress indicator ("2 of 5 complete"), visual indicator for sub-items existence per FR-024, FR-026
- [ ] T095 [US2] Create SubItemsList container: `frontend/src/containers/SubItemsList/SubItemsList.tsx` displaying sub-items for expanded element per [research.md](./research.md#L19-L23)
- [ ] T096 [US2] Create CreateSubItemForm container: `frontend/src/containers/CreateSubItemForm/CreateSubItemForm.tsx` with validation per [research.md](./research.md#L127-L138)

### Integration & Testing

- [ ] T097 [US2] Handle completion cascading: Update elements slice to cascade completion to all sub-items when parent marked complete per FR-041
- [ ] T098 [US2] Update offline queue: Extend queue to handle sub-item operations per [research.md](./research.md#L115-L123)
- [ ] T099 [US2] Backend integration tests: `backend/tests/integration/subitems-cascade.test.ts` testing completion cascading, progress calculation per [spec.md](./spec.md#L52-L62)
- [ ] T100 [US2] Frontend integration tests: `frontend/src/__tests__/integration/subitem-workflow.test.tsx` testing add sub-items → mark complete → verify progress → complete parent → verify cascade per [spec.md](./spec.md#L52-L62)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can create 3-level hierarchies with progress tracking and completion cascading.

---

## Phase 5: User Story 4 - Responsive Cross-Platform Experience (Priority: P1)

**Goal**: Ensure app works seamlessly on desktop and mobile with platform-appropriate interactions. Desktop uses keyboard navigation (Tab/Arrow), mobile uses touch-optimized controls (minimum 44x44 CSS pixels for tap targets). Both platforms support offline mode with automatic sync.

**Why implement before US3**: This validates constitutional requirements early and can be developed in parallel with US2. Responsiveness affects all components, so establishing patterns now avoids rework.

**Independent Test**: Access app on desktop Chrome, create list with elements using keyboard navigation. Access same data on mobile Safari, interact with touch controls, verify tap targets ≥44x44px. Go offline on mobile, make changes, reconnect and verify automatic sync.

### Frontend: Responsive Design

- [ ] T101 [P] [US4] Define breakpoints: Update `frontend/src/styles/theme.ts` with mobile (<768px), tablet (768-1024px), desktop (>1024px) breakpoints per [research.md](./research.md#L11-L17)
- [ ] T102 [P] [US4] Create responsive layout utilities: `frontend/src/utils/responsive.ts` with media query helpers per [research.md](./research.md#L11-L17)
- [ ] T103 [US4] Make TodoListCard responsive: Add mobile styles with stacked layout, larger tap targets (≥44x44 CSS pixels) per FR-029
- [ ] T104 [US4] Make TodoElement responsive: Add touch-friendly tap targets, swipe gesture support for mobile actions per FR-031
- [ ] T105 [US4] Make SubItem responsive: Ensure minimum tap target size, adjust indentation for mobile per FR-029
- [ ] T106 [US4] Implement keyboard navigation: Add Tab/Arrow key handlers in App container for list/element navigation per FR-030
- [ ] T107 [US4] Add touch gesture support: Implement swipe-to-reveal actions (complete, delete) on mobile using touch events per [spec.md](./spec.md#L95)

### Frontend: PWA & Offline Support

- [ ] T108 [US4] Create PWA manifest: `frontend/public/manifest.json` with app name, icons, theme color, display mode per [research.md](./research.md#L109-L114)
- [ ] T109 [P] [US4] Generate PWA icons: Create icon set (192x192, 512x512) in `frontend/public/icons/` per PWA requirements
- [ ] T110 [US4] Configure Workbox: Update webpack config with Workbox plugin for aggressive static asset caching per [research.md](./research.md#L109-L123)
- [ ] T111 [US4] Implement background sync: Register sync event in service worker for offline queue processing per [research.md](./research.md#L115-L123)
- [ ] T112 [US4] Add online/offline indicator: Create component showing connectivity status in App container per [spec.md](./spec.md#L103)
- [ ] T113 [US4] Add pending operations indicator: Show badge when offline queue has pending operations per [research.md](./research.md#L115-L123)

### Testing & Validation

- [ ] T114 [US4] Test keyboard navigation: Verify Tab/Arrow navigation works on desktop per FR-030
- [ ] T115 [US4] Test touch interactions: Verify tap targets meet 44x44px minimum on mobile per FR-029
- [ ] T116 [US4] Test responsive layouts: Verify layouts adapt correctly at 320px, 768px, 1024px, 4K resolutions per [plan.md](./plan.md#L40)
- [ ] T117 [US4] Test offline mode: Verify operations queue and sync after reconnection per [spec.md](./spec.md#L95)
- [ ] T118 [US4] Test orientation changes: Verify layout adapts on tablet rotation without data loss per [spec.md](./spec.md#L97-L98)
- [ ] T119 [US4] Browser compatibility tests: Verify functionality on Chrome, Firefox, Safari desktop and iOS Safari, Android Chrome per [plan.md](./plan.md#L30)

**Checkpoint**: App now works seamlessly across desktop and mobile platforms with appropriate interaction patterns and offline support.

---

## Phase 6: User Story 3 - Organization and Editing (Priority: P3)

**Goal**: Enable users to reorganize hierarchy through drag-and-drop (reorder lists, reorder elements, move elements between lists, reorder sub-items). Support editing text of any item and deleting items at any level with CASCADE deletion.

**Independent Test**: Create 3 lists with multiple elements, drag elements between lists, reorder lists and elements, edit item text, delete list and verify CASCADE deletion removes all elements and sub-items.

### Backend: Reorder & Move Operations

- [ ] T120 [US3] Implement PUT /api/lists/reorder: `backend/src/api/routes/lists.ts` to update displayOrder for multiple lists per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L181-L209)
- [ ] T121 [US3] Implement PUT /api/elements/reorder: `backend/src/api/routes/elements.ts` to update displayOrder for elements in list per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L439-L468)
- [ ] T122 [US3] Implement PUT /api/elements/:elementId/move: `backend/src/api/routes/elements.ts` to move element to different list per [contracts/README.md](./contracts/README.md#L53-L69)
- [ ] T123 [US3] Implement PUT /api/subitems/reorder: `backend/src/api/routes/subitems.ts` to update displayOrder for sub-items per [contracts/api-spec.yaml](./contracts/api-spec.yaml#L690-L718)

### Frontend: Drag-and-Drop Implementation

- [ ] T124 [P] [US3] Setup react-beautiful-dnd: Create DragDropContext in App container per [research.md](./research.md#L53-L55)
- [ ] T125 [US3] Make lists draggable: Wrap TodoListCard in Draggable, lists container in Droppable for reorder per [research.md](./research.md#L53-L55)
- [ ] T126 [US3] Make elements draggable: Wrap TodoElement in Draggable, elements container in Droppable for reorder and move between lists per [research.md](./research.md#L53-L55)
- [ ] T127 [US3] Make sub-items draggable: Wrap SubItem in Draggable, sub-items container in Droppable for reorder per [research.md](./research.md#L53-L55)
- [ ] T128 [US3] Handle list reorder: Dispatch reorder action on drag end, call backend API per [contracts/README.md](./contracts/README.md#L71-L99)
- [ ] T129 [US3] Handle element reorder: Dispatch reorder action within list on drag end per [contracts/README.md](./contracts/README.md#L71-L99)
- [ ] T130 [US3] Handle element move: Dispatch move action when element dragged to different list per [contracts/README.md](./contracts/README.md#L53-L69)
- [ ] T131 [US3] Handle sub-item reorder: Dispatch reorder action on drag end per [contracts/README.md](./contracts/README.md#L71-L99)

### Frontend: Editing & Deletion

- [ ] T132 [P] [US3] Create EditableText component: `frontend/src/components/EditableText/EditableText.tsx` with inline editing, validation per FR-016
- [ ] T133 [US3] Add edit functionality to lists: Integrate EditableText in TodoListCard for name editing per FR-016
- [ ] T134 [US3] Add edit functionality to elements: Integrate EditableText in TodoElement for text editing per FR-016
- [ ] T135 [US3] Add edit functionality to sub-items: Integrate EditableText in SubItem for text editing per FR-016
- [ ] T136 [P] [US3] Create confirmation modal: `frontend/src/components/ConfirmModal/ConfirmModal.tsx` for delete confirmations per [research.md](./research.md#L19-L23)
- [ ] T137 [US3] Add delete confirmation to lists: Show modal before CASCADE deletion warning per FR-017
- [ ] T138 [US3] Add delete confirmation to elements: Show modal before CASCADE deletion warning per FR-018
- [ ] T139 [US3] Add delete confirmation to sub-items: Show modal before deletion per FR-019

### Integration & Testing

- [ ] T140 [US3] Update offline queue: Handle reorder/move operations in queue per [research.md](./research.md#L115-L123)
- [ ] T141 [US3] Implement optimistic drag: Update UI immediately during drag, rollback on API error per [research.md](./research.md#L115-L123)
- [ ] T142 [US3] Backend integration tests: `backend/tests/integration/reorder-move.test.ts` testing reorder operations, move element between lists per [contracts/README.md](./contracts/README.md#L53-L99)
- [ ] T143 [US3] Backend CASCADE tests: `backend/tests/integration/cascade-delete.test.ts` verifying deletion cascades correctly per [data-model.md](./data-model.md#L24-L28)
- [ ] T144 [US3] Frontend drag-drop tests: `frontend/src/__tests__/integration/drag-drop.test.tsx` testing reorder and move workflows per [spec.md](./spec.md#L77-L83)
- [ ] T145 [US3] Frontend edit tests: `frontend/src/__tests__/integration/edit-delete.test.tsx` testing inline editing, delete confirmations per [spec.md](./spec.md#L73-L76)

**Checkpoint**: All user stories now fully implemented. Users can create, organize, edit, and manage hierarchical todos with full drag-and-drop support.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final optimizations, edge cases, performance, and production readiness

### Performance Optimization

- [ ] T146 [P] Implement virtualization: Add react-window for long lists (>50 items) to maintain performance per [research.md](./research.md#L140-L144)
- [ ] T147 [P] Add memoization: Use React.memo for TodoListCard, TodoElement, SubItem components to prevent unnecessary re-renders per [research.md](./research.md#L140-L144)
- [ ] T148 [P] Optimize bundle size: Analyze webpack bundle, implement code splitting for routes per [research.md](./research.md#L140-L144)
- [ ] T149 [P] Add database query optimization: Review slow queries, add additional indexes if needed per [research.md](./research.md#L146-L149)

### Edge Cases & Validation

- [ ] T150 [P] Implement empty states: Add EmptyState component usage for no lists, no elements, no sub-items per [spec.md](./spec.md#L101-L103)
- [ ] T151 [P] Handle text truncation: Truncate with ellipsis in list view for text >500 chars, full text on expand per [spec.md](./spec.md#L104-L105)
- [ ] T152 [P] Handle scale limits: Display friendly validation messages when hitting max 20 lists, 100 elements, 20 sub-items per FR-037-040
- [ ] T153 [P] Handle rapid toggles: Implement debouncing for completion toggles to prevent race conditions per [spec.md](./spec.md#L107-L108)
- [ ] T154 [P] Handle deleted list moves: Add validation to prevent moving element to non-existent list per [spec.md](./spec.md#L111-L112)

### Error Handling & Resilience

- [ ] T155 [P] Add retry logic: Implement exponential backoff for failed API requests per [research.md](./research.md#L73-L78)
- [ ] T156 [P] Add error boundaries: Wrap components in error boundaries with fallback UI per [research.md](./research.md#L92-L100)
- [ ] T157 [P] Handle network failures: Queue operations and show pending state during network errors per [spec.md](./spec.md#L113-L114)
- [ ] T158 [P] Handle initial load failures: Show offline message and cached data if API unreachable per [spec.md](./spec.md#L106-L107)

### Testing & Quality Assurance

- [ ] T159 Backend unit tests: Ensure ≥80% coverage for models, services, routes per Constitution Principle IV
- [ ] T160 Frontend unit tests: Ensure ≥80% coverage for components, slices, utils per Constitution Principle IV
- [ ] T161 End-to-end tests: Create E2E tests covering all 4 user stories with Playwright or Cypress
- [ ] T162 Accessibility audit: Run axe-core, verify WCAG 2.1 AA compliance, keyboard navigation per FR-030
- [ ] T163 Performance audit: Run Lighthouse, ensure PWA score >90, performance score >85 per [plan.md](./plan.md#L34-L38)

### Documentation & Deployment

- [ ] T164 [P] Update README: Add setup instructions, architecture overview, development guide
- [ ] T165 [P] Document API: Generate API docs from OpenAPI spec using Swagger UI per [contracts/README.md](./contracts/README.md#L197-L208)
- [ ] T166 [P] Document components: Ensure all components have comprehensive Storybook stories per Constitution Principle V
- [ ] T167 Create deployment guide: Document production build steps, environment variables, database setup
- [ ] T168 Setup CI/CD: Configure GitHub Actions for linting, testing, building on PR/push
- [ ] T169 Production build verification: Test production builds on target browsers per [plan.md](./plan.md#L30)

---

## Dependencies & Parallel Execution

### Story Dependencies (Completion Order)

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundation) ← CRITICAL BLOCKING PHASE
    ↓
    ├─→ Phase 3 (US1 - Lists & Elements) 🎯 MVP ← Highest Priority
    ├─→ Phase 4 (US2 - Sub-items) ← Can start after Phase 3 T077
    ├─→ Phase 5 (US4 - Responsive/PWA) ← Can run in parallel with Phase 4
    └─→ Phase 6 (US3 - Organization) ← Requires Phase 3, Phase 4 complete
        ↓
    Phase 7 (Polish) ← Requires all phases complete
```

### Parallel Opportunities by Phase

**Phase 1 (Setup)**: Tasks T002-T015 can all run in parallel (different configuration files)

**Phase 2 (Foundation)**:
- Backend tasks T016-T025: T020-T024 (types, middleware) parallel after T019 (database ready)
- Frontend tasks T026-T034: All parallel (independent utilities, types, config)

**Phase 3 (US1)**:
- Backend: T035-T036 (Lists model/service) parallel, T042-T043 (Elements model/service) parallel
- Frontend: T050-T052 (slices) parallel, T053-T054 (API clients) parallel, T055-T065 (components) parallel
- Integration: T066-T070 (containers) sequential (depends on slices + API clients)

**Phase 4 (US2)**:
- Backend: T078-T079 (SubItem model/service) parallel
- Frontend: T088-T089 (slice + API) parallel, T090-T093 (SubItem component) parallel

**Phase 5 (US4)**: T101-T102, T109 can run parallel, T103-T107 (responsive updates) can run parallel

**Phase 6 (US3)**: T132 (EditableText), T136 (ConfirmModal) can develop in parallel with T125-T131 (drag-drop)

**Phase 7 (Polish)**: T146-T149 (performance), T150-T154 (edge cases), T155-T158 (errors), T164-T166 (docs) all parallel until integration

### Example: Phase 3 Parallel Execution

**Sprint 1** (Foundation):
- Developer A: T035-T036 (Lists backend)
- Developer B: T042-T043 (Elements backend)
- Developer C: T050-T052 (Redux slices)
- Developer D: T055-T065 (UI components)

**Sprint 2** (Integration):
- Developer A: T037-T041 (Lists routes)
- Developer B: T044-T049 (Elements routes)
- Developer C: T053-T054 (API clients)
- Developer D: T066-T070 (Containers)

**Sprint 3** (Testing & Polish):
- All: T071-T077 (Integration, testing, offline support)

---

## Summary

- **Total Tasks**: 169 tasks across 7 phases
- **MVP Scope**: Phase 1-3 (T001-T077) delivers functional two-level todo tracker
- **Story-Based Organization**: 
  - Setup: 15 tasks
  - Foundation: 19 tasks (BLOCKING)
  - US1 (P1): 43 tasks (MVP) 🎯
  - US2 (P2): 23 tasks
  - US4 (P1): 19 tasks
  - US3 (P3): 26 tasks
  - Polish: 24 tasks

- **Parallel Opportunities**: ~60% of tasks can run in parallel within phases
- **Independent Testing**: Each user story has clear test criteria and can be validated independently
- **Test Coverage**: Constitution requires ≥80% coverage (enforced in T159-T160)
- **Format Validation**: ✅ ALL tasks follow checklist format (checkbox, ID, [P]/[Story] labels, file paths)

**Recommended MVP**: Complete Phase 1-3 (T001-T077) for first release, then iterate with Phase 4-7 based on user feedback.
