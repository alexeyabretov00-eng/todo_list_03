import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks';
import { fetchSubItems, deleteSubItem, toggleSubItemComplete } from '@slices';
import { SubItem } from '@components';
import { SubItemsListContainerStyled, EmptyMessage } from './SubItemsListContainer.styled';

interface SubItemsListContainerProps {
  elementId: string;
}

export const SubItemsListContainer: React.FC<SubItemsListContainerProps> = ({ elementId }) => {
  const dispatch = useAppDispatch();
  const { items: subItems, loading, error } = useAppSelector((state) => state.subItems);
  
  // Filter sub-items for this element
  const elementSubItems = subItems.filter((si) => si.elementId === elementId);

  useEffect(() => {
    if (elementId) {
      dispatch(fetchSubItems(elementId));
    }
  }, [elementId, dispatch]);

  const handleDelete = (subItemId: string) => {
    if (window.confirm('Delete this sub-item?')) {
      dispatch(deleteSubItem(subItemId));
    }
  };

  const handleToggleComplete = (subItemId: string, isCompleted: boolean) => {
    dispatch(toggleSubItemComplete({ id: subItemId, isCompleted }));
  };

  if (loading && elementSubItems.length === 0) {
    return (
      <SubItemsListContainerStyled>
        <EmptyMessage>Loading sub-items...</EmptyMessage>
      </SubItemsListContainerStyled>
    );
  }

  if (error) {
    return (
      <SubItemsListContainerStyled>
        <EmptyMessage>Error loading sub-items: {error}</EmptyMessage>
      </SubItemsListContainerStyled>
    );
  }

  if (elementSubItems.length === 0) {
    return (
      <SubItemsListContainerStyled>
        <EmptyMessage>No sub-items yet</EmptyMessage>
      </SubItemsListContainerStyled>
    );
  }

  return (
    <SubItemsListContainerStyled>
      {elementSubItems.map((subItem) => (
        <SubItem
          key={subItem.id}
          subItem={subItem}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
          isLoading={loading}
        />
      ))}
    </SubItemsListContainerStyled>
  );
};
