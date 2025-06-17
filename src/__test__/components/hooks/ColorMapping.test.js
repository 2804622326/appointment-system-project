import { renderHook } from '@testing-library/react';
import useColorMapping from '../../../components/hooks/ColorMapping';

// Mock getComputedStyle
const mockGetComputedStyle = jest.fn();
Object.defineProperty(window, 'getComputedStyle', {
  value: mockGetComputedStyle,
});

describe('useColorMapping', () => {
  beforeEach(() => {
    mockGetComputedStyle.mockClear();
  });

  it('should return empty colors object initially', () => {
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: jest.fn().mockReturnValue(''),
    });

    const { result } = renderHook(() => useColorMapping());
    
    expect(result.current).toEqual({});
  });

  it('should fetch and return all color mappings from CSS variables', () => {
    const mockPropertyValue = jest.fn((property) => {
      const colorMap = {
        '--color-on-going': '#ff9800',
        '--color-up-coming': '#2196f3',
        '--color-completed': '#4caf50',
        '--color-not-approved': '#f44336',
        '--color-cancelled': '#9e9e9e',
        '--color-waiting-for-approval': '#ff5722',
        '--color-pending': '#ffc107',
        '--color-approved': '#8bc34a',
        '--color-default': '#607d8b',
      };
      return colorMap[property] || '';
    });

    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: mockPropertyValue,
    });

    const { result, rerender } = renderHook(() => useColorMapping());
    
    // Initial render should have empty object
    expect(result.current).toEqual({});
    
    // After useEffect runs
    rerender();
    
    expect(result.current).toEqual({
      'on-going': '#ff9800',
      'up-coming': '#2196f3',
      'completed': '#4caf50',
      'not-approved': '#f44336',
      'cancelled': '#9e9e9e',
      'waiting-for-approval': '#ff5722',
      'pending': '#ffc107',
      'approved': '#8bc34a',
      'default': '#607d8b',
    });
  });

  it('should call getComputedStyle with document.documentElement', () => {
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: jest.fn().mockReturnValue(''),
    });

    renderHook(() => useColorMapping());

    expect(mockGetComputedStyle).toHaveBeenCalledWith(document.documentElement);
  });

  it('should call getPropertyValue for each color variable', () => {
    const mockPropertyValue = jest.fn().mockReturnValue('#000000');
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: mockPropertyValue,
    });

    renderHook(() => useColorMapping());

    const expectedCalls = [
      '--color-on-going',
      '--color-up-coming',
      '--color-completed',
      '--color-not-approved',
      '--color-cancelled',
      '--color-waiting-for-approval',
      '--color-pending',
      '--color-approved',
      '--color-default',
    ];

    expectedCalls.forEach(property => {
      expect(mockPropertyValue).toHaveBeenCalledWith(property);
    });
    expect(mockPropertyValue).toHaveBeenCalledTimes(9);
  });

  it('should handle empty color values gracefully', () => {
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: jest.fn().mockReturnValue(''),
    });

    const { result, rerender } = renderHook(() => useColorMapping());
    
    rerender();
    
    expect(result.current).toEqual({
      'on-going': '',
      'up-coming': '',
      'completed': '',
      'not-approved': '',
      'cancelled': '',
      'waiting-for-approval': '',
      'pending': '',
      'approved': '',
      'default': '',
    });
  });

  it('should only run effect once on mount', () => {
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: jest.fn().mockReturnValue('#000000'),
    });

    const { rerender } = renderHook(() => useColorMapping());
    
    // Multiple rerenders should not call getComputedStyle again
    rerender();
    rerender();
    rerender();

    expect(mockGetComputedStyle).toHaveBeenCalledTimes(1);
  });
});