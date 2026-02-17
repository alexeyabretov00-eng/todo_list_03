import React, { useState } from 'react';
import { TodoElement as TodoElementType } from '@types';
import { Button } from '../Button';
import { Input } from '../Input';
import {
  ElementContainer,
  ElementHeader,
  ElementCheckbox,
  ElementContent,
  ElementText,
  ElementActions,
  ElementMeta,
  ElementMetaItem,
} from './TodoElement.styled';

interface Props {
  element: TodoElementType;
  onToggleComplete?: (id: string, isCompleted: boolean) => void;
  onEdit?: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const TodoElement: React.FC<Props> = ({
  element,
  onToggleComplete,
  onEdit,
  onDelete,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(element.text);

  const handleToggle = () => {
    if (onToggleComplete) {
      onToggleComplete(element.id, !element.isCompleted);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onEdit && editText.trim()) {
      onEdit(element.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(element.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`Delete "${element.text}"?`)) {
      onDelete(element.id);
    }
  };

  return (
    <ElementContainer isCompleted={element.isCompleted} className={className}>
      <ElementHeader>
        <ElementCheckbox
          type="checkbox"
          checked={element.isCompleted}
          onChange={handleToggle}
        />
        <ElementContent>
          {isEditing ? (
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              fullWidth
              maxLength={500}
            />
          ) : (
            <ElementText isCompleted={element.isCompleted}>{element.text}</ElementText>
          )}
          <ElementMeta>
            <ElementMetaItem>
              📅 {new Date(element.createdAt).toLocaleDateString()}
            </ElementMetaItem>
          </ElementMeta>
        </ElementContent>
        <ElementActions>
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
        </ElementActions>
      </ElementHeader>
    </ElementContainer>
  );
};
