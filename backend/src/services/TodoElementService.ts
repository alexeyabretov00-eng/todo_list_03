import { TodoElementModel } from '../models/TodoElement';
import { TodoListModel } from '../models/TodoList';
import { SubItemModel } from '../models/SubItem';
import { TodoElement, TodoElementWithSubItems } from '../types/entities';

// Validation constraints from data-model.md
const MAX_ELEMENTS_PER_LIST = 100;
const MAX_TEXT_LENGTH = 500;

export class TodoElementService {
  /**
   * Validate element text
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
   * Create a new element with validation
   */
  static async createElement(listId: string, text: string): Promise<TodoElement> {
    // Validate list exists
    const list = TodoListModel.findById(listId);
    if (!list) {
      throw new Error('List not found');
    }
    
    // Validate text
    const validation = this.validateText(text);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // Check element count limit
    const currentCount = TodoElementModel.countByListId(listId);
    if (currentCount >= MAX_ELEMENTS_PER_LIST) {
      throw new Error(`Maximum ${MAX_ELEMENTS_PER_LIST} elements per list allowed`);
    }
    
    return TodoElementModel.create(listId, text);
  }

  /**
   * Get all elements for a list
   */
  static async getElementsByListId(listId: string, includeSubItems: boolean = false): Promise<TodoElement[] | TodoElementWithSubItems[]> {
    // Validate list exists
    const list = TodoListModel.findById(listId);
    if (!list) {
      throw new Error('List not found');
    }
    
    return TodoElementModel.findByListId(listId, includeSubItems);
  }

  /**
   * Get an element by ID
   */
  static async getElementById(id: string, includeSubItems: boolean = false): Promise<TodoElement | TodoElementWithSubItems | null> {
    return TodoElementModel.findById(id, includeSubItems);
  }

  /**
   * Update an element with validation
   */
  static async updateElement(id: string, updates: Partial<Pick<TodoElement, 'text' | 'isCompleted' | 'displayOrder'>>): Promise<TodoElement | null> {
    // Validate text if provided
    if (updates.text !== undefined) {
      const validation = this.validateText(updates.text);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
    }
    
    return TodoElementModel.update(id, updates);
  }

  /**
   * Delete an element
   */
  static async deleteElement(id: string): Promise<boolean> {
    return TodoElementModel.delete(id);
  }

  /**
   * Toggle element completion
   */
  /**
   * Toggle element completion status
   * When marking as complete, automatically completes all sub-items (cascade)
   */
  static async toggleElementComplete(id: string, isCompleted: boolean): Promise<TodoElement | null> {
    const element = TodoElementModel.toggleComplete(id, isCompleted);
    
    // If marking as complete, cascade completion to all sub-items
    if (isCompleted && element) {
      SubItemModel.completeAllByElementId(id);
    }
    
    return element;
  }

  /**
   * Reorder elements within a list
   */
  static async reorderElements(listId: string, elementIds: string[]): Promise<void> {
    const elements = await this.getElementsByListId(listId);
    const elementMap = new Map(elements.map(el => [el.id, el]));
    
    // Validate all IDs exist and belong to the list
    for (const id of elementIds) {
      if (!elementMap.has(id)) {
        throw new Error(`Element with id ${id} not found in list`);
      }
    }
    
    // Update display orders
    for (let i = 0; i < elementIds.length; i++) {
      await TodoElementModel.update(elementIds[i], { displayOrder: i });
    }
  }
}
