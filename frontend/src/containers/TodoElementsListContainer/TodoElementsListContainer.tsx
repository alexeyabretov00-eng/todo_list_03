import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@hooks';
import {
  getTodoElementsListContainerProps,
} from '@selectors';
import {
  fetchElements,
  createElement,
  updateElement,
  deleteElement,
  toggleElementComplete,
} from '@slices';
import { TodoElement, EmptyState } from '@components';
import { CreateElementFormContainer } from '../CreateElementFormContainer';
import {
  ListContainer,
  ListHeader,
  ListTitle,
  ElementsContainer,
  LoadingMessage,
  ErrorMessage,
  Stats,
  StatItem,
} from './TodoElementsListContainer.styled';

export const TodoElementsListContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    listId,
    elements: listElements,
    selectedList,
    completedCount,
    loading,
    error,
  } = useAppSelector(getTodoElementsListContainerProps);
  const { items: subItems } = useAppSelector((state) => state.subItems);
  const [localError, setLocalError] = useState<string | null>(null);
  const [expandedElementIds, setExpandedElementIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (listId) {
      dispatch(fetchElements(listId));
    }
  }, [dispatch, listId]);

  const handleCreateElement = async (text: string) => {
    if (!listId) return;
    
    try {
      setLocalError(null);
      await dispatch(createElement({ listId, data: { text } })).unwrap();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to create element');
    }
  };

  const handleToggleComplete = async (elementId: string, isCompleted: boolean) => {
    try {
      setLocalError(null);
      await dispatch(toggleElementComplete({ id: elementId, isCompleted })).unwrap();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to update element');
    }
  };

  const handleUpdateElement = async (elementId: string, text: string) => {
    try {
      setLocalError(null);
      await dispatch(updateElement({ id: elementId, data: { text } })).unwrap();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to update element');
    }
  };

  const handleDeleteElement = async (elementId: string) => {
    if (!window.confirm('Are you sure you want to delete this element?')) {
      return;
    }

    try {
      setLocalError(null);
      await dispatch(deleteElement(elementId)).unwrap();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to delete element');
    }
  };

  const handleToggleExpand = (elementId: string) => {
    const newExpandedIds = new Set(expandedElementIds);
    if (newExpandedIds.has(elementId)) {
      newExpandedIds.delete(elementId);
    } else {
      newExpandedIds.add(elementId);
    }
    setExpandedElementIds(newExpandedIds);
  };

  if (loading && listElements.length === 0) {
    return <LoadingMessage>Loading elements...</LoadingMessage>;
  }

  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>{selectedList?.name || 'Todo Elements'}</ListTitle>
        <CreateElementFormContainer onSubmit={handleCreateElement} />
      </ListHeader>

      {listElements.length > 0 && (
        <Stats>
          <StatItem>Total: {listElements.length}</StatItem>
          <StatItem>Completed: {completedCount}</StatItem>
          <StatItem>Remaining: {listElements.length - completedCount}</StatItem>
        </Stats>
      )}

      {(error || localError) && <ErrorMessage>{error || localError}</ErrorMessage>}

      {listElements.length === 0 ? (
        <EmptyState
          title="No elements yet"
          description="Add your first todo element to this list"
        />
      ) : (
        <ElementsContainer>
          {listElements.map((element) => {
            const elementSubItems = subItems.filter((si) => si.elementId === element.id);
            const completedSubItems = elementSubItems.filter((si) => si.isCompleted).length;
            
            return (
            <TodoElement
              key={element.id}
              element={element}
              subItemCount={elementSubItems.length}
              completedSubItemCount={completedSubItems}
              onToggleComplete={(id: string, isCompleted: boolean) => handleToggleComplete(element.id, isCompleted)}
              onEdit={(id: string, text: string) => handleUpdateElement(element.id, text)}
              onDelete={(id: string) => handleDeleteElement(element.id)}
              onToggleExpand={handleToggleExpand}
              isExpanded={expandedElementIds.has(element.id)}
            />
          );
          })}
        </ElementsContainer>
      )}
    </ListContainer>
  );
};
