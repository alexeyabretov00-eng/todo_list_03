import { getDatabase, saveDatabase } from '../db/database';
import { SubItem } from '../types/entities';
import { v4 as uuidv4 } from 'uuid';

export class SubItemModel {
  /**
   * Create a new sub-item
   */
  static create(elementId: string, text: string, displayOrder?: number): SubItem {
    const db = getDatabase();
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const isCompleted = false;

    // If display order not specified, use max + 1 for this element
    if (displayOrder === undefined) {
      const result = db.exec(
        'SELECT MAX(displayOrder) as maxOrder FROM SubItem WHERE elementId = ?',
        [elementId]
      );
      const maxOrder = result[0]?.values[0]?.[0];
      displayOrder = maxOrder !== null && maxOrder !== undefined ? Number(maxOrder) + 1 : 0;
    }

    db.run(
      'INSERT INTO SubItem (id, elementId, text, isCompleted, displayOrder, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [id, elementId, text, isCompleted ? 1 : 0, displayOrder, createdAt]
    );

    saveDatabase();

    return { id, elementId, text, isCompleted, displayOrder, createdAt };
  }

  /**
   * Find all sub-items for an element
   */
  static findByElementId(elementId: string): SubItem[] {
    const db = getDatabase();
    const result = db.exec(
      'SELECT id, elementId, text, isCompleted, displayOrder, createdAt FROM SubItem WHERE elementId = ? ORDER BY displayOrder ASC',
      [elementId]
    );

    if (!result[0]) {
      return [];
    }

    return result[0].values.map((row: any[]) => ({
      id: row[0] as string,
      elementId: row[1] as string,
      text: row[2] as string,
      isCompleted: Boolean(row[3]),
      displayOrder: row[4] as number,
      createdAt: row[5] as string,
    }));
  }

  /**
   * Find a single sub-item by ID
   */
  static findById(id: string): SubItem | null {
    const db = getDatabase();
    const result = db.exec(
      'SELECT id, elementId, text, isCompleted, displayOrder, createdAt FROM SubItem WHERE id = ?',
      [id]
    );

    if (!result[0] || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      id: row[0] as string,
      elementId: row[1] as string,
      text: row[2] as string,
      isCompleted: Boolean(row[3]),
      displayOrder: row[4] as number,
      createdAt: row[5] as string,
    };
  }

  /**
   * Update a sub-item
   */
  static update(id: string, updates: Partial<SubItem>): SubItem | null {
    const db = getDatabase();
    const subItem = this.findById(id);

    if (!subItem) {
      return null;
    }

    const updated = { ...subItem, ...updates };
    
    db.run(
      'UPDATE SubItem SET text = ?, isCompleted = ? WHERE id = ?',
      [updates.text || subItem.text, updates.isCompleted !== undefined ? (updates.isCompleted ? 1 : 0) : (subItem.isCompleted ? 1 : 0), id]
    );

    saveDatabase();

    return updated;
  }

  /**
   * Update sub-item completion state
   */
  static toggleCompletion(id: string, isCompleted: boolean): SubItem | null {
    const db = getDatabase();
    const subItem = this.findById(id);

    if (!subItem) {
      return null;
    }

    db.run(
      'UPDATE SubItem SET isCompleted = ? WHERE id = ?',
      [isCompleted ? 1 : 0, id]
    );

    saveDatabase();

    return { ...subItem, isCompleted };
  }

  /**
   * Delete a sub-item
   */
  static delete(id: string): boolean {
    const db = getDatabase();
    const subItem = this.findById(id);

    if (!subItem) {
      return false;
    }

    db.run('DELETE FROM SubItem WHERE id = ?', [id]);
    saveDatabase();

    return true;
  }

  /**
   * Delete all sub-items for an element (cascade)
   */
  static deleteByElementId(elementId: string): boolean {
    const db = getDatabase();
    db.run('DELETE FROM SubItem WHERE elementId = ?', [elementId]);
    saveDatabase();
    return true;
  }

  /**
   * Reorder sub-items
   */
  static reorder(elementId: string, orderedIds: string[]): boolean {
    const db = getDatabase();

    try {
      orderedIds.forEach((id, index) => {
        db.run(
          'UPDATE SubItem SET displayOrder = ? WHERE id = ? AND elementId = ?',
          [index, id, elementId]
        );
      });

      saveDatabase();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get sub-item count for an element
   */
  static countByElementId(elementId: string): number {
    const db = getDatabase();
    const result = db.exec(
      'SELECT COUNT(*) as count FROM SubItem WHERE elementId = ?',
      [elementId]
    );

    if (!result[0] || result[0].values.length === 0) {
      return 0;
    }

    return result[0].values[0][0] as number;
  }

  /**
   * Get completed sub-item count for an element
   */
  static countCompletedByElementId(elementId: string): number {
    const db = getDatabase();
    const result = db.exec(
      'SELECT COUNT(*) as count FROM SubItem WHERE elementId = ? AND isCompleted = 1',
      [elementId]
    );

    if (!result[0] || result[0].values.length === 0) {
      return 0;
    }

    return result[0].values[0][0] as number;
  }

  /**
   * Mark all sub-items as completed for an element
   */
  static completeAllByElementId(elementId: string): boolean {
    const db = getDatabase();
    db.run(
      'UPDATE SubItem SET isCompleted = 1 WHERE elementId = ?',
      [elementId]
    );
    saveDatabase();
    return true;
  }
}
