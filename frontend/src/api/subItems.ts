import { apiClient } from './client';
import { SubItem } from '@types';

export interface CreateSubItemDto {
  text: string;
}

export interface UpdateSubItemDto {
  text?: string;
  isCompleted?: boolean;
  displayOrder?: number;
}

export const subItemsApi = {
  /**
   * Get all sub-items for an element
   */
  getSubItemsByElementId: async (elementId: string): Promise<SubItem[]> => {
    return apiClient.get<SubItem[]>(`/elements/${elementId}/subitems`);
  },

  /**
   * Get a single sub-item by id
   */
  getSubItem: async (id: string): Promise<SubItem> => {
    return apiClient.get<SubItem>(`/subitems/${id}`);
  },

  /**
   * Create a new sub-item
   */
  createSubItem: async (elementId: string, data: CreateSubItemDto): Promise<SubItem> => {
    return apiClient.post<SubItem>(`/elements/${elementId}/subitems`, data);
  },

  /**
   * Update a sub-item
   */
  updateSubItem: async (id: string, data: UpdateSubItemDto): Promise<SubItem> => {
    return apiClient.put<SubItem>(`/subitems/${id}`, data);
  },

  /**
   * Delete a sub-item
   */
  deleteSubItem: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/subitems/${id}`);
  },

  /**
   * Toggle sub-item completion
   */
  toggleSubItemComplete: async (id: string, isCompleted: boolean): Promise<SubItem> => {
    return apiClient.put<SubItem>(`/subitems/${id}/complete`, { isCompleted });
  },
};
