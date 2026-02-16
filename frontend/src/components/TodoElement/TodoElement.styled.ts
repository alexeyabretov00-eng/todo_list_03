import styled, { css } from 'styled-components';

export interface ElementContainerProps {
  isCompleted: boolean;
}

export const ElementContainer = styled.div<ElementContainerProps>`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 12px;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }
  
  ${({ isCompleted }) =>
    isCompleted &&
    css`
      opacity: 0.6;
      background-color: ${({ theme }) => theme.colors.secondary}50;
    `}
`;

export const ElementHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ElementCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
`;

export const ElementContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ElementText = styled.span<{ isCompleted: boolean }>`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
  
  ${({ isCompleted }) =>
    isCompleted &&
    css`
      text-decoration: line-through;
      color: ${({ theme }) => theme.colors.textSecondary};
    `}
`;

export const ElementActions = styled.div`
  display: flex;
  gap: 6px;
  margin-left: auto;
  
  button {
    padding: 4px 8px;
    font-size: 12px;
    min-height: 24px;
  }
`;

export const ElementMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  align-items: center;
`;

export const ElementMetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;
