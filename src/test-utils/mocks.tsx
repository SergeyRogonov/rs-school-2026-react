import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from '../store/pokemonSlice';
import type { Action, Reducer } from 'redux';
import type { RootState } from '../store/store';
import selectionReducer from '../store/selectionSlice';

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
  initialEntries: string[] = ['/'],
  preloadedState?: Partial<RootState>
) => {
  const testStore = configureStore({
    reducer: {
      pokemon: pokemonReducer as Reducer<
        ReturnType<typeof pokemonReducer>,
        Action,
        ReturnType<typeof pokemonReducer> | undefined
      >,
      selection: selectionReducer as Reducer<
        ReturnType<typeof selectionReducer>,
        Action,
        ReturnType<typeof selectionReducer> | undefined
      >,
    },
    preloadedState,
  });

  return render(
    <Provider store={testStore}>
      <ThemeProvider>
        <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
};
