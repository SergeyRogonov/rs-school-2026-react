import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { mockLocalStorage, mockFetch } from './mocks';

beforeEach(() => {
  vi.clearAllMocks();
  mockFetch.mockClear();
  mockFetch.mockReset();
  mockLocalStorage.getItem.mockReturnValue(null);
  mockLocalStorage.setItem.mockClear();
  mockLocalStorage.removeItem.mockClear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
