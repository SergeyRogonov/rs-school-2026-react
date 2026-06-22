import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { unselectAll } from '../store/selectionSlice';
import { downloadCsv } from '../utils/downloadCSVHelpers';

export default function SelectionFlyout() {
  const t = useTranslations('selectionFlyout');
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector((state) => state.selection.selectedIds);
  const selectedCount = selectedIds.length;

  const handleUnselectAll = () => {
    dispatch(unselectAll());
  };

  const handleDownload = async () => {
    if (!selectedIds.length) return;

    const response = await fetch('/api/export-csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids: selectedIds,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate CSV');
    }

    const csv = await response.text();

    downloadCsv(csv, `${selectedIds.length}-selected-pokemon.csv`);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex gap-3 flex-row justify-between">
      <div className="flex-col">
        <span className="text-sm font-semibold text-black">
          {t('selectedItems')}: {selectedCount}
        </span>
      </div>

      <div className="flex gap-2 flex-row">
        <button
          type="button"
          onClick={handleUnselectAll}
          className="rounded bg-(--bg-secondary) px-3 py-1 text-sm font-medium text-(--text-primary) transition hover:bg-(--bg-secondary-hover)"
        >
          {t('unselectAll')}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="rounded bg-(--brand-header) px-3 py-1 text-sm font-medium text-(--bg-secondary) transition hover:bg-(--brand-header-hover)"
        >
          {t('download')}
        </button>
      </div>
    </div>
  );
}
