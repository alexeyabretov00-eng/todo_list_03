import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store';
import {
  selectElementsItems,
  selectElements,
  selectListsItems,
  selectLists,
  selectOperations,
  selectElementsLoading,
  selectElementsError,
  selectSelectedListId,
} from './base';

// TodoElementsListContainer selector
export const getTodoElementsListContainerProps = createSelector(
  [
    selectElementsItems,
    selectListsItems,
    selectElementsLoading,
    selectElementsError,
    selectSelectedListId,
  ],
  (elementsItems, lists, loading, error, selectedListId) => {
    if (!selectedListId) {
      return {
        listId: null,
        elements: [],
        selectedList: undefined,
        completedCount: 0,
        loading,
        error,
      };
    }

    const listElements = elementsItems.filter((el) => el.listId === selectedListId);
    const selectedList = lists.find((list) => list.id === selectedListId);
    const completedCount = listElements.filter((el) => el.isCompleted).length;
    
    return {
      listId: selectedListId,
      elements: listElements,
      selectedList,
      completedCount,
      loading,
      error,
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
