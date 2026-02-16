import { configureStore } from '@reduxjs/toolkit';
import listsReducer from './slices/listsSlice';
import elementsReducer from './slices/elementsSlice';
import offlineQueueReducer from './slices/offlineQueueSlice';

export const store = configureStore({
  reducer: {
    lists: listsReducer,
    elements: elementsReducer,
    offlineQueue: offlineQueueReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
