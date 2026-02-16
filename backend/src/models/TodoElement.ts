import { getDatabase, saveDatabase } from '../db/database';
import { TodoElement, TodoElementWithSubItems } from '../types/entities';
import { v4 as uuidv4 } from 'uuid';

export class TodoElementModel {
  /**
   * Create a new todo element
   */
  static create(listId: string, text: string, displayOrder?: number): TodoElement {
    const db = getDatabase();
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const isCompleted = false;
    
    // If display order not specified, use max + 1 for this list
    if (displayOrder === undefined) {
      const result = db.exec(
        'SELECT MAX(displayOrder) as maxOrder FROM TodoElement WHERE listId = ?',
        [listId]
      );
      displayOrder = result[0]?.values[0]?.[0] ? Number(result[0].values[0][0]) + 1 : 0;
    }
    
    db.run(
      'INSERT INTO TodoElement (id, listId, text, isCompleted, displayOrder, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [id, listId, text, isCompleted ? 1 : 0, displayOrder, createdAt]
    );
    
    saveDatabase();
    
    return { id, listId, text, isCompleted, displayOrder, createdAt };
  }

  /**
   * Find all elements for a list
   */
  static findByListId(listId: string, includeSubItems: boolean = false): TodoElement[] | TodoElementWithSubItems[] {
    const db = getDatabase();
    const result = db.exec(
      'SELECT id, listId, text, isCompleted, displayOrder, createdAt FROM TodoElement WHERE listId = ? ORDER BY displayOrder ASC',
      [listId]
    );
    
    if (!result[0]) {
      return [];
    }
    
    const elements = result[0].values.map(row => ({
      id: row[0] as string,
      listId: row[1] as string,
      text: row[2] as string,
      isCompleted: Boolean(row[3]),
      displayOrder: row[4] as number,
      createdAt: row[5] as string,
    }));
    
    if (includeSubItems) {
      return elements.map(element => ({
        ...element,
        subItems: this.getSubItems(element.id),
      }));
    }
    
    return elements;
  }

  /**
   * Find a single element by ID
   */
  static findById(id: string, includeSubItems: boolean = false): TodoElement | TodoElementWithSubItems | null {
    const db = getDatabase();
    const result = db.exec(
      'SELECT id, listId, text, isCompleted, displayOrder, createdAt FROM TodoElement WHERE id = ?',
      [id]
    );
    
    if (!result[0] || result[0].values.length === 0) {
      return null;
    }
    
    const row = result[0].values[0];
    const element: TodoElement = {
      id: row[0] as string,
      listId: row[1] as string,
      text: row[2] as string,
      isCompleted: Boolean(row[3]),
      displayOrder: row[4] as number,
      createdAt: row[5] as string,
    };
    
    if (includeSubItems) {
      return {
        ...element,
        subItems: this.getSubItems(id),
      };
    }
    
    return element;
  }

  /**
   * Update a todo element
   */
  static update(id: string, updates: Partial<Pick<TodoElement, 'text' | 'isCompleted' | 'displayOrder'>>): TodoElement | null {
    const existing = this.findById(id);
    if (!existing) {
      return null;
    }
    
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.text !== undefined) {
      fields.push('text = ?');
      values.push(updates.text);
    }
    
    if (updates.isCompleted !== undefined) {
      fields.push('isCompleted = ?');
      values.push(updates.isCompleted ? 1 : 0);
      
      // If marking as complete, mark all sub-items as complete
      if (updates.isCompleted) {
        db.run(
          'UPDATE SubItem SET isCompleted = 1 WHERE elementId = ?',
          [id]
        );
      }
    }
    
    if (updates.displayOrder !== undefined) {
      fields.push('displayOrder = ?');
      values.push(updates.displayOrder);
    }
    
    if (fields.length === 0) {
      return existing;
    }
    
    values.push(id);
    db.run(`UPDATE TodoElement SET ${fields.join(', ')} WHERE id = ?`, values);
    saveDatabase();
    
    return this.findById(id) as TodoElement;
  }

  /**
   * Delete a todo element (CASCADE deletes sub-items)
   */
  static delete(id: string): boolean {
    const existing = this.findById(id);
    if (!existing) {
      return false;
    }
    
    const db = getDatabase();
    // Foreign key constraints will handle CASCADE delete
    db.run('DELETE FROM TodoElement WHERE id = ?', [id]);
    saveDatabase();
    
    return true;
  }

  /**
   * Count elements in a list
   */
  static countByListId(listId: string): number {
    const db = getDatabase();
    const result = db.exec(
      'SELECT COUNT(*) as count FROM TodoElement WHERE listId = ?',
      [listId]
    );
    return result[0]?.values[0]?.[0] as number || 0;
  }

  /**
   * Toggle element completion (convenience method)
   */
  static toggleComplete(id: string, isCompleted: boolean): TodoElement | null {
    return this.update(id, { isCompleted });
  }

  /**
   * Helper to get sub-items for an element
   */
  private static getSubItems(elementId: string): any[] {
    const db = getDatabase();
    const result = db.exec(
      'SELECT id, elementId, text, isCompleted, displayOrder, createdAt FROM SubItem WHERE elementId = ? ORDER BY displayOrder ASC',
      [elementId]
    );
    
    if (!result[0]) {
      return [];
    }
    
    return result[0].values.map(row => ({
      id: row[0] as string,
      elementId: row[1] as string,
      text: row[2] as string,
      isCompleted: Boolean(row[3]),
      displayOrder: row[4] as number,
      createdAt: row[5] as string,
    }));
  }
}
