import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { SubItem } from '../SubItem';
import { theme } from '@theme';
import { SubItem as SubItemType } from '@types';

const meta = {
  title: 'Components/SubItem',
  component: SubItem,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SubItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSubItem: SubItemType = {
  id: 'si-1',
  elementId: 'el-1',
  text: 'Buy milk at the grocery store',
  isCompleted: false,
  displayOrder: 0,
  createdAt: new Date().toISOString(),
};

export const Default: Story = {
  args: {
    subItem: mockSubItem,
    onToggleComplete: (id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted),
    onDelete: (id) => console.log(`Delete ${id}`),
    onEdit: (id, text) => console.log(`Edit ${id}:`, text),
  },
};

export const Completed: Story = {
  args: {
    subItem: {
      ...mockSubItem,
      isCompleted: true,
    },
    onToggleComplete: (id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted),
    onDelete: (id) => console.log(`Delete ${id}`),
    onEdit: (id, text) => console.log(`Edit ${id}:`, text),
  },
};

export const LongText: Story = {
  args: {
    subItem: {
      ...mockSubItem,
      text: 'This is a very long sub-item text that demonstrates how the component handles text overflow and prevents layout breaking when content is too long',
    },
    onToggleComplete: (id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted),
    onDelete: (id) => console.log(`Delete ${id}`),
    onEdit: (id, text) => console.log(`Edit ${id}:`, text),
  },
};

export const CompletedLongText: Story = {
  args: {
    subItem: {
      ...mockSubItem,
      text: 'This is a completed sub-item with very long text that shows strikethrough and text truncation properly',
      isCompleted: true,
    },
    onToggleComplete: (id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted),
    onDelete: (id) => console.log(`Delete ${id}`),
    onEdit: (id, text) => console.log(`Edit ${id}:`, text),
  },
};

export const Loading: Story = {
  args: {
    subItem: mockSubItem,
    onToggleComplete: (id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted),
    onDelete: (id) => console.log(`Delete ${id}`),
    onEdit: (id, text) => console.log(`Edit ${id}:`, text),
    isLoading: true,
  },
};

export const NoEditFunctionality: Story = {
  args: {
    subItem: mockSubItem,
    onToggleComplete: (id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted),
    onDelete: (id) => console.log(`Delete ${id}`),
  },
};

export const MultipleItems: Story = {
  args: {
    subItem: mockSubItem,
    onToggleComplete: () => {},
    onDelete: () => {},
  },
  render: () => (
    <div style={{ width: '500px', border: '1px solid #e0e0e0', padding: '16px', borderRadius: '8px' }}>
      <SubItem
        subItem={mockSubItem}
        onToggleComplete={(id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted)}
        onDelete={(id) => console.log(`Delete ${id}`)}
        onEdit={(id, text) => console.log(`Edit ${id}:`, text)}
      />
      <SubItem
        subItem={{
          ...mockSubItem,
          id: 'si-2',
          text: 'Get eggs and butter',
          displayOrder: 1,
        }}
        onToggleComplete={(id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted)}
        onDelete={(id) => console.log(`Delete ${id}`)}
        onEdit={(id, text) => console.log(`Edit ${id}:`, text)}
      />
      <SubItem
        subItem={{
          ...mockSubItem,
          id: 'si-3',
          text: 'Buy fresh vegetables',
          isCompleted: true,
          displayOrder: 2,
        }}
        onToggleComplete={(id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted)}
        onDelete={(id) => console.log(`Delete ${id}`)}
        onEdit={(id, text) => console.log(`Edit ${id}:`, text)}
      />
    </div>
  ),
};

export const Responsive: Story = {
  args: {
    subItem: mockSubItem,
    onToggleComplete: () => {},
    onDelete: () => {},
  },
  render: () => (
    <div>
      <h3>Mobile (320px)</h3>
      <div style={{ width: '320px', border: '1px solid #e0e0e0', padding: '8px', borderRadius: '4px', marginBottom: '24px' }}>
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={(id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted)}
          onDelete={(id) => console.log(`Delete ${id}`)}
          onEdit={(id, text) => console.log(`Edit ${id}:`, text)}
        />
      </div>

      <h3>Tablet (768px)</h3>
      <div style={{ width: '768px', border: '1px solid #e0e0e0', padding: '8px', borderRadius: '4px', marginBottom: '24px' }}>
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={(id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted)}
          onDelete={(id) => console.log(`Delete ${id}`)}
          onEdit={(id, text) => console.log(`Edit ${id}:`, text)}
        />
      </div>

      <h3>Desktop (1024px)</h3>
      <div style={{ width: '1024px', border: '1px solid #e0e0e0', padding: '8px', borderRadius: '4px' }}>
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={(id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted)}
          onDelete={(id) => console.log(`Delete ${id}`)}
          onEdit={(id, text) => console.log(`Edit ${id}:`, text)}
        />
      </div>
    </div>
  ),
};

export const Editing: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Click Edit to see the editing mode - type new text and press Enter or click Save',
      },
    },
  },
  args: {
    subItem: mockSubItem,
    onToggleComplete: (id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted),
    onDelete: (id) => console.log(`Delete ${id}`),
    onEdit: (id, text) => console.log(`Edit ${id}:`, text),
  },
};

export const SpecialCharacters: Story = {
  args: {
    subItem: {
      ...mockSubItem,
      text: 'Buy "organic" apples & organic "spinach" (fresh not frozen)',
    },
    onToggleComplete: (id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted),
    onDelete: (id) => console.log(`Delete ${id}`),
    onEdit: (id, text) => console.log(`Edit ${id}:`, text),
  },
};

export const RecentlyCreated: Story = {
  args: {
    subItem: {
      ...mockSubItem,
      createdAt: new Date().toISOString(),
    },
    onToggleComplete: (id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted),
    onDelete: (id) => console.log(`Delete ${id}`),
    onEdit: (id, text) => console.log(`Edit ${id}:`, text),
  },
};

export const OldItem: Story = {
  args: {
    subItem: {
      ...mockSubItem,
      createdAt: new Date('2024-01-01').toISOString(),
    },
    onToggleComplete: (id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted),
    onDelete: (id) => console.log(`Delete ${id}`),
    onEdit: (id, text) => console.log(`Edit ${id}:`, text),
  },
};

export const Accessibility: Story = {
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates proper aria labels and keyboard navigation. Try using Tab to navigate between elements and Space to toggle completion.',
      },
    },
  },
  args: {
    subItem: mockSubItem,
    onToggleComplete: (id, isCompleted) => console.log(`Toggle ${id}:`, isCompleted),
    onDelete: (id) => console.log(`Delete ${id}`),
    onEdit: (id, text) => console.log(`Edit ${id}:`, text),
  },
};
