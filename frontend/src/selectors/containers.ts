import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store';
import {
  selectElementsItems,
  selectElements,
  selectListsItems,
  selectLists,
  selectOperations,
} from './base';

// TodoElementsListContainer selector
export const getTodoElementsListContainerProps = (listId: string) =>
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

// TodoListsViewContainer selector
export const getTodoListsViewContainerProps = createSelector(
  [selectLists],
  (listsState) => ({
    lists: listsState.items,
    loading: listsState.loading,
    error: listsState.error,
    selectedListId: listsState.selectedListId,
  })
);

// AppContainer selector
export const getAppContainerProps = createSelector(
  [selectOperations],
  (operations) => operations.filter((op) => op.status === 'pending').length
);
