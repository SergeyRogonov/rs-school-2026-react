import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from './pokemonSlice';
import selectionReducer from './selectionSlice';

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    selection: selectionReducer,
  },
});

store.subscribe(() => {
  try {
    const state = store.getState();
    const ids = state.selection.selectedIds;
    localStorage.setItem('selectedIds', JSON.stringify(ids));
  } catch (error) {
    console.warn('Unable to persist selectedIds to localStorage', error);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
