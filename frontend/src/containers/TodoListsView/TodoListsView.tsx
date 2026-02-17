import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '@hooks';
import { fetchLists, createList, deleteList, updateList, fetchElements } from '@slices';
import { TodoListCard, EmptyState } from '@components';
import { CreateListForm } from '../CreateListForm';
import { TodoElementsList } from '../TodoElementsList';

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ListsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

export const TodoListsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: lists, loading, error, selectedListId } = useAppSelector((state) => state.lists);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchLists(false));
  }, [dispatch]);

  const handleCreateList = async (name: string) => {
    try {
      setLocalError(null);
      await dispatch(createList({ name })).unwrap();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to create list');
    }
  };

  const handleSelectList = (listId: string) => {
    dispatch(fetchElements(listId));
  };

  const handleUpdateList = async (listId: string, name: string) => {
    try {
      setLocalError(null);
      await dispatch(updateList({ id: listId, data: { name } })).unwrap();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to update list');
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!window.confirm('Are you sure you want to delete this list? This will also delete all its elements.')) {
      return;
    }
    
    try {
      setLocalError(null);
      await dispatch(deleteList(listId)).unwrap();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to delete list');
    }
  };

  if (loading && lists.length === 0) {
    return <LoadingMessage>Loading lists...</LoadingMessage>;
  }

  return (
    <ViewContainer>
      <Section>
        <SectionTitle>Create New List</SectionTitle>
        <CreateListForm onSubmit={handleCreateList} />
      </Section>

      {(error || localError) && (
        <ErrorMessage>{error || localError}</ErrorMessage>
      )}

      <Section>
        <SectionTitle>Your Lists ({lists.length})</SectionTitle>
        {lists.length === 0 ? (
          <EmptyState
            title="No lists yet"
            description="Create your first todo list to get started"
          />
        ) : (
          <ListsGrid>
            {lists.map((list) => (
              <TodoListCard
                key={list.id}
                list={list}
              onClick={() => handleSelectList(list.id)}
              onEdit={(id: string, name: string) => handleUpdateList(list.id, name)}
              onDelete={(id: string) => handleDeleteList(list.id)}
              />
            ))}
          </ListsGrid>
        )}
      </Section>

      {selectedListId && (
        <>
          <Divider />
          <TodoElementsList listId={selectedListId} />
        </>
      )}
    </ViewContainer>
  );
};
