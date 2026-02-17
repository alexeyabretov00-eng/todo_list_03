import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@hooks';
import { getTodoListsViewContainerProps } from '@selectors';
import { fetchLists, createList, deleteList, updateList, fetchElements } from '@slices';
import { TodoListCard, EmptyState } from '@components';
import { CreateListFormContainer } from '../CreateListFormContainer';
import { TodoElementsListContainer } from '../TodoElementsListContainer';
import {
  ViewContainer,
  Section,
  SectionTitle,
  ListsGrid,
  LoadingMessage,
  ErrorMessage,
  Divider,
} from './TodoListsViewContainer.styled';

export const TodoListsViewContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { lists, loading, error, selectedListId } = useAppSelector(getTodoListsViewContainerProps);
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
        <CreateListFormContainer onSubmit={handleCreateList} />
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
          <TodoElementsListContainer listId={selectedListId} />
        </>
      )}
    </ViewContainer>
  );
};
