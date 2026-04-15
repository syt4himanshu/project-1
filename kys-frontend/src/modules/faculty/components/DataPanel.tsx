import type { ReactNode } from 'react'

function labelize(key: string) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null && !Array.isArray(v) && !(v instanceof Date)
}

function formatValue(v: unknown): string {
    if (v === null || v === undefined) return '—'
    if (typeof v === 'boolean') return v ? 'Yes' : 'No'
    if (typeof v === 'number' || typeof v === 'string') {
        const text = String(v)
        if (text === 'HSSC') return 'HSC'
        return text || '—'
    }
    return JSON.stringify(v)
}

export function FieldGrid({
    data,
    omit = [],
}: {
    data: Record<string, unknown>
    omit?: string[]
}) {
    const entries = Object.entries(data).filter(
        ([k]) => !omit.includes(k) && k !== 'id' && !k.endsWith('_id'),
    )
    if (!entries.length)
        return <p className="text-sm text-gray-500 dark:text-gray-400">No data</p>

    return (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {entries.map(([key, val]) => {
                if (isPlainObject(val) || Array.isArray(val)) return null
                return (
                    <div key={key} className="border-b border-gray-100 dark:border-gray-700 pb-2 sm:border-0 sm:pb-0">
                        <dt className="text-gray-500 dark:text-gray-400">{labelize(key)}</dt>
                        <dd className="text-gray-900 dark:text-white font-medium break-words">
                            {formatValue(val)}
                        </dd>
                    </div>
                )
            })}
        </dl>
    )
}

export function DataPanel({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <h3 className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                {title}
            </h3>
            <div className="p-4">{children}</div>
        </section>
    )
}

export function ObjectSection({ title, obj }: { title: string; obj: unknown }) {
    if (!obj || !isPlainObject(obj)) {
        return (
            <DataPanel title={title}>
                <p className="text-sm text-gray-500 dark:text-gray-400">Not filled in yet</p>
            </DataPanel>
        )
    }
    return (
        <DataPanel title={title}>
            <FieldGrid data={obj} />
        </DataPanel>
    )
}

export function ArraySection({
    title,
    rows,
    rowTitle,
}: {
    title: string
    rows: unknown
    rowTitle?: (row: Record<string, unknown>, i: number) => string
}) {
    if (!Array.isArray(rows) || rows.length === 0) {
        return (
            <DataPanel title={title}>
                <p className="text-sm text-gray-500 dark:text-gray-400">None recorded</p>
            </DataPanel>
        )
    }
    return (
        <DataPanel title={title}>
            <ul className="space-y-4">
                {rows.map((row, i) =>
                    isPlainObject(row) ? (
                        <li key={i} className="rounded-lg border border-gray-100 dark:border-gray-600 p-3">
                            {rowTitle && (
                                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                                    {rowTitle(row, i)}
                                </p>
                            )}
                            <FieldGrid data={row} />
                        </li>
                    ) : (
                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                            {formatValue(row)}
                        </li>
                    ),
                )}
            </ul>
        </DataPanel>
    )
}
