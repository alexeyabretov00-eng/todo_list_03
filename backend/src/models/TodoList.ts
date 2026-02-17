import { getDatabase, saveDatabase } from '../db/database';
import { TodoList, TodoListWithElements } from '../types/entities';
import { v4 as uuidv4 } from 'uuid';

export class TodoListModel {
  /**
   * Create a new todo list
   */
  static create(name: string, displayOrder?: number): TodoList {
    const db = getDatabase();
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    
    // If display not specified, use max + 1
    if (displayOrder === undefined) {
      const result = db.exec('SELECT MAX(displayOrder) as maxOrder FROM TodoList');
      const maxOrder = result[0]?.values[0]?.[0];
      displayOrder = maxOrder !== null && maxOrder !== undefined ? Number(maxOrder) + 1 : 0;
    }
    
    db.run(
      'INSERT INTO TodoList (id, name, displayOrder, createdAt) VALUES (?, ?, ?, ?)',
      [id, name, displayOrder, createdAt]
    );
    
    saveDatabase();
    
    return { id, name, displayOrder, createdAt };
  }

  /**
   * Find all todo lists
   */
  static findAll(includeElements: boolean = false): TodoList[] | TodoListWithElements[] {
    const db = getDatabase();
    const result = db.exec('SELECT id, name, displayOrder, createdAt FROM TodoList ORDER BY displayOrder ASC');
    
    if (!result[0]) {
      return [];
    }
    
    const lists = result[0].values.map((row: any[]) => ({
      id: row[0] as string,
      name: row[1] as string,
      displayOrder: row[2] as number,
      createdAt: row[3] as string,
    }));
    
    if (includeElements) {
      return lists.map((list: TodoList) => ({
        ...list,
        elements: this.getElements(list.id),
      }));
    }
    
    return lists;
  }

  /**
   * Find a single todo list by ID
   */
  static findById(id: string, includeElements: boolean = false): TodoList | TodoListWithElements | null {
    const db = getDatabase();
    const result = db.exec('SELECT id, name, displayOrder, createdAt FROM TodoList WHERE id = ?', [id]);
    
    if (!result[0] || result[0].values.length === 0) {
      return null;
    }
    
    const row = result[0].values[0];
    const list: TodoList = {
      id: row[0] as string,
      name: row[1] as string,
      displayOrder: row[2] as number,
      createdAt: row[3] as string,
    };
    
    if (includeElements) {
      return {
        ...list,
        elements: this.getElements(id),
      };
    }
    
    return list;
  }

  /**
   * Update a todo list
   */
  static update(id: string, updates: Partial<Pick<TodoList, 'name' | 'displayOrder'>>): TodoList | null {
    const existing = this.findById(id);
    if (!existing) {
      return null;
    }
    
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    
    if (updates.displayOrder !== undefined) {
      fields.push('displayOrder = ?');
      values.push(updates.displayOrder);
    }
    
    if (fields.length === 0) {
      return existing;
    }
    
    values.push(id);
    db.run(`UPDATE TodoList SET ${fields.join(', ')} WHERE id = ?`, values);
    saveDatabase();
    
    return this.findById(id) as TodoList;
  }

  /**
   * Delete a todo list (CASCADE deletes elements and sub-items)
   */
  static delete(id: string): boolean {
    const existing = this.findById(id);
    if (!existing) {
      return false;
    }
    
    const db = getDatabase();
    // Foreign key constraints will handle CASCADE delete
    db.run('DELETE FROM TodoList WHERE id = ?', [id]);
    saveDatabase();
    
    return true;
  }

  /**
   * Get count of lists
   */
  static count(): number {
    const db = getDatabase();
    const result = db.exec('SELECT COUNT(*) as count FROM TodoList');
    return result[0]?.values[0]?.[0] as number || 0;
  }

  /**
   * Helper to get elements for a list
   */
  private static getElements(listId: string): any[] {
    const db = getDatabase();
    const result = db.exec(
      'SELECT id, listId, text, isCompleted, displayOrder, createdAt FROM TodoElement WHERE listId = ? ORDER BY displayOrder ASC',
      [listId]
    );
    
    if (!result[0]) {
      return [];
    }
    
    return result[0].values.map((row: any[]) => ({
      id: row[0] as string,
      listId: row[1] as string,
      text: row[2] as string,
      isCompleted: Boolean(row[3]),
      displayOrder: row[4] as number,
      createdAt: row[5] as string,
    }));
  }
}
