import { configureStore } from '@reduxjs/toolkit';
import { listsReducer, elementsReducer, offlineQueueReducer, subItemsReducer } from '@slices';

export const store = configureStore({
  reducer: {
    lists: listsReducer,
    elements: elementsReducer,
    subItems: subItemsReducer,
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
