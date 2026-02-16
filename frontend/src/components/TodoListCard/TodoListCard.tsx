import React, { useState } from 'react';
import { TodoList } from '@/types/entities';
import { Button } from '../Button';
import { Input } from '../Input';
import {
  ListCardContainer,
  ListCardHeader,
  ListCardTitle,
  ListCardActions,
  ListCardStats,
  ListCardStat,
  ListCardIcon,
} from './TodoListCard.styled';

interface Props {
  list: TodoList;
  elementCount?: number;
  onClick?: () => void;
  onEdit?: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const TodoListCard: React.FC<Props> = ({
  list,
  elementCount = 0,
  onClick,
  onEdit,
  onDelete,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(list.name);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit && editName.trim()) {
      onEdit(list.id, editName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(list.name);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm(`Delete "${list.name}"? This will also delete all its elements.`)) {
      onDelete(list.id);
    }
  };

  const handleCardClick = () => {
    if (!isEditing && onClick) {
      onClick();
    }
  };

  return (
    <ListCardContainer onClick={handleCardClick} className={className}>
      <ListCardHeader>
        {isEditing ? (
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
              maxLength={500}
            />
          </div>
        ) : (
          <ListCardTitle>{list.name}</ListCardTitle>
        )}
        <ListCardActions onClick={(e) => e.stopPropagation()}>
          {isEditing ? (
            <>
              <Button variant="primary" size="small" onClick={handleSave}>
                Save
              </Button>
              <Button variant="ghost" size="small" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="small" onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="danger" size="small" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </ListCardActions>
      </ListCardHeader>
      <ListCardStats>
        <ListCardStat>
          <ListCardIcon>📋</ListCardIcon>
          <span>{elementCount} {elementCount === 1 ? 'item' : 'items'}</span>
        </ListCardStat>
        <ListCardStat>
          <ListCardIcon>📅</ListCardIcon>
          <span>{new Date(list.createdAt).toLocaleDateString()}</span>
        </ListCardStat>
      </ListCardStats>
    </ListCardContainer>
  );
};
