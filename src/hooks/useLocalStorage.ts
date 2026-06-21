import { useState, useCallback } from 'react';

export function useLocalStorage(key: string) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    return localStorage.getItem(key) || '';
  });

  const setStoredValue = useCallback(
    (newValue: string) => {
      setValue(newValue);

      if (typeof window !== 'undefined') {
        localStorage.setItem(key, newValue);
      }
    },
    [key]
  );

  return [value, setStoredValue] as const;
}
