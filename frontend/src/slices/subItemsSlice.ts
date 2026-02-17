import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SubItem } from '@types';
import { subItemsApi, CreateSubItemDto, UpdateSubItemDto } from '@api';
import { v4 as uuidv4 } from 'uuid';
interface SubItemsState {
  items: SubItem[];
  loading: boolean;
  error: string | null;
}

const initialState: SubItemsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchSubItems = createAsyncThunk(
  'subItems/fetchSubItems',
  async (elementId: string, { rejectWithValue }) => {
    try {
      return await subItemsApi.getSubItemsByElementId(elementId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch sub-items');
    }
  }
);

export const createSubItem = createAsyncThunk(
  'subItems/createSubItem',
  async ({ elementId, text }: { elementId: string; text: string }, { rejectWithValue }) => {
    try {
      return await subItemsApi.createSubItem(elementId, { text });
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create sub-item');
    }
  }
);

export const updateSubItem = createAsyncThunk(
  'subItems/updateSubItem',
  async ({ id, data }: { id: string; data: UpdateSubItemDto }, { rejectWithValue }) => {
    try {
      return await subItemsApi.updateSubItem(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update sub-item');
    }
  }
);

export const deleteSubItem = createAsyncThunk(
  'subItems/deleteSubItem',
  async (id: string, { rejectWithValue }) => {
    try {
      await subItemsApi.deleteSubItem(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete sub-item');
    }
  }
);

export const toggleSubItemComplete = createAsyncThunk(
  'subItems/toggleSubItemComplete',
  async ({ id, isCompleted }: { id: string; isCompleted: boolean }, { rejectWithValue }) => {
    try {
      return await subItemsApi.toggleSubItemComplete(id, isCompleted);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle sub-item completion');
    }
  }
);

// Slice
const subItemsSlice = createSlice({
  name: 'subItems',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSubItems: (state) => {
      state.items = [];
    },
    // Optimistic create
    optimisticCreateSubItem: (state, action: PayloadAction<{ elementId: string; text: string }>) => {
      const tempId = `temp-${uuidv4()}`;
      const newSubItem: SubItem = {
        id: tempId,
        elementId: action.payload.elementId,
        text: action.payload.text,
        isCompleted: false,
        displayOrder: state.items.filter(si => si.elementId === action.payload.elementId).length,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newSubItem);
    },
    // Optimistic update
    optimisticUpdateSubItem: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const index = state.items.findIndex(si => si.id === action.payload.id);
      if (index !== -1) {
        state.items[index].text = action.payload.text;
      }
    },
    // Optimistic delete
    optimisticDeleteSubItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(si => si.id !== action.payload);
    },
    // Optimistic toggle
    optimisticToggleComplete: (state, action: PayloadAction<{ id: string; isCompleted: boolean }>) => {
      const index = state.items.findIndex(si => si.id === action.payload.id);
      if (index !== -1) {
        state.items[index].isCompleted = action.payload.isCompleted;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch sub-items
    builder.addCase(fetchSubItems.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSubItems.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchSubItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create sub-item
    builder.addCase(createSubItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSubItem.fulfilled, (state, action) => {
      state.loading = false;
      // Remove temp item and add real one
      state.items = state.items.filter(si => !si.id.startsWith('temp-'));
      state.items.push(action.payload);
    });
    builder.addCase(createSubItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // Remove temp item on error
      state.items = state.items.filter(si => !si.id.startsWith('temp-'));
    });

    // Update sub-item
    builder.addCase(updateSubItem.fulfilled, (state, action) => {
      const index = state.items.findIndex(si => si.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    builder.addCase(updateSubItem.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Delete sub-item
    builder.addCase(deleteSubItem.fulfilled, (state, action) => {
      state.items = state.items.filter(si => si.id !== action.payload);
    });
    builder.addCase(deleteSubItem.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Toggle complete
    builder.addCase(toggleSubItemComplete.fulfilled, (state, action) => {
      const index = state.items.findIndex(si => si.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    builder.addCase(toggleSubItemComplete.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const {
  clearError,
  clearSubItems,
  optimisticCreateSubItem,
  optimisticUpdateSubItem,
  optimisticDeleteSubItem,
  optimisticToggleComplete,
} = subItemsSlice.actions;

export const { reducer: subItemsReducer } = subItemsSlice;
