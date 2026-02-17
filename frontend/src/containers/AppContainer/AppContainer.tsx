import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@hooks';
import { selectIsOnline, getAppContainerProps } from '@selectors';
import { TodoListsViewContainer } from '../TodoListsViewContainer';
import { ErrorBoundary } from '@components';
import { setOnlineStatus } from '@slices';
import { syncService } from '@services';
import {
  AppWrapper,
  Header,
  HeaderTitle,
  MainContent,
  StatusBar,
} from './AppContainer.styled';

export const AppContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOnline = useAppSelector(selectIsOnline);
  const pendingCount = useAppSelector(getAppContainerProps);

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
      <AppWrapper>
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
          <TodoListsViewContainer />
        </MainContent>
      </AppWrapper>
    </ErrorBoundary>
  );
};
