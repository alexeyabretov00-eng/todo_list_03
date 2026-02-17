import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store';
import {
  selectElementsItems,
  selectElements,
  selectListsItems,
  selectLists,
  selectOperations,
} from './base';

// TodoElementsList container selectors
export const selectListElements = (listId: string) => (state: RootState) =>
  selectElementsItems(state).filter((el) => el.listId === listId);

export const selectSelectedList = (listId: string) => (state: RootState) =>
  selectListsItems(state).find((list) => list.id === listId);

export const selectListCompletedCount = (listId: string) => (state: RootState) => {
  const elements = selectElementsItems(state).filter((el) => el.listId === listId);
  return elements.filter((el) => el.isCompleted).length;
};

export const selectListElementsWithStats = (listId: string) =>
  createSelector(
    [selectElements, selectListsItems],
    (elementsState, lists) => {
      const listElements = elementsState.items.filter((el) => el.listId === listId);
      const selectedList = lists.find((list) => list.id === listId);
      const completedCount = listElements.filter((el) => el.isCompleted).length;
      
      return {
        elements: listElements,
        selectedList,
        completedCount,
        loading: elementsState.loading,
        error: elementsState.error,
      };
    }
  );

// TodoListsView container selectors
export const selectListsViewData = createSelector(
  [selectLists],
  (listsState) => ({
    lists: listsState.items,
    loading: listsState.loading,
    error: listsState.error,
    selectedListId: listsState.selectedListId,
  })
);

// App container selectors
export const selectPendingOperationsCount = createSelector(
  [selectOperations],
  (operations) => operations.filter((op) => op.status === 'pending').length
);
