import { renderHook, act } from '@testing-library/react';
import { useAlertWithTimeout, generateColor, dateTimeFormatter, formatAppointmentStatus } from '../../../components/utils/utilities.js';

jest.useFakeTimers();

describe('utilities helpers', () => {
  test('useAlertWithTimeout toggles visibility', () => {
    const { result } = renderHook(() => useAlertWithTimeout(true, 5000));
    expect(result.current[0]).toBe(true);
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current[0]).toBe(false);
  });

  test('generateColor returns deterministic color', () => {
    const color = generateColor('abc');
    expect(color).toMatch(/hsl\(\d+, 70%, 50%\)/);
    expect(generateColor('')).toBe('#8884d8');
  });

  test('dateTimeFormatter formats date and time', () => {
    const date = new Date('2023-01-01');
    const time = new Date('2023-01-01T10:30:00');
    const { formattedDate, formattedTime } = dateTimeFormatter(date, time);
    expect(formattedDate).toBe('2023-01-01');
    expect(formattedTime).toBe('10:30');
  });

  test('formatAppointmentStatus converts enum', () => {
    expect(formatAppointmentStatus('PENDING_APPROVAL')).toBe('pending-approval');
  });
});
