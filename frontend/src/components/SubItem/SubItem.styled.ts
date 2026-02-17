import styled from 'styled-components';

export const SubItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px 8px 32px;
  border-left: 3px solid ${({ theme }) => theme.colors.border};
  margin-left: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

export const SubItemCheckbox = styled.input`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const SubItemText = styled.span<{ isCompleted: boolean }>`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ isCompleted, theme }) =>
    isCompleted ? theme.colors.textSecondary : theme.colors.text};
  text-decoration: ${({ isCompleted }) => (isCompleted ? 'line-through' : 'none')};
  transition: all 0.2s ease-in-out;
  font-size: 0.95rem;
`;

export const SubItemActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  & > button {
    padding: 4px 8px;
    font-size: 0.85rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primary};
      color: white;
      border-color: ${({ theme }) => theme.colors.primary};
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
`;

export const DeleteButton = styled.button`
  padding: 4px 8px;
  font-size: 0.85rem;
  border: 1px solid ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.error};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.error};
    color: white;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
