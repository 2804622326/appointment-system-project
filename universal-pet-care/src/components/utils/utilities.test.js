import { renderHook, act } from '@testing-library/react';
import { useAlertWithTimeout } from './utilities';

jest.useFakeTimers();

test('useAlertWithTimeout hides alert after duration', () => {
  const { result } = renderHook(() => useAlertWithTimeout(false, 100));

  act(() => {
    const [, setIsVisible] = result.current;
    setIsVisible(true);
  });

  expect(result.current[0]).toBe(true);

  act(() => {
    jest.advanceTimersByTime(100);
  });

  expect(result.current[0]).toBe(false);
});
