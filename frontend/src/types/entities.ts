// Entity Types (matching backend)
export interface TodoList {
  id: string;
  name: string;
  displayOrder: number;
  createdAt: string;
}

export interface TodoElement {
  id: string;
  listId: string;
  text: string;
  isCompleted: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface SubItem {
  id: string;
  elementId: string;
  text: string;
  isCompleted: boolean;
  displayOrder: number;
  createdAt: string;
}

// Extended types with computed fields
export interface TodoElementWithProgress extends TodoElement {
  subItemCount: number;
  completedSubItemCount: number;
}

export interface TodoListWithElements extends TodoList {
  elements?: TodoElement[];
}

export interface TodoElementWithSubItems extends TodoElement {
  subItems?: SubItem[];
}

// UI state types
export interface AppState {
  isOnline: boolean;
  pendingOperations: number;
  lastSyncTime: string | null;
}
