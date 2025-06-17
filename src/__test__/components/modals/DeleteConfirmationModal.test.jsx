import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteConfirmationModal from '../../../components/modals/DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  const mockOnHide = jest.fn();
  const mockOnConfirm = jest.fn();
  const defaultProps = {
    show: true,
    onHide: mockOnHide,
    onConfirm: mockOnConfirm,
    itemToDelete: 'test item'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when show is true', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    expect(screen.getByText('Delete Confirmation')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete test item/)).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    render(<DeleteConfirmationModal {...defaultProps} show={false} />);
    
    expect(screen.queryByText('Delete Confirmation')).not.toBeInTheDocument();
  });

  test('displays correct item name in confirmation message', () => {
    render(<DeleteConfirmationModal {...defaultProps} itemToDelete="appointment" />);
    
    expect(screen.getByText(/Are you sure you want to delete appointment/)).toBeInTheDocument();
  });

  test('calls onHide when Cancel button is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });

  test('calls onConfirm when Delete button is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test('calls onHide when close button is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });

  test('renders correct button variants', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    const deleteButton = screen.getByText('Delete');
    
    expect(cancelButton).toHaveClass('btn-secondary');
    expect(deleteButton).toHaveClass('btn-danger');
  });

  test('renders warning message about action being irreversible', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    expect(screen.getByText(/This action can not be undone/)).toBeInTheDocument();
  });
});