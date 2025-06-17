import { renderHook, act } from '@testing-library/react';
import UseMessageAlerts from '../../../components/hooks/UseMessageAlerts';
import { useAlertWithTimeout } from '../../../components/utils/utilities';

// Mock the useAlertWithTimeout hook
jest.mock('../../../components/utils/utilities', () => ({
  useAlertWithTimeout: jest.fn()
}));

describe('UseMessageAlerts', () => {
  const mockSetShowErrorAlert = jest.fn();
  const mockSetShowSuccessAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAlertWithTimeout
      .mockReturnValueOnce([false, mockSetShowErrorAlert])
      .mockReturnValueOnce([false, mockSetShowSuccessAlert]);
  });

  test('should initialize with empty messages and false alert states', () => {
    const { result } = renderHook(() => UseMessageAlerts());

    expect(result.current.successMessage).toBe('');
    expect(result.current.errorMessage).toBe('');
    expect(result.current.showErrorAlert).toBe(false);
    expect(result.current.showSuccessAlert).toBe(false);
  });

  test('should update success message', () => {
    const { result } = renderHook(() => UseMessageAlerts());

    act(() => {
      result.current.setSuccessMessage('Success!');
    });

    expect(result.current.successMessage).toBe('Success!');
  });

  test('should update error message', () => {
    const { result } = renderHook(() => UseMessageAlerts());

    act(() => {
      result.current.setErrorMessage('Error occurred!');
    });

    expect(result.current.errorMessage).toBe('Error occurred!');
  });

  test('should provide setShowSuccessAlert function', () => {
    const { result } = renderHook(() => UseMessageAlerts());

    expect(typeof result.current.setShowSuccessAlert).toBe('function');
    expect(result.current.setShowSuccessAlert).toBe(mockSetShowSuccessAlert);
  });

  test('should provide setShowErrorAlert function', () => {
    const { result } = renderHook(() => UseMessageAlerts());

    expect(typeof result.current.setShowErrorAlert).toBe('function');
    expect(result.current.setShowErrorAlert).toBe(mockSetShowErrorAlert);
  });

  test('should call useAlertWithTimeout twice', () => {
    renderHook(() => UseMessageAlerts());

    expect(useAlertWithTimeout).toHaveBeenCalledTimes(2);
  });

  test('should return all expected properties', () => {
    const { result } = renderHook(() => UseMessageAlerts());

    expect(result.current).toHaveProperty('successMessage');
    expect(result.current).toHaveProperty('setSuccessMessage');
    expect(result.current).toHaveProperty('errorMessage');
    expect(result.current).toHaveProperty('setErrorMessage');
    expect(result.current).toHaveProperty('showSuccessAlert');
    expect(result.current).toHaveProperty('setShowSuccessAlert');
    expect(result.current).toHaveProperty('showErrorAlert');
    expect(result.current).toHaveProperty('setShowErrorAlert');
  });
});