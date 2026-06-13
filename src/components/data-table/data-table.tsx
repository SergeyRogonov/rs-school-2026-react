import { memo } from 'react';
import type { YearData } from '../../types';
import { formatNumber } from '../../utils/format-utils';

import styles from './data-table.module.css';

type DataTableProps = {
  record?: YearData;
  year: number;
  columns: string[];
};

export const DataTable = memo(({ record, year, columns }: DataTableProps) => {
  if (!record) {
    return <div className={styles.noData}>No data available for year {year}</div>;
  }

  return (
    <table className={styles.table}>
      <tbody>
        {columns.map((column, index) => (
          <tr key={index} className={styles.row}>
            <td className={styles.labelCell}>{column.replaceAll('_', ' ').toUpperCase()}</td>
            <td className={styles.valueCell}>
              {formatNumber(record[column as keyof YearData] as number | undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
