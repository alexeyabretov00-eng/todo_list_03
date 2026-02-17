import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface QueuedOperation {
  id: string;
  type: 'CREATE_LIST' | 'UPDATE_LIST' | 'DELETE_LIST' | 'CREATE_ELEMENT' | 'UPDATE_ELEMENT' | 'DELETE_ELEMENT' | 'TOGGLE_ELEMENT' | 'CREATE_SUBITEM' | 'UPDATE_SUBITEM' | 'DELETE_SUBITEM' | 'TOGGLE_SUBITEM';
  payload: any;
  timestamp: string;
  retryCount: number;
  status: 'pending' | 'processing' | 'failed';
}

interface OfflineQueueState {
  operations: QueuedOperation[];
  isOnline: boolean;
  isProcessing: boolean;
}

const initialState: OfflineQueueState = {
  operations: [],
  isOnline: navigator.onLine,
  isProcessing: false,
};

const offlineQueueSlice = createSlice({
  name: 'offlineQueue',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    addOperation: (state, action: PayloadAction<Omit<QueuedOperation, 'id' | 'timestamp' | 'retryCount' | 'status'>>) => {
      const operation: QueuedOperation = {
        ...action.payload,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        retryCount: 0,
        status: 'pending',
      };
      state.operations.push(operation);
    },
    removeOperation: (state, action: PayloadAction<string>) => {
      state.operations = state.operations.filter(op => op.id !== action.payload);
    },
    updateOperationStatus: (state, action: PayloadAction<{ id: string; status: QueuedOperation['status'] }>) => {
      const operation = state.operations.find(op => op.id === action.payload.id);
      if (operation) {
        operation.status = action.payload.status;
      }
    },
    incrementRetryCount: (state, action: PayloadAction<string>) => {
      const operation = state.operations.find(op => op.id === action.payload);
      if (operation) {
        operation.retryCount += 1;
      }
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    clearQueue: (state) => {
      state.operations = [];
    },
    clearFailedOperations: (state) => {
      state.operations = state.operations.filter(op => op.status !== 'failed');
    },
  },
});

export const {
  setOnlineStatus,
  addOperation,
  removeOperation,
  updateOperationStatus,
  incrementRetryCount,
  setProcessing,
  clearQueue,
  clearFailedOperations,
} = offlineQueueSlice.actions;

export const { reducer: offlineQueueReducer } = offlineQueueSlice;