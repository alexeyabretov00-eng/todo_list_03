-- Migration: v1 - Initial schema
-- Create TodoList table
CREATE TABLE IF NOT EXISTS TodoList (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK(length(name) > 0 AND length(name) <= 500),
  displayOrder INTEGER NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(displayOrder)
);

-- Create TodoElement table
CREATE TABLE IF NOT EXISTS TodoElement (
  id TEXT PRIMARY KEY,
  listId TEXT NOT NULL,
  text TEXT NOT NULL CHECK(length(text) > 0 AND length(text) <= 500),
  isCompleted INTEGER NOT NULL DEFAULT 0 CHECK(isCompleted IN (0, 1)),
  displayOrder INTEGER NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (listId) REFERENCES TodoList(id) ON DELETE CASCADE,
  UNIQUE(listId, displayOrder)
);

-- Create SubItem table
CREATE TABLE IF NOT EXISTS SubItem (
  id TEXT PRIMARY KEY,
  elementId TEXT NOT NULL,
  text TEXT NOT NULL CHECK(length(text) > 0 AND length(text) <= 500),
  isCompleted INTEGER NOT NULL DEFAULT 0 CHECK(isCompleted IN (0, 1)),
  displayOrder INTEGER NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (elementId) REFERENCES TodoElement(id) ON DELETE CASCADE,
  UNIQUE(elementId, displayOrder)
);

-- Create indexes for foreign keys and ordering
CREATE INDEX IF NOT EXISTS idx_element_listId ON TodoElement(listId);
CREATE INDEX IF NOT EXISTS idx_element_displayOrder ON TodoElement(listId, displayOrder);
CREATE INDEX IF NOT EXISTS idx_subitem_elementId ON SubItem(elementId);
CREATE INDEX IF NOT EXISTS idx_subitem_displayOrder ON SubItem(elementId, displayOrder);
CREATE INDEX IF NOT EXISTS idx_list_displayOrder ON TodoList(displayOrder);
CREATE INDEX IF NOT EXISTS idx_element_completed ON TodoElement(isCompleted);
