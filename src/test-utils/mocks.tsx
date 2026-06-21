// import { render } from '@testing-library/react';
// import { ThemeProvider } from '../context/ThemeContext';
// import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
// import type { RootState } from '../store/store';
import selectionReducer from '../store/selectionSlice';
import type { PokemonBase, PokemonDetails } from '../types/types';

export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock data matching GraphQL response structure
export const mockPokemonBaseResponse = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: [
    {
      sprites: {
        front_default: 'https://example.com/bulbasaur.png',
      },
    },
  ],
};

export const mockPokemonDetailsResponse = {
  ...mockPokemonBaseResponse,
  stats: [
    { base_stat: 45, stat: { name: 'hp' } },
    { base_stat: 49, stat: { name: 'attack' } },
    { base_stat: 49, stat: { name: 'defense' } },
    { base_stat: 65, stat: { name: 'special-attack' } },
    { base_stat: 65, stat: { name: 'special-defense' } },
    { base_stat: 45, stat: { name: 'speed' } },
  ],
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
};

// Transformed data matching component expectations
export const mockPokemonBase: PokemonBase = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    front_default: 'https://example.com/bulbasaur.png',
  },
};

export const mockPokemonDetails: PokemonDetails = {
  ...mockPokemonBase,
  stats: {
    hp: 45,
    attack: 49,
    defense: 49,
    special_attack: 65,
    special_defense: 65,
    speed: 45,
  },
  types: ['grass', 'poison'],
};

// Mock handlers for RTK Query
export const mockGetPokemonListHandler = {
  data: {
    pokemon: [mockPokemonBaseResponse],
  },
};

export const mockGetPokemonDetailsHandler = {
  data: {
    pokemon: [mockPokemonDetailsResponse],
  },
};

export const mockSearchPokemonHandler = {
  data: {
    pokemon: [mockPokemonBaseResponse],
  },
};

export const mockEmptySearchHandler = {
  data: {
    pokemon: [],
  },
};

export type TestPreloadedState = {
  selection?: {
    selectedIds: number[];
  };
};

export const createTestStore = (preloadedState?: TestPreloadedState) => {
  const config: Parameters<typeof configureStore>[0] = {
    reducer: {
      selection: selectionReducer,
    },
  };

  // Add preloadedState if provided
  if (preloadedState) {
    config.preloadedState = preloadedState;
  }

  return configureStore(config);
};

// export const renderWithRouter = (
//   component: React.ReactNode,
//   initialEntries: string[] = ['/'],
//   preloadedState?: Partial<RootState>
// ) => {
//   const testStore = createTestStore(preloadedState);

//   return render(
//     <Provider store={testStore}>
//       <ThemeProvider>
//         <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
//       </ThemeProvider>
//     </Provider>
//   );
// };
