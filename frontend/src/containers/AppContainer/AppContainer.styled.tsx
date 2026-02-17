import styled from 'styled-components';

export const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverse};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

export const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

export const StatusBar = styled.div<{ isOnline: boolean }>`
  background-color: ${({ isOnline, theme }) =>
    isOnline ? theme.colors.success : theme.colors.warning};
  color: ${({ theme }) => theme.colors.textInverse};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;
