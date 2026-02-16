import { apiClient } from './client';
import { TodoList, TodoListWithElements } from '../types/entities';

export interface CreateListDto {
  name: string;
}

export interface UpdateListDto {
  name?: string;
  displayOrder?: number;
}

export const listsApi = {
  /**
   * Get all todo lists
   */
  getAllLists: async (includeElements: boolean = false): Promise<TodoList[]> => {
    return apiClient.get<TodoList[]>(`/lists?includeElements=${includeElements}`);
  },

  /**
   * Get a single list by id
   */
  getListById: async (id: string, includeElements: boolean = false): Promise<TodoListWithElements> => {
    return apiClient.get<TodoListWithElements>(`/lists/${id}?includeElements=${includeElements}`);
  },

  /**
   * Create a new list
   */
  createList: async (data: CreateListDto): Promise<TodoList> => {
    return apiClient.post<TodoList>('/lists', data);
  },

  /**
   * Update a list
   */
  updateList: async (id: string, data: UpdateListDto): Promise<TodoList> => {
    return apiClient.put<TodoList>(`/lists/${id}`, data);
  },

  /**
   * Delete a list
   */
  deleteList: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/lists/${id}`);
  },

  /**
   * Reorder lists
   */
  reorderLists: async (listIds: string[]): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>('/lists/reorder', { listIds });
  },
};
