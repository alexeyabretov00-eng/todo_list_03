import styled from 'styled-components';

export const ErrorBoundaryContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

export const ErrorTitle = styled.h2`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;
