import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddItemModal from '../../../components/modals/AddItemModal';

describe('AddItemModal', () => {
  const mockHandleClose = jest.fn();
  const mockHandleSave = jest.fn();
  const defaultProps = {
    show: true,
    handleClose: mockHandleClose,
    handleSave: mockHandleSave,
    itemLabel: 'Category'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when show is true', () => {
    render(<AddItemModal {...defaultProps} />);
    expect(screen.getByText('Add New Category')).toBeInTheDocument();
    expect(screen.getByText('Category Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter category name')).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    render(<AddItemModal {...defaultProps} show={false} />);
    expect(screen.queryByText('Add New Category')).not.toBeInTheDocument();
  });

  test('handles input change correctly', () => {
    render(<AddItemModal {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter category name');
    
    fireEvent.change(input, { target: { value: 'Test Category' } });
    expect(input.value).toBe('Test Category');
  });

  test('calls handleSave and handleClose when Add button is clicked', () => {
    render(<AddItemModal {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter category name');
    const addButton = screen.getByText('Add');
    
    fireEvent.change(input, { target: { value: 'Test Category' } });
    fireEvent.click(addButton);
    
    expect(mockHandleSave).toHaveBeenCalledWith('Test Category');
    expect(mockHandleClose).toHaveBeenCalled();
    expect(input.value).toBe('');
  });

  test('calls handleClose when Close button is clicked', () => {
    render(<AddItemModal {...defaultProps} />);
    const closeButton = screen.getByText('Close');
    
    fireEvent.click(closeButton);
    expect(mockHandleClose).toHaveBeenCalled();
  });

  test('calls handleClose when modal is closed via onHide', () => {
    render(<AddItemModal {...defaultProps} />);
    const modal = screen.getByRole('dialog');
    
    fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });
    expect(mockHandleClose).toHaveBeenCalled();
  });

  test('renders with different itemLabel', () => {
    render(<AddItemModal {...defaultProps} itemLabel="Service" />);
    expect(screen.getByText('Add New Service')).toBeInTheDocument();
    expect(screen.getByText('Service Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter service name')).toBeInTheDocument();
  });

  test('clears input after saving', () => {
    render(<AddItemModal {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter category name');
    const addButton = screen.getByText('Add');
    
    fireEvent.change(input, { target: { value: 'Test Value' } });
    expect(input.value).toBe('Test Value');
    
    fireEvent.click(addButton);
    expect(input.value).toBe('');
  });
});