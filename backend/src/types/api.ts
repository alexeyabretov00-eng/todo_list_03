// Request types
export interface CreateListRequest {
  name: string;
}

export interface UpdateListRequest {
  name: string;
}

export interface ReorderListsRequest {
  listIds: string[];
}

export interface CreateElementRequest {
  text: string;
}

export interface UpdateElementRequest {
  text: string;
}

export interface CompleteElementRequest {
  isCompleted: boolean;
}

export interface MoveElementRequest {
  targetListId: string;
  targetDisplayOrder: number;
}

export interface ReorderElementsRequest {
  elementIds: string[];
}

export interface CreateSubItemRequest {
  text: string;
}

export interface UpdateSubItemRequest {
  text: string;
}

export interface CompleteSubItemRequest {
  isCompleted: boolean;
}

export interface ReorderSubItemsRequest {
  subItemIds: string[];
}

// Response types
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export interface ValidationErrorResponse extends ErrorResponse {
  errors: Array<{
    field: string;
    message: string;
  }>;
}
