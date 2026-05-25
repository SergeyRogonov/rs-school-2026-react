import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { searchPokemon, fetchPokemonList } from '../services/pokemonService';
import type { Pokemon } from '../types/types';
import { ITEMS_PER_PAGE } from '../constants/pokemon';

interface PokemonState {
  items: Pokemon[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  searchTerm: string;
  lastQuery: string | null;
}

const initialState: PokemonState = {
  items: [],
  loading: true,
  error: null,
  currentPage: 1,
  searchTerm: '',
  lastQuery: null,
};

export const loadPokemon = createAsyncThunk<
  Pokemon[],
  { query: string; page: number },
  { rejectValue: string }
>('pokemon/loadPokemon', async ({ query, page }, thunkAPI) => {
  try {
    if (query) {
      const data = await searchPokemon(query);
      if (!data) {
        return thunkAPI.rejectWithValue(`Pokémon "${query}" not found`);
      }
      return [data];
    }

    return await fetchPokemonList(ITEMS_PER_PAGE, page);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
});

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    clearPokemon(state) {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPokemon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPokemon.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
        state.lastQuery = action.meta.arg.query;
        state.currentPage = action.meta.arg.page;
        state.searchTerm = action.meta.arg.query;
      })
      .addCase(loadPokemon.rejected, (state, action) => {
        state.items = [];
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? 'An error occurred';
      });
  },
});

export const { setSearchTerm, setCurrentPage, clearPokemon } =
  pokemonSlice.actions;
export default pokemonSlice.reducer;
