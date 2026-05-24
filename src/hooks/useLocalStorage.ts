import { useState, useCallback } from 'react';

export function useLocalStorage(key: string) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored || '';
  });

  const setStoredValue = useCallback(
    (newValue: string) => {
      // Only update if value changed
      if (newValue !== value) {
        setValue(newValue);
        localStorage.setItem(key, newValue);
      }
    },
    [key, value]
  );

  return [value, setStoredValue] as const;
}
