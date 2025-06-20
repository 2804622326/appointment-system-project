import { renderHook } from '@testing-library/react';
import useColorMapping from '../../../components/hooks/ColorMapping.js';

test('returns mapped colors from css variables', () => {
  document.documentElement.style.setProperty('--color-on-going', '#111');
  const { result } = renderHook(() => useColorMapping());
  expect(result.current['on-going']).toBe('#111');
});
