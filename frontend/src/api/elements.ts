import { apiClient } from './client';
import { TodoElement, TodoElementWithSubItems } from '../types/entities';

export interface CreateElementDto {
  text: string;
}

export interface UpdateElementDto {
  text?: string;
  isCompleted?: boolean;
  displayOrder?: number;
}

export const elementsApi = {
  /**
   * Get all elements for a list
   */
  getElementsByListId: async (listId: string, includeSubItems: boolean = false): Promise<TodoElement[]> => {
    return apiClient.get<TodoElement[]>(`/lists/${listId}/elements?includeSubItems=${includeSubItems}`);
  },

  /**
   * Get a single element by id
   */
  getElementById: async (id: string, includeSubItems: boolean = false): Promise<TodoElementWithSubItems> => {
    return apiClient.get<TodoElementWithSubItems>(`/elements/${id}?includeSubItems=${includeSubItems}`);
  },

  /**
   * Create a new element
   */
  createElement: async (listId: string, data: CreateElementDto): Promise<TodoElement> => {
    return apiClient.post<TodoElement>(`/lists/${listId}/elements`, data);
  },

  /**
   * Update an element
   */
  updateElement: async (id: string, data: UpdateElementDto): Promise<TodoElement> => {
    return apiClient.put<TodoElement>(`/elements/${id}`, data);
  },

  /**
   * Delete an element
   */
  deleteElement: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/elements/${id}`);
  },

  /**
   * Toggle element completion
   */
  toggleElementComplete: async (id: string, isCompleted: boolean): Promise<TodoElement> => {
    return apiClient.put<TodoElement>(`/elements/${id}/complete`, { isCompleted });
  },
};
