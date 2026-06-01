import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { mockLocalStorage } from './mocks';

beforeEach(() => {
  vi.clearAllMocks();
  mockLocalStorage.getItem.mockReturnValue(null);
  mockLocalStorage.setItem.mockClear();
  mockLocalStorage.removeItem.mockClear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
