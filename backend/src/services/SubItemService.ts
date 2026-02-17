import { SubItemModel } from '../models/SubItem';
import { TodoElementModel } from '../models/TodoElement';
import { SubItem } from '../types/entities';

// Validation constraints from data-model.md
const MAX_SUBITEMS_PER_ELEMENT = 20;
const MAX_TEXT_LENGTH = 500;

export class SubItemService {
  /**
   * Validate sub-item text
   */
  static validateText(text: string): { valid: boolean; error?: string } {
    if (!text || text.trim() === '') {
      return { valid: false, error: 'Text is required and cannot be empty' };
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return { valid: false, error: `Text cannot exceed ${MAX_TEXT_LENGTH} characters` };
    }

    return { valid: true };
  }

  /**
   * Create a new sub-item with validation
   */
  static async createSubItem(elementId: string, text: string): Promise<SubItem> {
    // Validate element exists
    const element = TodoElementModel.findById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Validate text
    const validation = this.validateText(text);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Check sub-item count limit
    const currentCount = SubItemModel.countByElementId(elementId);
    if (currentCount >= MAX_SUBITEMS_PER_ELEMENT) {
      throw new Error(`Maximum ${MAX_SUBITEMS_PER_ELEMENT} sub-items per element allowed`);
    }

    return SubItemModel.create(elementId, text);
  }

  /**
   * Get all sub-items for an element
   */
  static async getSubItemsByElementId(elementId: string): Promise<SubItem[]> {
    // Validate element exists
    const element = TodoElementModel.findById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    return SubItemModel.findByElementId(elementId);
  }

  /**
   * Get a sub-item by ID
   */
  static async getSubItem(id: string): Promise<SubItem | null> {
    return SubItemModel.findById(id);
  }

  /**
   * Update a sub-item with validation
   */
  static async updateSubItem(
    id: string,
    updates: Partial<Pick<SubItem, 'text' | 'isCompleted' | 'displayOrder'>>
  ): Promise<SubItem | null> {
    // Validate text if provided
    if (updates.text !== undefined) {
      const validation = this.validateText(updates.text);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
    }

    return SubItemModel.update(id, updates);
  }

  /**
   * Delete a sub-item
   */
  static async deleteSubItem(id: string): Promise<boolean> {
    return SubItemModel.delete(id);
  }

  /**
   * Toggle sub-item completion
   */
  static async toggleSubItemComplete(id: string, isCompleted: boolean): Promise<SubItem | null> {
    return SubItemModel.toggleCompletion(id, isCompleted);
  }

  /**
   * Reorder sub-items within an element
   */
  static async reorderSubItems(elementId: string, orderedIds: string[]): Promise<boolean> {
    // Validate element exists
    const element = TodoElementModel.findById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Validate all IDs belong to this element
    for (const id of orderedIds) {
      const subItem = SubItemModel.findById(id);
      if (!subItem || subItem.elementId !== elementId) {
        throw new Error('Invalid sub-item ID or sub-item does not belong to element');
      }
    }

    return SubItemModel.reorder(elementId, orderedIds);
  }

  /**
   * Mark all sub-items as completed for an element (when parent is completed)
   */
  static async completeAllSubItems(elementId: string): Promise<boolean> {
    // Validate element exists
    const element = TodoElementModel.findById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    return SubItemModel.completeAllByElementId(elementId);
  }

  /**
   * Get sub-item count for an element
   */
  static async getSubItemCount(elementId: string): Promise<number> {
    return SubItemModel.countByElementId(elementId);
  }

  /**
   * Get completed sub-item count for an element
   */
  static async getCompletedSubItemCount(elementId: string): Promise<number> {
    return SubItemModel.countCompletedByElementId(elementId);
  }
}
