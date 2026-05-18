import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

export const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    front_default: 'https://example.com/bulbasaur.png',
  },
};

export const mockSuccessfulListFetch = () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        data: {
          pokemon: [mockPokemon],
        },
      }),
  });
};

export const renderWithRouter = (
  component: React.ReactNode,
  initialEntries: string[] = ['/']
) => {
  return render(
    React.createElement(MemoryRouter, { initialEntries }, component)
  );
};
