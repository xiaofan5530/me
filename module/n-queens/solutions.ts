type Placeholder = 'Q' | '.'

export function NQueen(n = 8) {
  const results: Array<Placeholder[][]> = []
  const rows: number[] = []
  const columns: Set<number> = new Set()
  const deg45: Set<number> = new Set()
  const deg135: Set<number> = new Set()
  backtrack()
  return results

  function backtrack(row = 0) {
    if (row == n) {
      results.push(formatSolution(rows))
      return
    }
    for (let i = 0; i < n; i++) {
      if (columns.has(i) || deg45.has(row + i) || deg135.has(row - i)) {
        continue
      }
      rows[row] = i
      columns.add(i)
      deg45.add(row + i)
      deg135.add(row - i)
      backtrack(row + 1)
      rows[row] = -1
      columns.delete(i)
      deg45.delete(row + i)
      deg135.delete(row - i)
    }
  }

  function formatSolution(rows: number[]) {
    return rows.map(value => {
      let row: Placeholder[] = Array(n).fill('.')
      row[value] = 'Q'
      return row
    })
  }
}
