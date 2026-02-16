export enum OperationType {
  CREATE_LIST = 'CREATE_LIST',
  UPDATE_LIST = 'UPDATE_LIST',
  DELETE_LIST = 'DELETE_LIST',
  REORDER_LISTS = 'REORDER_LISTS',
  CREATE_ELEMENT = 'CREATE_ELEMENT',
  UPDATE_ELEMENT = 'UPDATE_ELEMENT',
  DELETE_ELEMENT = 'DELETE_ELEMENT',
  COMPLETE_ELEMENT = 'COMPLETE_ELEMENT',
  MOVE_ELEMENT = 'MOVE_ELEMENT',
  REORDER_ELEMENTS = 'REORDER_ELEMENTS',
  CREATE_SUBITEM = 'CREATE_SUBITEM',
  UPDATE_SUBITEM = 'UPDATE_SUBITEM',
  DELETE_SUBITEM = 'DELETE_SUBITEM',
  COMPLETE_SUBITEM = 'COMPLETE_SUBITEM',
  REORDER_SUBITEMS = 'REORDER_SUBITEMS',
}

export interface OfflineOperation {
  id: string;
  type: OperationType;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  payload?: any;
  timestamp: number;
  retries: number;
}

export interface OfflineQueue {
  operations: OfflineOperation[];
  isProcessing: boolean;
}
