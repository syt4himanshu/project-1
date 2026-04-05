interface Row { label: string; value: React.ReactNode }

export default function InfoTable({ rows }: { rows: Row[] }) {
    return (
        <table className="w-full border border-slate-200 rounded-lg overflow-hidden text-sm">
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i} className={i % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                        <th className="bg-slate-50 text-slate-600 font-medium w-1/3 px-4 py-2.5 text-left border-r border-slate-200">
                            {row.label}
                        </th>
                        <td className="text-slate-800 px-4 py-2.5">{row.value ?? '—'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
