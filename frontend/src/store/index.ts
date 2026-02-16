import { configureStore } from '@reduxjs/toolkit';

// Slice imports will be added in future tasks
// import listsReducer from './slices/listsSlice';
// import appReducer from './slices/appSlice';

export const store = configureStore({
  reducer: {
    // Reducers will be added in Phase 3-7
    // lists: listsReducer,
    // app: appReducer,
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
