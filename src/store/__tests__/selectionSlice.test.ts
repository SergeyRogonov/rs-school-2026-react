import { describe, expect, it } from 'vitest';
import selectionReducer, {
  toggleSelected,
  select,
  unselect,
  setSelected,
} from '../selectionSlice';

describe('selectionSlice reducer', () => {
  it('adds an id when toggleSelected is dispatched for an unselected id', () => {
    const nextState = selectionReducer({ selectedIds: [] }, toggleSelected(1));

    expect(nextState.selectedIds).toEqual([1]);
  });

  it('removes an id when toggleSelected is dispatched for a selected id', () => {
    const nextState = selectionReducer({ selectedIds: [1] }, toggleSelected(1));

    expect(nextState.selectedIds).toEqual([]);
  });

  it('select action adds an id only once', () => {
    const first = selectionReducer({ selectedIds: [] }, select(1));
    expect(first.selectedIds).toEqual([1]);

    const second = selectionReducer(first, select(1));
    expect(second.selectedIds).toEqual([1]);
  });

  it('unselect action removes an id', () => {
    const nextState = selectionReducer({ selectedIds: [1, 2] }, unselect(1));

    expect(nextState.selectedIds).toEqual([2]);
  });

  it('setSelected replaces the selectedIds array', () => {
    const nextState = selectionReducer(
      { selectedIds: [1, 2] },
      setSelected([3, 4])
    );

    expect(nextState.selectedIds).toEqual([3, 4]);
  });
});
