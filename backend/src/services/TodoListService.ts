import { TodoListModel } from '../models/TodoList';
import { TodoList, TodoListWithElements } from '../types/entities';

// Validation constraints from data-model.md
const MAX_LISTS = 20;
const MAX_NAME_LENGTH = 500;

export class TodoListService {
  /**
   * Validate list name
   */
  static validateName(name: string): { valid: boolean; error?: string } {
    if (!name || name.trim() === '') {
      return { valid: false, error: 'Name is required and cannot be empty' };
    }
    
    if (name.length > MAX_NAME_LENGTH) {
      return { valid: false, error: `Name cannot exceed ${MAX_NAME_LENGTH} characters` };
    }
    
    return { valid: true };
  }

  /**
   * Create a new list with validation
   */
  static async createList(name: string): Promise<TodoList> {
    // Validate name
    const validation = this.validateName(name);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // Check list count limit
    const currentCount = TodoListModel.count();
    if (currentCount >= MAX_LISTS) {
      throw new Error(`Maximum ${MAX_LISTS} lists allowed`);
    }
    
    return TodoListModel.create(name);
  }

  /**
   * Get all lists
   */
  static async getAllLists(includeElements: boolean = false): Promise<TodoList[] | TodoListWithElements[]> {
    return TodoListModel.findAll(includeElements);
  }

  /**
   * Get a list by ID
   */
  static async getListById(id: string, includeElements: boolean = false): Promise<TodoList | TodoListWithElements | null> {
    return TodoListModel.findById(id, includeElements);
  }

  /**
   * Update a list with validation
   */
  static async updateList(id: string, updates: Partial<Pick<TodoList, 'name' | 'displayOrder'>>): Promise<TodoList | null> {
    // Validate name if provided
    if (updates.name !== undefined) {
      const validation = this.validateName(updates.name);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
    }
    
    return TodoListModel.update(id, updates);
  }

  /**
   * Delete a list
   */
  static async deleteList(id: string): Promise<boolean> {
    return TodoListModel.delete(id);
  }

  /**
   * Reorder lists
   */
  static async reorderLists(listIds: string[]): Promise<void> {
    const lists = await this.getAllLists();
    const listMap = new Map(lists.map(list => [list.id, list]));
    
    // Validate all IDs exist
    for (const id of listIds) {
      if (!listMap.has(id)) {
        throw new Error(`List with id ${id} not found`);
      }
    }
    
    // Update display orders
    for (let i = 0; i < listIds.length; i++) {
      await TodoListModel.update(listIds[i], { displayOrder: i });
    }
  }
}
