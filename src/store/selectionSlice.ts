import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SelectionState {
  selectedIds: number[];
}

const STORAGE_KEY = 'selectedIds';

const loadInitial = (): number[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
};

const initialState: SelectionState = {
  selectedIds: loadInitial(),
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    toggleSelected(state, action: PayloadAction<number>) {
      const id = action.payload;
      const idx = state.selectedIds.indexOf(id);
      if (idx >= 0) {
        state.selectedIds.splice(idx, 1);
      } else {
        state.selectedIds.push(id);
      }
    },
    select(state, action: PayloadAction<number>) {
      if (!state.selectedIds.includes(action.payload)) {
        state.selectedIds.push(action.payload);
      }
    },
    unselect(state, action: PayloadAction<number>) {
      state.selectedIds = state.selectedIds.filter((i) => i !== action.payload);
    },
    setSelected(state, action: PayloadAction<number[]>) {
      state.selectedIds = action.payload;
    },
  },
});

export const { toggleSelected, select, unselect, setSelected } =
  selectionSlice.actions;
export default selectionSlice.reducer;
export type { SelectionState };
