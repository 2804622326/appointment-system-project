import { renderHook, act } from '@testing-library/react';
import UseMessageAlerts from '../../../components/hooks/UseMessageAlerts.js';

test('provides helper setters for alerts', () => {
  const { result } = renderHook(() => UseMessageAlerts());
  act(() => {
    result.current.setErrorMessage('err');
    result.current.setShowErrorAlert(true);
  });
  expect(result.current.errorMessage).toBe('err');
  expect(result.current.showErrorAlert).toBe(true);
});
