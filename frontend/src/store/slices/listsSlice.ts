import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TodoList } from '../types/entities';
import { listsApi, CreateListDto, UpdateListDto } from '../api/lists';
import { v4 as uuidv4 } from 'uuid';

interface ListsState {
  items: TodoList[];
  loading: boolean;
  error: string | null;
  selectedListId: string | null;
}

const initialState: ListsState = {
  items: [],
  loading: false,
  error: null,
  selectedListId: null,
};

// Async thunks
export const fetchLists = createAsyncThunk(
  'lists/fetchLists',
  async (includeElements: boolean = false) => {
    return await listsApi.getAllLists(includeElements);
  }
);

export const createList = createAsyncThunk(
  'lists/createList',
  async (data: CreateListDto, { rejectWithValue }) => {
    try {
      return await listsApi.createList(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create list');
    }
  }
);

export const updateList = createAsyncThunk(
  'lists/updateList',
  async ({ id, data }: { id: string; data: UpdateListDto }, { rejectWithValue }) => {
    try {
      return await listsApi.updateList(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update list');
    }
  }
);

export const deleteList = createAsyncThunk(
  'lists/deleteList',
  async (id: string, { rejectWithValue }) => {
    try {
      await listsApi.deleteList(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete list');
    }
  }
);

export const reorderLists = createAsyncThunk(
  'lists/reorderLists',
  async (listIds: string[], { rejectWithValue }) => {
    try {
      await listsApi.reorderLists(listIds);
      return listIds;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reorder lists');
    }
  }
);

// Slice
const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    selectList: (state, action: PayloadAction<string | null>) => {
      state.selectedListId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Optimistic create
    optimisticCreateList: (state, action: PayloadAction<CreateListDto>) => {
      const tempId = `temp-${uuidv4()}`;
      const newList: TodoList = {
        id: tempId,
        name: action.payload.name,
        displayOrder: state.items.length,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newList);
    },
    // Optimistic update
    optimisticUpdateList: (state, action: PayloadAction<{ id: string; data: UpdateListDto }>) => {
      const index = state.items.findIndex(list => list.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
      }
    },
    // Optimistic delete
    optimisticDeleteList: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(list => list.id !== action.payload);
      if (state.selectedListId === action.payload) {
        state.selectedListId = null;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch lists
    builder.addCase(fetchLists.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchLists.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchLists.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch lists';
    });

    // Create list
    builder.addCase(createList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createList.fulfilled, (state, action) => {
      state.loading = false;
      // Remove temp item and add real one
      state.items = state.items.filter(list => !list.id.startsWith('temp-'));
      state.items.push(action.payload);
    });
    builder.addCase(createList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // Remove temp item on error
      state.items = state.items.filter(list => !list.id.startsWith('temp-'));
    });

    // Update list
    builder.addCase(updateList.fulfilled, (state, action) => {
      const index = state.items.findIndex(list => list.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    builder.addCase(updateList.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Delete list
    builder.addCase(deleteList.fulfilled, (state, action) => {
      state.items = state.items.filter(list => list.id !== action.payload);
      if (state.selectedListId === action.payload) {
        state.selectedListId = null;
      }
    });
    builder.addCase(deleteList.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Reorder lists
    builder.addCase(reorderLists.fulfilled, (state, action) => {
      const orderMap = new Map(action.payload.map((id, index) => [id, index]));
      state.items.sort((a, b) => {
        const orderA = orderMap.get(a.id) ?? a.displayOrder;
        const orderB = orderMap.get(b.id) ?? b.displayOrder;
        return orderA - orderB;
      });
      // Update displayOrder
      state.items.forEach((list, index) => {
        list.displayOrder = index;
      });
    });
  },
});

export const {
  selectList,
  clearError,
  optimisticCreateList,
  optimisticUpdateList,
  optimisticDeleteList,
} = listsSlice.actions;

export default listsSlice.reducer;
