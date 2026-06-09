import { vi } from 'vitest';
import type { RootState } from '../store/store';

export const mockCountries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Japan',
  'Australia',
];

export const createMockRootState = (
  overrides?: Partial<RootState>
): RootState => {
  return {
    forms: {
      submissions: [],
      countries: mockCountries,
    },
    ...overrides,
  };
};

export const mockDispatch = vi.fn();

export const createMockUseDispatch = () => {
  return vi.fn(() => mockDispatch);
};

export const createMockUseSelector = (state: RootState) => {
  return vi.fn(<T>(selector: (state: RootState) => T): T => {
    return selector(state);
  });
};

export const mockFile = (
  name = 'test.png',
  type = 'image/png',
  size = 1000
): File => {
  const file = new File(['dummy content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

export const mockFormData = {
  name: 'John Doe',
  age: '25',
  email: 'john@example.com',
  gender: 'male',
  password: 'TestPassword123!',
  confirm: 'TestPassword123!',
  country: 'United States',
  avatar: mockFile(),
  acceptTos: 'on',
};

export const mockValidationError = {
  success: false,
  error: {
    issues: [
      {
        path: ['email'],
        message: 'Invalid email',
      },
    ],
  },
};
