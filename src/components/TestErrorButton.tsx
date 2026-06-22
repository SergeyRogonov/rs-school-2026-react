'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TestErrorButton() {
  const t = useTranslations();
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error triggered by user');
  }

  const handleTestError = () => {
    setShouldThrow(true);
  };

  return (
    <button
      onClick={handleTestError}
      className="px-0 py-0 sm:px-3 sm:py-1 font-bold text-sm bg-red-700 text-white rounded hover:bg-red-800 w-12 sm:w-auto whitespace-pre-line sm:whitespace-normal"
    >
      {t('testErrorButton')}
    </button>
  );
}
