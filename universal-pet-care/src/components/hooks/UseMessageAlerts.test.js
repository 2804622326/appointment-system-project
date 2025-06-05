import { renderHook, act } from '@testing-library/react';
import UseMessageAlerts from './UseMessageAlerts';

jest.useFakeTimers();

test('initial values are correct', () => {
  const { result } = renderHook(() => UseMessageAlerts());
  expect(result.current.successMessage).toBe('');
  expect(result.current.errorMessage).toBe('');
  expect(result.current.showSuccessAlert).toBe(false);
  expect(result.current.showErrorAlert).toBe(false);
});

test('error alert hides after timeout', () => {
  const { result } = renderHook(() => UseMessageAlerts());
  act(() => {
    result.current.setShowErrorAlert(true);
  });
  expect(result.current.showErrorAlert).toBe(true);
  act(() => {
    jest.advanceTimersByTime(10000);
  });
  expect(result.current.showErrorAlert).toBe(false);
});
