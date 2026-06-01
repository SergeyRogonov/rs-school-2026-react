import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SelectionState {
  selectedIds: number[];
}

const initialState: SelectionState = {
  selectedIds: [],
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
    unselectAll(state) {
      state.selectedIds = [];
    },
  },
});

export const { toggleSelected, unselectAll } = selectionSlice.actions;
export default selectionSlice.reducer;
export type { SelectionState };
