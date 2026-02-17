import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { SubItem } from '../SubItem';
import { theme } from '@theme';
import { SubItem as SubItemType } from '@types';

const mockSubItem: SubItemType = {
  id: 'si-1',
  elementId: 'el-1',
  text: 'Buy groceries',
  isCompleted: false,
  displayOrder: 0,
  createdAt: new Date().toISOString(),
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('SubItem Component', () => {
  describe('Rendering', () => {
    it('should render sub-item with text and checkbox', () => {
      const onToggle = jest.fn();
      const onDelete = jest.fn();

      renderWithTheme(
        <SubItem subItem={mockSubItem} onToggleComplete={onToggle} onDelete={onDelete} />
      );

      expect(screen.getByTestId(`subitem-${mockSubItem.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`subitem-text-${mockSubItem.id}`)).toHaveTextContent('Buy groceries');
      expect(screen.getByTestId(`subitem-checkbox-${mockSubItem.id}`)).not.toBeChecked();
    });

    it('should render completed sub-item with strikethrough', () => {
      const completedSubItem = { ...mockSubItem, isCompleted: true };
      const onToggle = jest.fn();
      const onDelete = jest.fn();

      renderWithTheme(
        <SubItem subItem={completedSubItem} onToggleComplete={onToggle} onDelete={onDelete} />
      );

      const textElement = screen.getByTestId(`subitem-text-${mockSubItem.id}`);
      expect(textElement).toHaveStyle('text-decoration: line-through');
      expect(screen.getByTestId(`subitem-checkbox-${mockSubItem.id}`)).toBeChecked();
    });

    it('should render action buttons', () => {
      const onToggle = jest.fn();
      const onDelete = jest.fn();
      const onEdit = jest.fn();

      renderWithTheme(
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );

      expect(screen.getByTestId(`subitem-edit-btn-${mockSubItem.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`subitem-delete-btn-${mockSubItem.id}`)).toBeInTheDocument();
    });

    it('should render with long text without breaking layout', () => {
      const longSubItem = {
        ...mockSubItem,
        text: 'This is a very long sub-item text that should not break the layout and should be truncated with ellipsis when necessary in the display',
      };
      const onToggle = jest.fn();
      const onDelete = jest.fn();

      renderWithTheme(
        <SubItem subItem={longSubItem} onToggleComplete={onToggle} onDelete={onDelete} />
      );

      const textElement = screen.getByTestId(`subitem-text-${mockSubItem.id}`);
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveStyle('overflow: hidden');
      expect(textElement).toHaveStyle('white-space: nowrap');
    });
  });

  describe('Completion Toggle', () => {
    it('should call onToggleComplete when checkbox is clicked', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      const onDelete = jest.fn();

      renderWithTheme(
        <SubItem subItem={mockSubItem} onToggleComplete={onToggle} onDelete={onDelete} />
      );

      const checkbox = screen.getByTestId(`subitem-checkbox-${mockSubItem.id}`);
      await user.click(checkbox);

      expect(onToggle).toHaveBeenCalledWith(mockSubItem.id, true);
    });

    it('should toggle to completed state', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      const onDelete = jest.fn();

      renderWithTheme(
        <SubItem subItem={mockSubItem} onToggleComplete={onToggle} onDelete={onDelete} />
      );

      const checkbox = screen.getByTestId(`subitem-checkbox-${mockSubItem.id}`) as HTMLInputElement;
      await user.click(checkbox);

      expect(onToggle).toHaveBeenCalledWith(mockSubItem.id, true);
    });

    it('should toggle back to incomplete state', async () => {
      const user = userEvent.setup();
      const completedSubItem = { ...mockSubItem, isCompleted: true };
      const onToggle = jest.fn();
      const onDelete = jest.fn();

      renderWithTheme(
        <SubItem subItem={completedSubItem} onToggleComplete={onToggle} onDelete={onDelete} />
      );

      const checkbox = screen.getByTestId(`subitem-checkbox-${mockSubItem.id}`);
      await user.click(checkbox);

      expect(onToggle).toHaveBeenCalledWith(mockSubItem.id, false);
    });

    it('should disable checkbox when loading', () => {
      const onToggle = jest.fn();
      const onDelete = jest.fn();

      renderWithTheme(
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={onToggle}
          onDelete={onDelete}
          isLoading={true}
        />
      );

      const checkbox = screen.getByTestId(`subitem-checkbox-${mockSubItem.id}`);
      expect(checkbox).toBeDisabled();
    });
  });

  describe('Deletion', () => {
    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      const onDelete = jest.fn();

      renderWithTheme(
        <SubItem subItem={mockSubItem} onToggleComplete={onToggle} onDelete={onDelete} />
      );

      const deleteBtn = screen.getByTestId(`subitem-delete-btn-${mockSubItem.id}`);
      await user.click(deleteBtn);

      expect(onDelete).toHaveBeenCalledWith(mockSubItem.id);
    });

    it('should disable delete button when loading', () => {
      const onToggle = jest.fn();
      const onDelete = jest.fn();

      renderWithTheme(
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={onToggle}
          onDelete={onDelete}
          isLoading={true}
        />
      );

      const deleteBtn = screen.getByTestId(`subitem-delete-btn-${mockSubItem.id}`);
      expect(deleteBtn).toBeDisabled();
    });
  });

  describe('Editing', () => {
    it('should render edit button when onEdit is provided', () => {
      const onToggle = jest.fn();
      const onDelete = jest.fn();
      const onEdit = jest.fn();

      renderWithTheme(
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );

      expect(screen.getByTestId(`subitem-edit-btn-${mockSubItem.id}`)).toBeInTheDocument();
    });

    it('should not show edit button when onEdit is not provided', () => {
      const onToggle = jest.fn();
      const onDelete = jest.fn();

      renderWithTheme(
        <SubItem subItem={mockSubItem} onToggleComplete={onToggle} onDelete={onDelete} />
      );

      expect(screen.queryByTestId(`subitem-edit-btn-${mockSubItem.id}`)).not.toBeInTheDocument();
    });

    it('should enter edit mode when edit button is clicked', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      const onDelete = jest.fn();
      const onEdit = jest.fn();

      renderWithTheme(
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );

      const editBtn = screen.getByTestId(`subitem-edit-btn-${mockSubItem.id}`);
      await user.click(editBtn);

      expect(screen.getByTestId(`subitem-edit-input-${mockSubItem.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`subitem-save-btn-${mockSubItem.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`subitem-cancel-btn-${mockSubItem.id}`)).toBeInTheDocument();
    });

    it('should save edited text when save button is clicked', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      const onDelete = jest.fn();
      const onEdit = jest.fn();

      renderWithTheme(
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );

      const editBtn = screen.getByTestId(`subitem-edit-btn-${mockSubItem.id}`);
      await user.click(editBtn);

      const input = screen.getByTestId(`subitem-edit-input-${mockSubItem.id}`) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, 'Updated text');

      const saveBtn = screen.getByTestId(`subitem-save-btn-${mockSubItem.id}`);
      await user.click(saveBtn);

      expect(onEdit).toHaveBeenCalledWith(mockSubItem.id, 'Updated text');
    });

    it('should save edited text when Enter key is pressed', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      const onDelete = jest.fn();
      const onEdit = jest.fn();

      renderWithTheme(
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );

      const editBtn = screen.getByTestId(`subitem-edit-btn-${mockSubItem.id}`);
      await user.click(editBtn);

      const input = screen.getByTestId(`subitem-edit-input-${mockSubItem.id}`) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, 'Updated text{Enter}');

      expect(onEdit).toHaveBeenCalledWith(mockSubItem.id, 'Updated text');
    });

    it('should cancel editing when Escape key is pressed', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      const onDelete = jest.fn();
      const onEdit = jest.fn();

      renderWithTheme(
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );

      const editBtn = screen.getByTestId(`subitem-edit-btn-${mockSubItem.id}`);
      await user.click(editBtn);

      const input = screen.getByTestId(`subitem-edit-input-${mockSubItem.id}`) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, 'New text');
      await user.keyboard('{Escape}');

      expect(onEdit).not.toHaveBeenCalled();
      expect(screen.queryByTestId(`subitem-edit-input-${mockSubItem.id}`)).not.toBeInTheDocument();
    });

    it('should cancel editing when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      const onDelete = jest.fn();
      const onEdit = jest.fn();

      renderWithTheme(
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );

      const editBtn = screen.getByTestId(`subitem-edit-btn-${mockSubItem.id}`);
      await user.click(editBtn);

      const input = screen.getByTestId(`subitem-edit-input-${mockSubItem.id}`) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, 'New text');

      const cancelBtn = screen.getByTestId(`subitem-cancel-btn-${mockSubItem.id}`);
      await user.click(cancelBtn);

      expect(onEdit).not.toHaveBeenCalled();
      expect(screen.queryByTestId(`subitem-edit-input-${mockSubItem.id}`)).not.toBeInTheDocument();
    });

    it('should not save empty text', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      const onDelete = jest.fn();
      const onEdit = jest.fn();

      renderWithTheme(
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );

      const editBtn = screen.getByTestId(`subitem-edit-btn-${mockSubItem.id}`);
      await user.click(editBtn);

      const input = screen.getByTestId(`subitem-edit-input-${mockSubItem.id}`) as HTMLInputElement;
      await user.clear(input);

      const saveBtn = screen.getByTestId(`subitem-save-btn-${mockSubItem.id}`);
      expect(saveBtn).toBeDisabled();
    });

    it('should disable edit button when loading', () => {
      const onToggle = jest.fn();
      const onDelete = jest.fn();
      const onEdit = jest.fn();

      renderWithTheme(
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          isLoading={true}
        />
      );

      const editBtn = screen.getByTestId(`subitem-edit-btn-${mockSubItem.id}`);
      expect(editBtn).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in text', () => {
      const specialSubItem = {
        ...mockSubItem,
        text: 'Get "quotes" & ampersand <html> test',
      };
      const onToggle = jest.fn();
      const onDelete = jest.fn();

      renderWithTheme(
        <SubItem subItem={specialSubItem} onToggleComplete={onToggle} onDelete={onDelete} />
      );

      expect(screen.getByTestId(`subitem-text-${mockSubItem.id}`)).toHaveTextContent(
        'Get "quotes" & ampersand <html> test'
      );
    });

    it('should handle whitespace trimming in edit', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      const onDelete = jest.fn();
      const onEdit = jest.fn();

      renderWithTheme(
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );

      const editBtn = screen.getByTestId(`subitem-edit-btn-${mockSubItem.id}`);
      await user.click(editBtn);

      const input = screen.getByTestId(`subitem-edit-input-${mockSubItem.id}`) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, '   Updated text   ');

      const saveBtn = screen.getByTestId(`subitem-save-btn-${mockSubItem.id}`);
      await user.click(saveBtn);

      expect(onEdit).toHaveBeenCalledWith(mockSubItem.id, 'Updated text');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels', () => {
      const onToggle = jest.fn();
      const onDelete = jest.fn();

      renderWithTheme(
        <SubItem subItem={mockSubItem} onToggleComplete={onToggle} onDelete={onDelete} />
      );

      const checkbox = screen.getByTestId(`subitem-checkbox-${mockSubItem.id}`);
      expect(checkbox).toHaveAttribute('aria-label', 'Toggle sub-item: Buy groceries');

      const deleteBtn = screen.getByTestId(`subitem-delete-btn-${mockSubItem.id}`);
      expect(deleteBtn).toHaveAttribute('aria-label', 'Delete sub-item: Buy groceries');
    });

    it('should focus on input when entering edit mode', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      const onDelete = jest.fn();
      const onEdit = jest.fn();

      renderWithTheme(
        <SubItem
          subItem={mockSubItem}
          onToggleComplete={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );

      const editBtn = screen.getByTestId(`subitem-edit-btn-${mockSubItem.id}`);
      await user.click(editBtn);

      const input = screen.getByTestId(`subitem-edit-input-${mockSubItem.id}`);
      expect(input).toHaveFocus();
    });
  });
});
