import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@hooks';
import { TodoListsView } from '../TodoListsView';
import { setOnlineStatus } from '@slices';
import { syncService } from '@services';
import {
  AppContainer,
  Header,
  HeaderTitle,
  MainContent,
  StatusBar,
  ErrorBoundaryContainer,
  ErrorTitle,
  ErrorMessage,
} from './App.styled';

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
