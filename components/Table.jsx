/**
 * columns: [{ key, header, render?(row) }]
 * rows: array of data objects
 */
export default function Table({ columns, rows, emptyMessage = 'Nothing here yet.', onRowClick }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-brand-100 py-12 text-center text-sm text-brand-500">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-brand-100">
      <table className="min-w-full divide-y divide-brand-100 text-sm">
        <thead className="bg-brand-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-medium text-brand-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-100 bg-white">
          {rows.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-brand-50' : ''}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-brand-900">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
