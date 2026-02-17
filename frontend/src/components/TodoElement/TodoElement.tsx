import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { TodoElement as TodoElementType } from '@types';
import { SubItemsListContainer, CreateSubItemFormContainer } from '@containers';
import {
  ElementContainer,
  ElementHeader,
  ElementCheckbox,
  ElementContent,
  ElementText,
  ElementActions,
  ElementMeta,
  ElementMetaItem,
  ExpandButton,
  ProgressIndicator,
  SubItemsIndicator,
} from './TodoElement.styled';

interface Props {
  element: TodoElementType;
  subItemCount?: number;
  completedSubItemCount?: number;
  onToggleComplete?: (id: string, isCompleted: boolean) => void;
  onEdit?: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
  onToggleExpand?: (id: string) => void;
  isExpanded?: boolean;
  className?: string;
}

export const TodoElement: React.FC<Props> = ({
  element,
  subItemCount = 0,
  completedSubItemCount = 0,
  onToggleComplete,
  onEdit,
  onDelete,
  onToggleExpand,
  isExpanded = false,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(element.text);
  const hasSubItems = subItemCount > 0;

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

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand(element.id);
    }
  };

  return (
    <ElementContainer isCompleted={element.isCompleted} className={className}>
      <ElementHeader>
        <ExpandButton
          onClick={handleToggleExpand}
          aria-label={isExpanded ? 'Collapse sub-items' : 'Expand sub-items'}
          data-testid={`expand-button-${element.id}`}
        >
          {isExpanded ? <DownOutlined /> : <RightOutlined />}
        </ExpandButton>
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
              maxLength={500}
            />
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ElementText isCompleted={element.isCompleted}>{element.text}</ElementText>
                {hasSubItems && (
                  <>
                    <SubItemsIndicator title={`${subItemCount} sub-items`} data-testid={`subitems-indicator-${element.id}`}>
                      ◆
                    </SubItemsIndicator>
                    <ProgressIndicator data-testid={`progress-indicator-${element.id}`}>
                      {completedSubItemCount}/{subItemCount}
                    </ProgressIndicator>
                  </>
                )}
              </div>
              <ElementMeta>
                <ElementMetaItem>
                  📅 {new Date(element.createdAt).toLocaleDateString()}
                </ElementMetaItem>
              </ElementMeta>
            </>
          )}
        </ElementContent>
        <ElementActions>
          {isEditing ? (
            <>
              <Button type="primary" size="small" onClick={handleSave}>
                Save
              </Button>
              <Button size="small" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="small" onClick={handleEdit}>
                Edit
              </Button>
              <Button danger size="small" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </ElementActions>
      </ElementHeader>
      {isExpanded && hasSubItems && <SubItemsListContainer elementId={element.id} />}
      {isExpanded && <CreateSubItemFormContainer elementId={element.id} />}
    </ElementContainer>
  );
};
