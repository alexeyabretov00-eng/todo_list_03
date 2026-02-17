import { RootState } from '@store';

// Elements selectors
export const selectElements = (state: RootState) => state.elements;
export const selectElementsItems = (state: RootState) => state.elements.items;
export const selectElementsLoading = (state: RootState) => state.elements.loading;
export const selectElementsError = (state: RootState) => state.elements.error;

// Lists selectors
export const selectLists = (state: RootState) => state.lists;
export const selectListsItems = (state: RootState) => state.lists.items;
export const selectListsLoading = (state: RootState) => state.lists.loading;
export const selectListsError = (state: RootState) => state.lists.error;
export const selectSelectedListId = (state: RootState) => state.lists.selectedListId;

// Offline Queue selectors
export const selectOfflineQueue = (state: RootState) => state.offlineQueue;
export const selectIsOnline = (state: RootState) => state.offlineQueue.isOnline;
export const selectOperations = (state: RootState) => state.offlineQueue.operations;
export const selectIsProcessing = (state: RootState) => state.offlineQueue.isProcessing;
