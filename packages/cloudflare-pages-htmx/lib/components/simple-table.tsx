import type { FC } from 'react';

export const SimpleTable: FC<{
  data?: Record<string, any>[];
}> = ({ data }) => {
  const columns = new Set<string>();

  for (const row of data ?? []) {
    for (const col of Object.keys(row)) {
      columns.add(col);
    }
  }

  return (
    <table>
      <thead>
        <tr>
          {[...columns].map((col) => (
            <th className="border p-2">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((row) => (
          <tr>
            {[...columns].map((col) => (
              <td className="border p-2">{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
