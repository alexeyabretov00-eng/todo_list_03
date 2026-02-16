import styled from 'styled-components';

export const ListCardContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const ListCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const ListCardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ListCardActions = styled.div`
  display: flex;
  gap: 8px;
  
  button {
    padding: 4px 8px;
    font-size: 12px;
    min-height: 28px;
  }
`;

export const ListCardStats = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ListCardStat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ListCardIcon = styled.span`
  font-size: 16px;
`;
