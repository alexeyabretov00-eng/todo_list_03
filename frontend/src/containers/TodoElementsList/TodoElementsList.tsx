import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import {
  fetchElements,
  createElement,
  updateElement,
  deleteElement,
  toggleElementComplete,
} from '@/store/slices/elementsSlice';
import { TodoElement } from '@/components/TodoElement';
import { CreateElementForm } from '../CreateElementForm';
import { EmptyState } from '@/components/EmptyState';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ListHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ListTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ElementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const Stats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatItem = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

interface Props {
  listId: string;
}

export const TodoElementsList: React.FC<Props> = ({ listId }) => {
  const dispatch = useAppDispatch();
  const { items: elements, loading, error } = useAppSelector((state) => state.elements);
  const lists = useAppSelector((state) => state.lists.items);
  const [localError, setLocalError] = useState<string | null>(null);

  const selectedList = lists.find((list) => list.id === listId);
  const listElements = elements.filter((el) => el.listId === listId);
  const completedCount = listElements.filter((el) => el.isCompleted).length;

  useEffect(() => {
    if (listId) {
      dispatch(fetchElements(listId));
    }
  }, [dispatch, listId]);

  const handleCreateElement = async (text: string) => {
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

  if (loading && listElements.length === 0) {
    return <LoadingMessage>Loading elements...</LoadingMessage>;
  }

  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>{selectedList?.name || 'Todo Elements'}</ListTitle>
        <CreateElementForm onSubmit={handleCreateElement} />
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
          {listElements.map((element) => (
            <TodoElement
              key={element.id}
              element={element}
              onToggleComplete={(id: string, isCompleted: boolean) => handleToggleComplete(element.id, isCompleted)}
              onEdit={(id: string, text: string) => handleUpdateElement(element.id, text)}
              onDelete={(id: string) => handleDeleteElement(element.id)}
            />
          ))}
        </ElementsContainer>
      )}
    </ListContainer>
  );
};
