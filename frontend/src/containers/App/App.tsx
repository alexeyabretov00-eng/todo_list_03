import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@hooks';
import { TodoListsView } from '../TodoListsView';
import { ErrorBoundary } from '@components';
import { setOnlineStatus } from '@slices';
import { syncService } from '@services';
import {
  AppContainer,
  Header,
  HeaderTitle,
  MainContent,
  StatusBar,
} from './App.styled';

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
