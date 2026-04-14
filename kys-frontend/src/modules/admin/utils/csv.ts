export function parseCsv(text: string): Record<string, string>[] {
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim()
  if (!normalized) return []

  const rows: string[][] = []
  let currentRow: string[] = []
  let currentValue = ''
  let inQuotes = false

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index]
    const nextChar = normalized[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentValue.trim())
      currentValue = ''
      continue
    }

    if (char === '\n' && !inQuotes) {
      currentRow.push(currentValue.trim())
      rows.push(currentRow)
      currentRow = []
      currentValue = ''
      continue
    }

    currentValue += char
  }

  currentRow.push(currentValue.trim())
  rows.push(currentRow)

  if (rows.length < 2) return []

  const headers = rows[0].map((header) => header.replace(/^"|"$/g, '').trim())

  return rows
    .slice(1)
    .filter((row) => row.some((value) => value.trim() !== ''))
    .map((row) => Object.fromEntries(
      headers.map((header, columnIndex) => [header, row[columnIndex]?.replace(/^"|"$/g, '').trim() ?? '']),
    ))
}

export function downloadCsvTemplate(filename: string, headers: string[], sample: string[]) {
  const csv = `\uFEFF${headers.join(',')}\n${sample.join(',')}\n`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}
