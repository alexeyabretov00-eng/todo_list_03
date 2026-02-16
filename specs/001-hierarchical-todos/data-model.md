# Data Model: Hierarchical Todo Management

**Feature**: 001-hierarchical-todos  
**Date**: 2026-02-16  
**Phase**: 1 - Data Model Design

## Overview

This document defines the data entities, relationships, validation rules, and state transitions for the hierarchical todo management system. The model supports a 3-level hierarchy: Lists → Elements → Sub-items.

## Entity Definitions

### TodoList

**Description**: Top-level organizational container for grouping related todo elements.

**Attributes**:
- `id` (string, UUID): Unique identifier, primary key
- `name` (string): List name/title
  - Required, non-empty
  - Max length: 500 characters
  - Example: "Work Projects", "Shopping List", "Home Maintenance"
- `displayOrder` (integer): Position in list order (0-based)
  - Used for custom user-defined ordering
  - Updated on reorder operations
- `createdAt` (timestamp): Creation timestamp (ISO 8601)
  - Auto-generated on creation
  - Immutable

**Relationships**:
- `elements`: One-to-many relationship with TodoElement (CASCADE DELETE)
  - A list can have 0-100 elements (enforced limit)
  - Deleting list deletes all elements and their sub-items

**Constraints**:
- Maximum 20 lists per user (FR-037)
- Unique displayOrder per user
- name must not be empty (FR-032)
- name max length 500 characters (FR-035)

**State Transitions**: None (lists don't have completion state)

### TodoElement

**Description**: Individual task item within a list. Can optionally contain sub-items for task breakdown.

**Attributes**:
- `id` (string, UUID): Unique identifier, primary key
- `listId` (string, UUID): Foreign key to parent TodoList
  - Required
  - Must reference existing list
- `text` (string): Element description/task text
  - Required, non-empty
  - Max length: 500 characters
  - Example: "Prepare presentation", "Buy milk", "Fix leaky faucet"
- `isCompleted` (boolean): Completion state
  - Default: false
  - Toggleable by user
  - Marking complete cascades to all sub-items (FR-041)
- `displayOrder` (integer): Position within parent list (0-based)
  - Used for custom user-defined ordering within list
  - Updated on reorder/move operations
- `createdAt` (timestamp): Creation timestamp (ISO 8601)
  - Auto-generated on creation
  - Immutable

**Relationships**:
- `list`: Many-to-one relationship with TodoList
  - Element belongs to exactly one list
  - listId foreign key with CASCADE DELETE
- `subItems`: One-to-many relationship with SubItem (CASCADE DELETE)
  - Element can have 0-20 sub-items (enforced limit)
  - Deleting element deletes all sub-items
  
**Derived Attributes** (computed, not stored):
- `subItemCount`: Total number of sub-items
- `completedSubItemCount`: Number of completed sub-items
- `progressPercentage`: (completedSubItemCount / subItemCount) * 100

**Constraints**:
- Maximum 100 elements per list (FR-038)
- Unique displayOrder per list
- text must not be empty (FR-033)
- text max length 500 characters (FR-035)
- List Id must reference existing list

**State Transitions**:
```
uncompleted (isCompleted=false)
  ↓ [user marks complete]
completed (isCompleted=true, all sub-items → completed)
  ↓ [user unmarks complete]
uncompleted (isCompleted=false, sub-items retain completed state)
```

### SubItem

**Description**: Granular task breakdown within an element. Maximum hierarchy depth (no further nesting).

**Attributes**:
- `id` (string, UUID): Unique identifier, primary key
- `elementId` (string, UUID): Foreign key to parent TodoElement
  - Required
  - Must reference existing element
- `text` (string): Sub-item description/subtask text
  - Required, non-empty
  - Max length: 500 characters
  - Example: "Research topic", "Create slides", "Practice delivery"
- `isCompleted` (boolean): Completion state
  - Default: false
  - Toggleable by user independently
  - Updates parent element progress indication
- `displayOrder` (integer): Position within parent element (0-based)
  - Used for custom user-defined ordering within element
  - Updated on reorder operations
- `createdAt` (timestamp): Creation timestamp (ISO 8601)
  - Auto-generated on creation
  - Immutable

**Relationships**:
- `element`: Many-to-one relationship with TodoElement
  - Sub-item belongs to exactly one element
  - elementId foreign key with CASCADE DELETE

**Constraints**:
- Maximum 20 sub-items per element (FR-039)
- Unique displayOrder per element
- text must not be empty (FR-034)
- text max length 500 characters (FR-035)
- elementId must reference existing element

**State Transitions**:
```
uncompleted (isCompleted=false)
  ↓ [user marks complete OR parent element marked complete]
completed (isCompleted=true)
  ↓ [user unmarks complete]
uncompleted (isCompleted=false)
```

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────┐
│ TodoList                                     │
│─────────────────────────────────────────────│
│ + id: UUID (PK)                              │
│ + name: string (max 500)                     │
│ + displayOrder: integer                      │
│ + createdAt: timestamp                       │
│                                              │
│ Constraints:                                 │
│   - Max 20 lists per user                    │
│   - name required, non-empty                 │
└─────────────────────────────────────────────┘
            │
            │ 1:N (CASCADE DELETE)
            │ Max 100 elements
            ▼
┌─────────────────────────────────────────────┐
│ TodoElement                                  │
│─────────────────────────────────────────────│
│ + id: UUID (PK)                              │
│ + listId: UUID (FK → TodoList.id)            │
│ + text: string (max 500)                     │
│ + isCompleted: boolean                       │
│ + displayOrder: integer                      │
│ + createdAt: timestamp                       │
│                                              │
│ Computed:                                    │
│   - subItemCount                             │
│   - completedSubItemCount                    │
│   - progressPercentage                       │
│                                              │
│ Constraints:                                 │
│   - Max 100 per list                         │
│   - text required, non-empty                 │
│   - Completion cascades to sub-items         │
└─────────────────────────────────────────────┘
            │
            │ 1:N (CASCADE DELETE)
            │ Max 20 sub-items
            ▼
┌─────────────────────────────────────────────┐
│ SubItem                                      │
│─────────────────────────────────────────────│
│ + id: UUID (PK)                              │
│ + elementId: UUID (FK → TodoElement.id)      │
│ + text: string (max 500)                     │
│ + isCompleted: boolean                       │
│ + displayOrder: integer                      │
│ + createdAt: timestamp                       │
│                                              │
│ Constraints:                                 │
│   - Max 20 per element                       │
│   - text required, non-empty                 │
│   - Independent completion state             │
└─────────────────────────────────────────────┘
```

## Validation Rules

### TodoList Validation

**Create**:
- name: Required, non-empty string, max 500 chars
- Check count: Must have < 20 existing lists (return 400 if exceeded)
- displayOrder: Auto-assigned (max existing order + 1)

**Update**:
- id: Must exist
- name: If provided, same validation as create
- displayOrder: If provided, must be integer ≥ 0

**Delete**:
- id: Must exist
- Cascades to all elements and sub-items (confirm with user in UI)

**Reorder**:
- Provide array of list IDs in new order
- All list IDs must exist and belong to user
- Update displayOrder for all affected lists atomically

### TodoElement Validation

**Create**:
- listId: Required, must reference existing list
- text: Required, non-empty string, max 500 chars
- Check count: List must have < 100 existing elements (return 400 if exceeded)
- isCompleted: Default false
- displayOrder: Auto-assigned (max existing order in list + 1)

**Update**:
- id: Must exist
- text: If provided, same validation as create
- isCompleted: If provided, must be boolean
  - If changing false → true, mark all sub-items complete (FR-041)
  - If changing true → false, sub-items retain state
- displayOrder: If provided, must be integer ≥ 0

**Delete**:
- id: Must exist
- Cascades to all sub-items (confirm with user in UI)

**Move**:
- id: Must exist (element being moved)
- targetListId: Must exist (destination list)
- Check count: Destination list must have < 100 elements (return 400 if exceeded)
- Update listId and reorder displayOrder

**Reorder**:
- listId: Must exist
- Provide array of element IDs in new order
- All element IDs must exist and belong to specified list
- Update displayOrder for all affected elements atomically

### SubItem Validation

**Create**:
- elementId: Required, must reference existing element
- text: Required, non-empty string, max 500 chars
- Check count: Element must have < 20 existing sub-items (return 400 if exceeded)
- isCompleted: Default false
- displayOrder: Auto-assigned (max existing order in element + 1)

**Update**:
- id: Must exist
- text: If provided, same validation as create
- isCompleted: If provided, must be boolean
  - Updates parent element progress (derived attribute)
- displayOrder: If provided, must be integer ≥ 0

**Delete**:
- id: Must exist
- Updates parent element progress (derived attribute)

**Reorder**:
- elementId: Must exist
- Provide array of sub-item IDs in new order
- All sub-item IDs must exist and belong to specified element
- Update displayOrder for all affected sub-items atomically

## Indexing Strategy

**Performance Optimization**:

```sql
-- Lists table indexes
CREATE INDEX idx_lists_display_order ON lists(displayOrder);

-- Elements table indexes
CREATE INDEX idx_elements_list_id ON elements(listId);
CREATE INDEX idx_elements_list_display_order ON elements(listId, displayOrder);
CREATE INDEX idx_elements_is_completed ON elements(isCompleted);

-- SubItems table indexes
CREATE INDEX idx_subitems_element_id ON sub_items(elementId);
CREATE INDEX idx_subitems_element_display_order ON sub_items(elementId, displayOrder);
CREATE INDEX idx_subitems_is_completed ON sub_items(isCompleted);
```

**Query Optimization**:
- `idx_elements_list_id`: Fast element lookup by list
- `idx_elements_list_display_order`: Ordered element retrieval
- `idx_subitems_element_id`: Fast sub-item lookup by element
- Completion indexes: Filter completed/active items efficiently

## TypeScript Type Definitions

```typescript
// Shared types between frontend and backend

export interface TodoList {
  id: string;
  name: string;
  displayOrder: number;
  createdAt: string; // ISO 8601
}

export interface TodoElement {
  id: string;
  listId: string;
  text: string;
  isCompleted: boolean;
  displayOrder: number;
  createdAt: string; // ISO 8601
  // Derived (computed on backend)
  subItemCount?: number;
  completedSubItemCount?: number;
  progressPercentage?: number;
}

export interface SubItem {
  id: string;
  elementId: string;
  text: string;
  isCompleted: boolean;
  displayOrder: number;
  createdAt: string; // ISO 8601
}

// API request types
export interface CreateListRequest {
  name: string;
}

export interface UpdateListRequest {
  name?: string;
  displayOrder?: number;
}

export interface ReorderListsRequest {
  listIds: string[];
}

export interface CreateElementRequest {
  listId: string;
  text: string;
}

export interface UpdateElementRequest {
  text?: string;
  isCompleted?: boolean;
  displayOrder?: number;
}

export interface MoveElementRequest {
  targetListId: string;
}

export interface ReorderElementsRequest {
  elementIds: string[];
}

export interface CreateSubItemRequest {
  elementId: string;
  text: string;
}

export interface UpdateSubItemRequest {
  text?: string;
  isCompleted?: boolean;
  displayOrder?: number;
}

export interface ReorderSubItemsRequest {
  subItemIds: string[];
}

// API response types
export interface ListWithElements extends TodoList {
  elements: TodoElement[];
}

export interface ElementWithSubItems extends TodoElement {
  subItems: SubItem[];
}

export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, any>;
}
```

## Offline Queue Schema

**Note**: Offline queue stored in IndexedDB (constitutional exception for sync queue)

```typescript
export interface OfflineOperation {
  id: string; // UUID
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'REORDER' | 'MOVE';
  entity: 'LIST' | 'ELEMENT' | 'SUBITEM';
  data: any; // Operation-specific payload
  timestamp: number; // Unix timestamp
  retryCount: number; // Number of retry attempts
  status: 'PENDING' | 'IN_PROGRESS' | 'FAILED';
}
```

**Operations Queue**:
- Stored in IndexedDB `offlineQueue` object store
- Processed in order (FIFO) on reconnection
- Conflicts resolved via last-write-wins
- Failed operations retained with error details

## Migration Strategy

**Initial Schema** (v1):
```sql
CREATE TABLE lists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK(length(name) > 0 AND length(name) <= 500),
  display_order INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE elements (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL,
  text TEXT NOT NULL CHECK(length(text) > 0 AND length(text) <= 500),
  is_completed INTEGER NOT NULL DEFAULT 0, -- SQLite uses 0/1 for boolean
  display_order INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
);

CREATE TABLE sub_items (
  id TEXT PRIMARY KEY,
  element_id TEXT NOT NULL,
  text TEXT NOT NULL CHECK(length(text) > 0 AND length(text) <= 500),
  is_completed INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (element_id) REFERENCES elements(id) ON DELETE CASCADE
);

-- Indexes (as defined in Indexing Strategy above)
```

**Future Migrations**: Add version tracking table for schema evolution

## Data Integrity Rules

1. **Referential Integrity**: Foreign keys enforced with CASCADE DELETE
2. **Length Constraints**: Max 500 chars for all text fields
3. **Count Constraints**: Enforced in application layer (20 lists, 100 elements, 20 sub-items)
4. **Non-Empty Text**: CHECK constraints in SQL + app validation
5. **Display Order**: Unique within scope (list, element), maintained on reorder
6. **Completion Cascading**: Parent element completion triggers sub-item completion (app logic)
7. **Immutable Timestamps**: createdAt set once, never updated

## Next Steps

- Phase 1 (current): Generate API contracts (OpenAPI spec)
- Phase 1 (current): Generate quickstart.md (dev setup instructions)
- Phase 2: Generate tasks.md (implementation task list)
