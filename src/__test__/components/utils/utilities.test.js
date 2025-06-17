import { renderHook, act } from '@testing-library/react';
import { generateColor, dateTimeFormatter, formatAppointmentStatus, UserType, useAlertWithTimeout } from '../../../components/utils/utilities';

describe('utilities', () => {
  describe('useAlertWithTimeout', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should initialize with default visibility false', () => {
      const { result } = renderHook(() => useAlertWithTimeout());
      const [isVisible] = result.current;
      expect(isVisible).toBe(false);
    });

    test('should initialize with custom visibility', () => {
      const { result } = renderHook(() => useAlertWithTimeout(true));
      const [isVisible] = result.current;
      expect(isVisible).toBe(true);
    });

    test('should hide alert after default timeout', () => {
      const { result } = renderHook(() => useAlertWithTimeout(true));
      
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      const [isVisible] = result.current;
      expect(isVisible).toBe(false);
    });

    test('should hide alert after custom timeout', () => {
      const { result } = renderHook(() => useAlertWithTimeout(true, 5000));
      
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      const [isVisible] = result.current;
      expect(isVisible).toBe(false);
    });

    test('should allow manual visibility control', () => {
      const { result } = renderHook(() => useAlertWithTimeout(false));
      
      act(() => {
        const [, setIsVisible] = result.current;
        setIsVisible(true);
      });

      const [isVisible] = result.current;
      expect(isVisible).toBe(true);
    });
  });

  describe('generateColor', () => {
    test('should return default color for non-string input', () => {
      expect(generateColor(null)).toBe('#8884d8');
      expect(generateColor(undefined)).toBe('#8884d8');
      expect(generateColor(123)).toBe('#8884d8');
      expect(generateColor({})).toBe('#8884d8');
    });

    test('should return default color for empty string', () => {
      expect(generateColor('')).toBe('#8884d8');
    });

    test('should return HSL color for valid string', () => {
      const result = generateColor('test');
      expect(result).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
    });

    test('should generate consistent colors for same input', () => {
      const color1 = generateColor('hello');
      const color2 = generateColor('hello');
      expect(color1).toBe(color2);
    });

    test('should generate different colors for different inputs', () => {
      const color1 = generateColor('hello');
      const color2 = generateColor('world');
      expect(color1).not.toBe(color2);
    });

    test('should handle single character strings', () => {
      const result = generateColor('a');
      expect(result).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
    });

    test('should handle long strings', () => {
      const longString = 'a'.repeat(1000);
      const result = generateColor(longString);
      expect(result).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
    });
  });

  describe('dateTimeFormatter', () => {
    test('should format date and time correctly', () => {
      const date = new Date('2023-12-25T15:30:00');
      const time = new Date('2023-12-25T15:30:00');
      
      const result = dateTimeFormatter(date, time);
      
      expect(result).toEqual({
        formattedDate: '2023-12-25',
        formattedTime: '15:30'
      });
    });

    test('should handle string date inputs', () => {
      const dateStr = '2023-12-25';
      const timeStr = '2023-12-25T09:15:00';
      
      const result = dateTimeFormatter(dateStr, timeStr);
      
      expect(result.formattedDate).toBe('2023-12-25');
      expect(result.formattedTime).toBe('09:15');
    });

    test('should handle different date formats', () => {
      const date = new Date('January 1, 2024');
      const time = new Date('2024-01-01T00:00:00');
      
      const result = dateTimeFormatter(date, time);
      
      expect(result.formattedDate).toBe('2024-01-01');
      expect(result.formattedTime).toBe('00:00');
    });
  });

  describe('formatAppointmentStatus', () => {
    test('should convert uppercase to lowercase', () => {
      expect(formatAppointmentStatus('CONFIRMED')).toBe('confirmed');
    });

    test('should replace underscores with hyphens', () => {
      expect(formatAppointmentStatus('IN_PROGRESS')).toBe('in-progress');
    });

    test('should handle mixed case with underscores', () => {
      expect(formatAppointmentStatus('WAITING_FOR_APPROVAL')).toBe('waiting-for-approval');
    });

    test('should handle already lowercase strings', () => {
      expect(formatAppointmentStatus('pending')).toBe('pending');
    });

    test('should handle empty string', () => {
      expect(formatAppointmentStatus('')).toBe('');
    });

    test('should handle multiple underscores', () => {
      expect(formatAppointmentStatus('MULTI_PART_STATUS_NAME')).toBe('multi-part-status-name');
    });
  });

  describe('UserType', () => {
    test('should have PATIENT constant', () => {
      expect(UserType.PATIENT).toBe('PATIENT');
    });

    test('should have VET constant', () => {
      expect(UserType.VET).toBe('VET');
    });

    test('should be immutable object', () => {
      const originalPatient = UserType.PATIENT;
      UserType.PATIENT = 'MODIFIED';
      expect(UserType.PATIENT).toBe(originalPatient);
    });
  });
});