import { store } from '@/store/index';
import {
  removeOperation,
  updateOperationStatus,
  incrementRetryCount,
  setProcessing,
  QueuedOperation,
} from '@/store/slices/offlineQueueSlice';
import { fetchLists } from '@/store/slices/listsSlice';
import { offlineStorage } from './offlineStorage';
import { listsApi } from '@/api/lists';
import { elementsApi } from '@/api/elements';

const MAX_RETRY_COUNT = 3;

class SyncService {
  private isProcessing = false;

  /**
   * Start processing the offline queue
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing) {
      console.log('Queue processing already in progress');
      return;
    }

    if (!navigator.onLine) {
      console.log('Cannot process queue while offline');
      return;
    }

    this.isProcessing = true;
    store.dispatch(setProcessing(true));

    try {
      const operations = await offlineStorage.getOperations();
      console.log(`Processing ${operations.length} queued operations`);

      for (const operation of operations) {
        try {
          await this.processOperation(operation);
          // Remove from queue after successful processing
          await offlineStorage.removeOperation(operation.id);
          store.dispatch(removeOperation(operation.id));
        } catch (error) {
          console.error(`Failed to process operation ${operation.id}:`, error);
          
          // Increment retry count
          store.dispatch(incrementRetryCount(operation.id));
          
          // Mark as failed if max retries exceeded
          if (operation.retryCount >= MAX_RETRY_COUNT) {
            store.dispatch(updateOperationStatus({ id: operation.id, status: 'failed' }));
          }
        }
      }

      // After processing all operations, refresh data from server
      await store.dispatch(fetchLists(false));
    } finally {
      this.isProcessing = false;
      store.dispatch(setProcessing(false));
    }
  }

  /**
   * Process a single queued operation
   */
  private async processOperation(operation: QueuedOperation): Promise<void> {
    store.dispatch(updateOperationStatus({ id: operation.id, status: 'processing' }));

    switch (operation.type) {
      case 'CREATE_LIST':
        await listsApi.createList(operation.payload);
        break;
      
      case 'UPDATE_LIST':
        await listsApi.updateList(operation.payload.id, operation.payload.data);
        break;
      
      case 'DELETE_LIST':
        await listsApi.deleteList(operation.payload.id);
        break;
      
      case 'CREATE_ELEMENT':
        await elementsApi.createElement(operation.payload.listId, operation.payload.data);
        break;
      
      case 'UPDATE_ELEMENT':
        await elementsApi.updateElement(operation.payload.id, operation.payload.data);
        break;
      
      case 'DELETE_ELEMENT':
        await elementsApi.deleteElement(operation.payload.id);
        break;
      
      case 'TOGGLE_ELEMENT':
        await elementsApi.toggleElementComplete(operation.payload.id, operation.payload.isCompleted);
        break;
      
      default:
        console.warn(`Unknown operation type: ${(operation as any).type}`);
    }
  }

  /**
   * Setup automatic sync on connectivity restore
   */
  setupAutoSync(): void {
    window.addEventListener('online', () => {
      console.log('Connection restored, processing offline queue');
      this.processQueue();
    });
  }
}

export const syncService = new SyncService();
