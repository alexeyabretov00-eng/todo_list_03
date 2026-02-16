import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TodoElement } from '@/types/entities';
import { elementsApi, CreateElementDto, UpdateElementDto } from '@/api/elements';
import { v4 as uuidv4 } from 'uuid';

interface ElementsState {
  items: TodoElement[];
  loading: boolean;
  error: string | null;
}

const initialState: ElementsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchElements = createAsyncThunk(
  'elements/fetchElements',
  async (listId: string) => {
    return await elementsApi.getElementsByListId(listId, false);
  }
);

export const createElement = createAsyncThunk(
  'elements/createElement',
  async ({ listId, data }: { listId: string; data: CreateElementDto }, { rejectWithValue }) => {
    try {
      return await elementsApi.createElement(listId, data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create element');
    }
  }
);

export const updateElement = createAsyncThunk(
  'elements/updateElement',
  async ({ id, data }: { id: string; data: UpdateElementDto }, { rejectWithValue }) => {
    try {
      return await elementsApi.updateElement(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update element');
    }
  }
);

export const deleteElement = createAsyncThunk(
  'elements/deleteElement',
  async (id: string, { rejectWithValue }) => {
    try {
      await elementsApi.deleteElement(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete element');
    }
  }
);

export const toggleElementComplete = createAsyncThunk(
  'elements/toggleElementComplete',
  async ({ id, isCompleted }: { id: string; isCompleted: boolean }, { rejectWithValue }) => {
    try {
      return await elementsApi.toggleElementComplete(id, isCompleted);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle element completion');
    }
  }
);

// Slice
const elementsSlice = createSlice({
  name: 'elements',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearElements: (state) => {
      state.items = [];
    },
    // Optimistic create
    optimisticCreateElement: (state, action: PayloadAction<{ listId: string; data: CreateElementDto }>) => {
      const tempId = `temp-${uuidv4()}`;
      const newElement: TodoElement = {
        id: tempId,
        listId: action.payload.listId,
        text: action.payload.data.text,
        isCompleted: false,
        displayOrder: state.items.filter(el => el.listId === action.payload.listId).length,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newElement);
    },
    // Optimistic update
    optimisticUpdateElement: (state, action: PayloadAction<{ id: string; data: UpdateElementDto }>) => {
      const index = state.items.findIndex(el => el.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
      }
    },
    // Optimistic delete
    optimisticDeleteElement: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(el => el.id !== action.payload);
    },
    // Optimistic toggle
    optimisticToggleComplete: (state, action: PayloadAction<{ id: string; isCompleted: boolean }>) => {
      const index = state.items.findIndex(el => el.id === action.payload.id);
      if (index !== -1) {
        state.items[index].isCompleted = action.payload.isCompleted;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch elements
    builder.addCase(fetchElements.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchElements.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchElements.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch elements';
    });

    // Create element
    builder.addCase(createElement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createElement.fulfilled, (state, action) => {
      state.loading = false;
      // Remove temp item and add real one
      state.items = state.items.filter(el => !el.id.startsWith('temp-'));
      state.items.push(action.payload);
    });
    builder.addCase(createElement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // Remove temp item on error
      state.items = state.items.filter(el => !el.id.startsWith('temp-'));
    });

    // Update element
    builder.addCase(updateElement.fulfilled, (state, action) => {
      const index = state.items.findIndex(el => el.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    builder.addCase(updateElement.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Delete element
    builder.addCase(deleteElement.fulfilled, (state, action) => {
      state.items = state.items.filter(el => el.id !== action.payload);
    });
    builder.addCase(deleteElement.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Toggle complete
    builder.addCase(toggleElementComplete.fulfilled, (state, action) => {
      const index = state.items.findIndex(el => el.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    builder.addCase(toggleElementComplete.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const {
  clearError,
  clearElements,
  optimisticCreateElement,
  optimisticUpdateElement,
  optimisticDeleteElement,
  optimisticToggleComplete,
} = elementsSlice.actions;

export default elementsSlice.reducer;
