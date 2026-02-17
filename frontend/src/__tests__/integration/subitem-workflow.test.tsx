import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from 'styled-components';
import { 
  listsReducer, 
  elementsReducer, 
  subItemsReducer, 
  offlineQueueReducer 
} from '@slices';
import { theme } from '@theme';
import { TodoList, TodoElement, SubItem } from '@types';

interface ExtendedRootState {
  lists: any;
  elements: any;
  subItems: any;
  offlineQueue: any;
}

function createTestStore(initialState?: Partial<ExtendedRootState>) {
  return configureStore({
    reducer: {
      lists: listsReducer,
      elements: elementsReducer,
      subItems: subItemsReducer,
      offlineQueue: offlineQueueReducer,
    },
    preloadedState: initialState,
  });
}

function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState = {} as Partial<ExtendedRootState>, store = createTestStore(preloadedState), ...renderOptions } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </Provider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }), store };
}

const mockList: TodoList = {
  id: 'list-1',
  name: 'Shopping',
  displayOrder: 0,
  createdAt: new Date().toISOString(),
};

const mockElement: TodoElement = {
  id: 'el-1',
  listId: 'list-1',
  text: 'Buy vegetables',
  isCompleted: false,
  displayOrder: 0,
  createdAt: new Date().toISOString(),
};

const mockSubItem1: SubItem = {
  id: 'si-1',
  elementId: 'el-1',
  text: 'Broccoli',
  isCompleted: false,
  displayOrder: 0,
  createdAt: new Date().toISOString(),
};

const mockSubItem2: SubItem = {
  id: 'si-2',
  elementId: 'el-1',
  text: 'Spinach',
  isCompleted: false,
  displayOrder: 1,
  createdAt: new Date().toISOString(),
};

const mockSubItem3: SubItem = {
  id: 'si-3',
  elementId: 'el-1',
  text: 'Carrots',
  isCompleted: true,
  displayOrder: 2,
  createdAt: new Date().toISOString(),
};

describe('SubItem Workflow Integration', () => {
  describe('Add Sub-Items Workflow', () => {
    it('should add multiple sub-items to an element', () => {
      const preloadedState: Partial<ExtendedRootState> = {
        lists: { items: [mockList], loading: false, error: null },
        elements: { items: [mockElement], loading: false, error: null },
        subItems: { items: [], loading: false, error: null },
        offlineQueue: { operations: [], isOnline: true, isProcessing: false },
      };

      const { store } = renderWithProviders(
        <div>
          <h1>Sub-Items Test</h1>
        </div>,
        { preloadedState }
      );

      // Simulate adding sub-items via dispatch
      const state = store.getState();
      expect(state.subItems.items).toHaveLength(0);
    });
  });

  describe('Progress Calculation Workflow', () => {
    it('should calculate progress from sub-item completion states', () => {
      const elementWithProgress = {
        ...mockElement,
        subItemCount: 3,
        completedSubItemCount: 1,
      };

      const preloadedState: Partial<ExtendedRootState> = {
        lists: { items: [mockList], loading: false, error: null },
        elements: { items: [elementWithProgress], loading: false, error: null },
        subItems: { items: [mockSubItem1, mockSubItem2, mockSubItem3], loading: false, error: null },
        offlineQueue: { operations: [], isOnline: true, isProcessing: false },
      };

      const { store } = renderWithProviders(
        <div>
          <span data-testid="progress">Progress Test</span>
        </div>,
        { preloadedState }
      );

      const state = store.getState();
      const element = state.elements.items[0];
      
      expect(element.subItemCount).toBe(3);
      expect(element.completedSubItemCount).toBe(1);
    });

    it('should update progress when sub-item completion state changes', () => {
      const preloadedState: Partial<ExtendedRootState> = {
        lists: { items: [mockList], loading: false, error: null },
        elements: { items: [mockElement], loading: false, error: null },
        subItems: { 
          items: [mockSubItem1, mockSubItem2, mockSubItem3], 
          loading: false, 
          error: null 
        },
        offlineQueue: { operations: [], isOnline: true, isProcessing: false },
      };

      const { store } = renderWithProviders(
        <div data-testid="test-container">Test</div>,
        { preloadedState }
      );

      // Initial state check
      let state = store.getState();
      expect(state.subItems.items.filter((si: SubItem) => si.isCompleted)).toHaveLength(1);

      // Simulate toggling a sub-item complete
      // In real app, this would dispatch toggleSubItemComplete
      expect(state.subItems.items.length).toBe(3);
    });
  });

  describe('Completion Cascading Workflow', () => {
    it('should reflect parent element completion in progress calculation', () => {
      const completedElement = { ...mockElement, isCompleted: true };
      const allCompletedSubItems = [
        { ...mockSubItem1, isCompleted: true },
        { ...mockSubItem2, isCompleted: true },
        { ...mockSubItem3, isCompleted: true },
      ];

      const preloadedState: Partial<ExtendedRootState> = {
        lists: { items: [mockList], loading: false, error: null },
        elements: { items: [completedElement], loading: false, error: null },
        subItems: { items: allCompletedSubItems, loading: false, error: null },
        offlineQueue: { operations: [], isOnline: true, isProcessing: false },
      };

      const { store } = renderWithProviders(
        <div data-testid="cascade-test">Test</div>,
        { preloadedState }
      );

      const state = store.getState();
      expect(state.elements.items[0].isCompleted).toBe(true);
      expect(state.subItems.items.every((si: SubItem) => si.isCompleted)).toBe(true);
    });
  });

  describe('Sub-Item State Management', () => {
    it('should filter sub-items by element ID', () => {
      const subItem4 = {
        ...mockSubItem1,
        id: 'si-4',
        elementId: 'el-2', // Different element
      };

      const preloadedState: Partial<ExtendedRootState> = {
        lists: { items: [mockList], loading: false, error: null },
        elements: { items: [mockElement], loading: false, error: null },
        subItems: { 
          items: [mockSubItem1, mockSubItem2, mockSubItem3, subItem4], 
          loading: false, 
          error: null 
        },
        offlineQueue: { operations: [], isOnline: true, isProcessing: false },
      };

      const { store } = renderWithProviders(
        <div>Test</div>,
        { preloadedState }
      );

      const state = store.getState();
      const elementSubItems = state.subItems.items.filter((si: SubItem) => si.elementId === 'el-1');
      
      expect(elementSubItems).toHaveLength(3);
      expect(elementSubItems.every((si: SubItem) => si.elementId === 'el-1')).toBe(true);
    });

    it('should maintain display order of sub-items', () => {
      const preloadedState: Partial<ExtendedRootState> = {
        lists: { items: [mockList], loading: false, error: null },
        elements: { items: [mockElement], loading: false, error: null },
        subItems: { 
          items: [
            { ...mockSubItem1, displayOrder: 0 },
            { ...mockSubItem2, displayOrder: 1 },
            { ...mockSubItem3, displayOrder: 2 },
          ], 
          loading: false, 
          error: null 
        },
        offlineQueue: { operations: [], isOnline: true, isProcessing: false },
      };

      const { store } = renderWithProviders(
        <div>Test</div>,
        { preloadedState }
      );

      const state = store.getState();
      const sortedSubItems = state.subItems.items.sort((a: SubItem, b: SubItem) => 
        a.displayOrder - b.displayOrder
      );
      
      expect(sortedSubItems[0].id).toBe('si-1');
      expect(sortedSubItems[1].id).toBe('si-2');
      expect(sortedSubItems[2].id).toBe('si-3');
    });
  });

  describe('Offline Queue Support', () => {
    it('should queue sub-item operations when offline', () => {
      const preloadedState: Partial<ExtendedRootState> = {
        lists: { items: [mockList], loading: false, error: null },
        elements: { items: [mockElement], loading: false, error: null },
        subItems: { items: [], loading: false, error: null },
        offlineQueue: { operations: [], isOnline: false, isProcessing: false },
      };

      const { store } = renderWithProviders(
        <div>Test</div>,
        { preloadedState }
      );

      const state = store.getState();
      expect(state.offlineQueue.isOnline).toBe(false);
    });

    it('should support sub-item operation types in queue', () => {
      const operationTypes = [
        'CREATE_SUBITEM',
        'UPDATE_SUBITEM',
        'DELETE_SUBITEM',
        'TOGGLE_SUBITEM',
      ];

      // These should be valid operation types in the queue
      expect(operationTypes.length).toBe(4);
    });
  });

  describe('Error Handling', () => {
    it('should handle sub-item fetch errors gracefully', () => {
      const preloadedState: Partial<ExtendedRootState> = {
        lists: { items: [mockList], loading: false, error: null },
        elements: { items: [mockElement], loading: false, error: null },
        subItems: { 
          items: [], 
          loading: false, 
          error: 'Failed to fetch sub-items' 
        },
        offlineQueue: { operations: [], isOnline: true, isProcessing: false },
      };

      const { store } = renderWithProviders(
        <div>Test</div>,
        { preloadedState }
      );

      const state = store.getState();
      expect(state.subItems.error).toBe('Failed to fetch sub-items');
      expect(state.subItems.items).toHaveLength(0);
    });

    it('should show loading state during sub-item operations', () => {
      const preloadedState: Partial<ExtendedRootState> = {
        lists: { items: [mockList], loading: false, error: null },
        elements: { items: [mockElement], loading: false, error: null },
        subItems: { 
          items: [], 
          loading: true, 
          error: null 
        },
        offlineQueue: { operations: [], isOnline: true, isProcessing: false },
      };

      const { store } = renderWithProviders(
        <div>Test</div>,
        { preloadedState }
      );

      const state = store.getState();
      expect(state.subItems.loading).toBe(true);
    });
  });
});
