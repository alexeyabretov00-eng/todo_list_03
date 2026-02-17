# Feature Specification: Hierarchical Todo Management

**Feature Branch**: `001-hierarchical-todos`  
**Created**: 2026-02-16  
**Status**: Draft  
**Input**: User description: "i need create todo app it support todo list, each list item contains todo elements and each todo element contains sub items"

## Clarifications

### Session 2026-02-16

- Q: Data volume & scalability limits for the todo hierarchy (impacts database design, UI performance, pagination needs) → A: Small limits - Max 20 lists, 100 elements per list, 20 sub-items per element (no pagination needed, simpler implementation)
- Q: Keyboard shortcuts for desktop (impacts UX design and implementation complexity) → A: Minimal - Tab/Arrow navigation only, no action shortcuts (simplest, accessibility baseline only)
- Q: Backend database selection (impacts data modeling, query patterns, relationships, deployment complexity) → A: SQLite - File-based, zero configuration, perfect for single-user, simplest deployment
- Q: Parent element auto-complete behavior when marked complete (affects user expectations and data integrity logic) → A: Auto-complete - Marking parent complete automatically marks all sub-items complete (simplifies mental model)
- Q: Reorder/move interaction mechanism (impacts development complexity and UX consistency across platforms) → A: Drag-and-drop only - Native HTML5 drag-and-drop for desktop, touch drag for mobile

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic List and Element Management (Priority: P1)

A user opens the app and creates their first todo list (e.g., "Work Projects"). They add several todo elements to this list: "Prepare presentation", "Review documents", "Send emails". They can view all elements in the list and mark individual elements as complete when finished. The UI clearly shows which elements are completed and which remain active.

**Why this priority**: This is the core MVP functionality. Without the ability to create lists and add/complete elements, the application has no value. This represents the minimum viable product that delivers immediate utility to users.

**Independent Test**: Can be fully tested by creating a list, adding 3+ elements, marking some complete, and verifying the state persists after refresh. Delivers standalone value as a simple two-level todo tracker.

**Acceptance Scenarios**:

1. **Given** the app is loaded, **When** the user creates a new list named "Shopping", **Then** the list appears in the list view
2. **Given** a list exists, **When** the user adds an element "Buy milk", **Then** the element appears under the list in an uncompleted state
3. **Given** an uncompleted element exists, **When** the user marks it complete, **Then** the element shows as completed with visual indication (e.g., strikethrough, checkmark)
4. **Given** a completed element exists, **When** the user toggles it, **Then** the element returns to uncompleted state
5. **Given** multiple lists and elements exist, **When** the user refreshes the page, **Then** all lists, elements, and completion states are preserved

---

### User Story 2 - Sub-Item Management (Priority: P2)

A user navigates to a todo element like "Prepare presentation" and expands it to reveal sub-items. They add breakdown tasks: "Research topic", "Create slides", "Practice delivery". Each sub-item can be marked complete independently. The parent element shows progress indication (e.g., "2 of 3 complete"). Users can see which elements have sub-items before expanding them.

**Why this priority**: Adds the third hierarchical level, enabling users to break down complex tasks into manageable steps. This is the defining feature that differentiates this from a simple two-level todo app, but the app is still usable without it.

**Independent Test**: Can be tested independently by creating elements with sub-items, marking sub-items complete, and verifying progress tracking. Delivers value as a task breakdown and granular progress tracker.

**Acceptance Scenarios**:

1. **Given** an element "Prepare presentation" exists, **When** the user adds a sub-item "Research topic", **Then** the sub-item appears under the element
2. **Given** an element has sub-items, **When** the user marks a sub-item complete, **Then** the parent element updates progress indication (e.g., "1 of 3 complete")
3. **Given** an element has incomplete sub-items, **When** the user marks the parent element complete, **Then** the parent element and all sub-items are marked complete (cascade applies downward only: parent→children; does not affect parent list completion)
4. **Given** an element has no sub-items, **When** viewing the list, **Then** the element has no expand/collapse indicator
5. **Given** an element has sub-items, **When** viewing the list, **Then** a visual indicator shows sub-items exist (e.g., expand arrow, count badge)

---

### User Story 3 - Organization and Editing (Priority: P3)

A user can reorganize their todo hierarchy by reordering lists, moving elements between lists, and reordering elements and sub-items. They can edit the text of any list, element, or sub-item. They can delete items at any level. The interface provides intuitive drag-and-drop controls using native HTML5 drag-and-drop on desktop and touch drag gestures on mobile devices.

**Why this priority**: Enhances usability and long-term maintainability of todo data, but the app is fully functional without these features. Users can work around missing capabilities by deleting and recreating items.

**Independent Test**: Can be tested by creating a hierarchy, then reordering items, editing text, moving elements between lists, and deleting items. Delivers value as organizational flexibility.

**Acceptance Scenarios**:

1. **Given** multiple lists exist, **When** the user drags a list to a new position, **Then** the new order persists
2. **Given** an element exists in List A, **When** the user drags it to List B, **Then** the element appears in List B and is removed from List A
3. **Given** any item exists, **When** the user edits its text, **Then** the updated text persists and displays immediately
4. **Given** a list with elements exists, **When** the user deletes the list, **Then** the list and all its elements and sub-items are removed
5. **Given** an element with sub-items exists, **When** the user deletes the element, **Then** the element and all sub-items are removed
6. **Given** multiple elements exist, **When** the user drags an element to a new position within the list, **Then** the new order persists

---

### User Story 4 - Responsive Cross-Platform Experience (Priority: P1)

A user accesses the app on their desktop computer and creates several lists with elements. They later open the app on their mobile phone and see the same data. The mobile interface adapts with touch-friendly controls: larger tap targets, swipe gestures for completion, and optimized layout for small screens. The desktop interface uses keyboard shortcuts and hover states. Both interfaces remain fully functional offline with automatic sync when connectivity is restored.

**Why this priority**: Cross-platform support and responsiveness are constitutional requirements (Principle II). This is essential for MVP delivery and must be validated from the start, not retrofitted later.

**Independent Test**: Can be tested by interacting with the app on desktop, then accessing the same data on mobile. Verify touch and keyboard interactions work appropriately on each platform. Delivers value as ubiquitous access.

**Acceptance Scenarios**:

1. **Given** the user is on desktop, **When** they create a list, **Then** the list appears with keyboard-accessible controls (Tab/Arrow navigation) and hover states
2. **Given** the user is on mobile, **When** they create a list, **Then** the list appears with touch-optimized controls (larger tap targets)
3. **Given** the user is on mobile, **When** they swipe an element, **Then** contextual actions appear (e.g., complete, delete)
4. **Given** changes are made on desktop, **When** the user opens the app on mobile, **Then** changes are reflected (data fetched from API)
5. **Given** the user is offline, **When** they mark items complete, **Then** changes queue for sync and apply when connectivity restores
6. **Given** the user is on tablet, **When** rotating device orientation, **Then** layout adapts responsively without data loss

---

### Edge Cases

- What happens when a list is empty (no elements)?
  - Display shows empty state with call-to-action to add first element
- What happens when an element is empty (no sub-items)?
  - Element displays normally without expand/collapse controls
- What happens when deleting the last list?
  - App shows empty state with prompt to create first list
- What happens when creating items with very long text (500+ characters)?
  - Text truncates with ellipsis in list view, full text visible on expand/edit
- What happens when the API is unreachable during initial load?
  - App displays offline message, shows cached data if available from prior session (via service worker), or empty state if first visit
- What happens when sync queue grows large during extended offline period?
  - Queue stores operations locally, processes on reconnection in order created, conflicts handled by last-write-wins
- What happens when rapidly toggling completion states (race conditions)?
  - UI optimistically updates, operations queue in order, server state becomes authoritative on next sync
- What happens when marking a parent element complete while sub-items are incomplete?
  - System automatically marks all sub-items as complete when parent is marked complete; maintains data consistency
- What happens when unmarking a completed parent element?
  - Parent returns to incomplete state; sub-items retain completed state (remain marked complete)
- What happens when attempting to move an element to a deleted list?
  - Validation prevents move; list must exist; user sees error message
- What happens when network request fails mid-operation?
  - Operation queues to offline sync, UI shows pending indicator, retry occurs on reconnection
- What happens when user attempts to create more than 20 lists?
  - System displays validation message: "Maximum 20 lists allowed", prevents creation
- What happens when user attempts to add more than 100 elements to a list?
  - System displays validation message: "Maximum 100 elements per list allowed", prevents creation
- What happens when user attempts to add more than 20 sub-items to an element?
  - System displays validation message: "Maximum 20 sub-items per element allowed", prevents creation

## Requirements *(mandatory)*

### Functional Requirements

#### Hierarchy Management

- **FR-001**: System MUST support three-level hierarchy: Lists contain Elements, Elements contain Sub-items
- **FR-002**: System MUST allow creation of multiple todo lists with unique names
- **FR-003**: System MUST allow adding todo elements to any list
- **FR-004**: System MUST allow adding sub-items to any element
- **FR-005**: System MUST display hierarchical relationships clearly in the UI (visual nesting/indentation)

#### State Management

- **FR-006**: System MUST track completion state independently for elements and sub-items
- **FR-007**: System MUST persist all data (lists, elements, sub-items, completion states) via REST API to SQLite database
- **FR-008**: System MUST fetch all data from the API on application load (no localStorage persistence per Constitution Principle III)
- **FR-009**: System MUST maintain offline sync queue for operations performed while offline
- **FR-010**: System MUST automatically sync queued operations when connectivity is restored
- **FR-041**: System MUST automatically mark all sub-items complete when parent element is marked complete

#### User Interactions

- **FR-011**: Users MUST be able to mark elements as complete/incomplete with single interaction
- **FR-012**: Users MUST be able to mark sub-items as complete/incomplete with single interaction
- **FR-013**: Users MUST be able to toggle completion state (complete ↔ incomplete) for any item
- **FR-014**: Users MUST be able to view all lists, elements, and sub-items in hierarchical structure
- **FR-015**: Users MUST be able to expand/collapse elements to show/hide sub-items

#### Editing and Organization

- **FR-016**: Users MUST be able to edit the text of any list, element, or sub-item
- **FR-017**: Users MUST be able to delete lists (including all contained elements and sub-items)
- **FR-018**: Users MUST be able to delete elements (including all contained sub-items)
- **FR-019**: Users MUST be able to delete individual sub-items
- **FR-020**: Users MUST be able to reorder lists using drag-and-drop (HTML5 drag API on desktop, touch drag on mobile)
- **FR-021**: Users MUST be able to reorder elements within a list using drag-and-drop
- **FR-022**: Users MUST be able to reorder sub-items within an element using drag-and-drop
- **FR-023**: Users MUST be able to move elements from one list to another using drag-and-drop

#### Progress Indication

- **FR-024**: System MUST display progress indication for elements containing sub-items (e.g., "2 of 5 complete")
- **FR-025**: System MUST visually distinguish completed items from active items (e.g., strikethrough, checkmark, color change)
- **FR-026**: System MUST indicate which elements contain sub-items before expansion (e.g., expand arrow, count badge)

#### Responsive Design

- **FR-027**: UI MUST adapt to desktop viewport sizes with optimized layouts and controls
- **FR-028**: UI MUST adapt to mobile viewport sizes with touch-optimized controls
- **FR-029**: UI MUST provide touch-friendly tap targets on mobile (minimum 44x44 CSS pixels per accessibility guidelines)
- **FR-030**: UI MUST support keyboard navigation on desktop using Tab key (move between controls) and Arrow keys (navigate lists/items) for accessibility compliance
- **FR-031**: UI MUST support common mobile gestures (swipe for actions, pinch-to-zoom disabled for app chrome)

#### Data Validation

- **FR-032**: System MUST validate that list names are not empty before creation
- **FR-033**: System MUST validate that element text is not empty before creation
- **FR-034**: System MUST validate that sub-item text is not empty before creation
- **FR-035**: System MUST enforce maximum text length limits (500 characters for names/descriptions)
- **FR-036**: System MUST prevent deletion of lists/elements/sub-items while delete operation is in progress
- **FR-037**: System MUST enforce maximum of 20 lists per user
- **FR-038**: System MUST enforce maximum of 100 elements per list
- **FR-039**: System MUST enforce maximum of 20 sub-items per element
- **FR-040**: System MUST display clear validation messages when limits are reached

### Key Entities *(include if feature involves data)*

- **Todo List**: Top-level organizational container with a name/title. Contains zero or more Todo Elements (maximum 100 per list). Attributes include unique identifier, name text, creation timestamp, display order position. System supports maximum 20 lists per user.

- **Todo Element**: Individual task item within a List. Can contain zero or more Sub-items (maximum 20 per element). Attributes include unique identifier, text description, completion state (boolean), creation timestamp, display order position, parent List reference.

- **Sub-item**: Granular task breakdown within an Element. Cannot contain further nested items (maximum depth is 3 levels). Attributes include unique identifier, text description, completion state (boolean), creation timestamp, display order position, parent Element reference.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a list and add their first element within 30 seconds of loading the app
- **SC-002**: Users can successfully complete a three-level hierarchy workflow (create list → add element → add sub-item → mark complete) within 2 minutes
- **SC-003**: Application loads and displays existing todo data within 2 seconds on standard broadband connection
- **SC-004**: UI responds to user interactions within 100 milliseconds (optimistic updates before API confirmation)
- **SC-005**: Touch targets on mobile are accessible and users can complete tasks without zoom (minimum 44x44 CSS pixels)
- **SC-006**: Offline operations sync successfully within 5 seconds of connectivity restoration
- **SC-007**: Application functions identically on desktop (Chrome, Firefox, Safari) and mobile (iOS Safari, Android Chrome)
- **SC-008**: 90% of user interactions (create, complete, delete) succeed on first attempt without errors
- **SC-009**: Application passes 80% test coverage requirement per Constitution Principle IV
- **SC-010**: Users can reorganize their todo hierarchy using drag-and-drop with interface controls discoverable within 10 seconds
