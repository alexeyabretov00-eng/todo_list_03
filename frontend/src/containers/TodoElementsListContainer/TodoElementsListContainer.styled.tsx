import styled from 'styled-components';

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const ListHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ListTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const ElementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

export const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const Stats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const StatItem = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;
