import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

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

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),

  useSearchParams: () => new URLSearchParams(),

  usePathname: () => '/',
}));

export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});
