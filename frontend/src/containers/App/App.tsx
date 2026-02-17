import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@hooks';
import { TodoListsView } from '../TodoListsView';
import { setOnlineStatus } from '@slices';
import { syncService } from '@services';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverse};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const StatusBar = styled.div<{ isOnline: boolean }>`
  background-color: ${({ isOnline, theme }) =>
    isOnline ? theme.colors.success : theme.colors.warning};
  color: ${({ theme }) => theme.colors.textInverse};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ErrorBoundaryContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            {this.state.error?.message || 'An unexpected error occurred'}
          </ErrorMessage>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </ErrorBoundaryContainer>
      );
    }

    return this.props.children;
  }
}

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOnline, operations } = useAppSelector((state) => state.offlineQueue);
  const pendingCount = operations.filter(op => op.status === 'pending').length;

  useEffect(() => {
    // Initialize sync service
    syncService.setupAutoSync();

    const handleOnline = () => {
      dispatch(setOnlineStatus(true));
    };
    const handleOffline = () => {
      dispatch(setOnlineStatus(false));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <AppContainer>
        <Header>
          <HeaderTitle>Todo List Manager</HeaderTitle>
        </Header>
        {!isOnline && (
          <StatusBar isOnline={false}>
            You are currently offline. Changes will sync when connection is restored.
            {pendingCount > 0 && ` (${pendingCount} pending operations)`}
          </StatusBar>
        )}
        <MainContent>
          <TodoListsView />
        </MainContent>
      </AppContainer>
    </ErrorBoundary>
  );
};
