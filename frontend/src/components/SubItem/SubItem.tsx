import React, { useState } from 'react';
import { SubItem as SubItemType } from '@types';
import { SubItemContainer, SubItemCheckbox, SubItemText, SubItemActions, DeleteButton } from './SubItem.styled';

interface SubItemProps {
  subItem: SubItemType;
  onToggleComplete: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, text: string) => void;
  isLoading?: boolean;
}

export const SubItem: React.FC<SubItemProps> = ({
  subItem,
  onToggleComplete,
  onDelete,
  onEdit,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(subItem.text);

  const handleToggle = () => {
    onToggleComplete(subItem.id, !subItem.isCompleted);
  };

  const handleDelete = () => {
    onDelete(subItem.id);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && onEdit) {
      onEdit(subItem.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(subItem.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <SubItemContainer data-testid={`subitem-${subItem.id}`}>
      <SubItemCheckbox
        type="checkbox"
        checked={subItem.isCompleted}
        onChange={handleToggle}
        disabled={isLoading || isEditing}
        aria-label={`Toggle sub-item: ${subItem.text}`}
        data-testid={`subitem-checkbox-${subItem.id}`}
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveEdit}
          autoFocus
          data-testid={`subitem-edit-input-${subItem.id}`}
        />
      ) : (
        <SubItemText isCompleted={subItem.isCompleted} data-testid={`subitem-text-${subItem.id}`}>
          {subItem.text}
        </SubItemText>
      )}
      <SubItemActions>
        {!isEditing && (
          <>
            {onEdit && (
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                aria-label={`Edit sub-item: ${subItem.text}`}
                data-testid={`subitem-edit-btn-${subItem.id}`}
              >
                Edit
              </button>
            )}
            <DeleteButton
              onClick={handleDelete}
              disabled={isLoading}
              aria-label={`Delete sub-item: ${subItem.text}`}
              data-testid={`subitem-delete-btn-${subItem.id}`}
            >
              Delete
            </DeleteButton>
          </>
        )}
        {isEditing && (
          <>
            <button
              onClick={handleSaveEdit}
              disabled={!editText.trim()}
              data-testid={`subitem-save-btn-${subItem.id}`}
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              data-testid={`subitem-cancel-btn-${subItem.id}`}
            >
              Cancel
            </button>
          </>
        )}
      </SubItemActions>
    </SubItemContainer>
  );
};

export default SubItem;
