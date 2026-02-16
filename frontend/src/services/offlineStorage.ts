import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { OfflineOperation } from '@/types/offlineQueue';

interface TodoDB extends DBSchema {
  offlineQueue: {
    key: string;
    value: OfflineOperation;
    indexes: { 'by-timestamp': number };
  };
}

const DB_NAME = 'todo-app-db';
const DB_VERSION = 1;

class OfflineStorageService {
  private db: IDBPDatabase<TodoDB> | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<TodoDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create offline queue store
        const queueStore = db.createObjectStore('offlineQueue', {
          keyPath: 'id',
        });
        queueStore.createIndex('by-timestamp', 'timestamp');
      },
    });
  }

  async addOperation(operation: OfflineOperation): Promise<void> {
    await this.init();
    await this.db!.add('offlineQueue', operation);
  }

  async getOperations(): Promise<OfflineOperation[]> {
    await this.init();
    return this.db!.getAllFromIndex('offlineQueue', 'by-timestamp');
  }

  async removeOperation(id: string): Promise<void> {
    await this.init();
    await this.db!.delete('offlineQueue', id);
  }

  async clearOperations(): Promise<void> {
    await this.init();
    await this.db!.clear('offlineQueue');
  }

  async getOperationCount(): Promise<number> {
    await this.init();
    return this.db!.count('offlineQueue');
  }
}

export const offlineStorage = new OfflineStorageService();
