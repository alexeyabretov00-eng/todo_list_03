export interface OfflineOperation {
  id: string;
  type: 'CREATE_LIST' | 'UPDATE_LIST' | 'DELETE_LIST' | 'CREATE_ELEMENT' | 'UPDATE_ELEMENT' | 'DELETE_ELEMENT' | 'TOGGLE_ELEMENT';
  payload: any;
  timestamp: string;
  retryCount: number;
  status: 'pending' | 'processing' | 'failed';
}

export interface OfflineQueue {
  operations: OfflineOperation[];
  isProcessing: boolean;
  isOnline: boolean;
}
