import { describe, expect, it } from 'vitest';
import selectionReducer, {
  toggleSelected,
  unselectAll,
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

  it('toggleSelected removes id when already selected', () => {
    const first = selectionReducer({ selectedIds: [] }, toggleSelected(1));
    expect(first.selectedIds).toEqual([1]);

    const second = selectionReducer(first, toggleSelected(1));
    expect(second.selectedIds).toEqual([]);
  });

  it('toggleSelected removes specific id from multiple selections', () => {
    const nextState = selectionReducer(
      { selectedIds: [1, 2] },
      toggleSelected(1)
    );

    expect(nextState.selectedIds).toEqual([2]);
  });

  it('unselectAll clears all selections and toggleSelected adds new ones', () => {
    const clearedState = selectionReducer(
      { selectedIds: [1, 2] },
      unselectAll()
    );
    const nextState = selectionReducer(clearedState, toggleSelected(3));
    const finalState = selectionReducer(nextState, toggleSelected(4));

    expect(finalState.selectedIds).toEqual([3, 4]);
  });
});
