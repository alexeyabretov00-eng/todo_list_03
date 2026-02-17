import styled from 'styled-components';

export const SubItemsListContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-left: 32px;
  border-left: 2px solid ${({ theme }) => theme.colors.border};
`;

export const EmptyMessage = styled.div`
  padding: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-style: italic;
  text-align: center;
`;
