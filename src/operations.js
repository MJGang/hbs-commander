export function executeOperations(operations, target) {
  const lines = target.split('\n')

  // 从后往前处理操作，避免影响位置
  operations
    .sort((a, b) => b.startIndex - a.startIndex)
    .forEach((op) => {
      if (op.type === 'insert') {
        handleInsert(op, lines)
      } else if (op.type === 'replace') {
        handleReplace(op, lines)
      }
    })

  return lines.join('\n')
}

function handleInsert(op, lines) {
  const { startRow, startCol } = op.attrs
  if (startRow === undefined || startCol === undefined) {
    throw new Error('Missing required position attributes for insert operation')
  }

  if (startRow < 0 || startRow >= lines.length) {
    throw new Error(`Invalid startRow: ${startRow}`)
  }

  const line = lines[startRow]
  const newLine = line.slice(0, startCol) + op.content + line.slice(startCol)
  lines[startRow] = newLine
}

function handleReplace(op, lines) {
  const { startRow, startCol, endRow, endCol } = op.attrs
  if (
    startRow === undefined ||
    startCol === undefined ||
    endRow === undefined ||
    endCol === undefined
  ) {
    throw new Error('Missing required position attributes for replace operation')
  }

  if (startRow < 0 || startRow >= lines.length || endRow < 0 || endRow >= lines.length) {
    throw new Error(`Invalid row range: ${startRow}-${endRow}`)
  }

  // 处理开始行
  const startLine = lines[startRow]
  lines[startRow] = startLine.slice(0, startCol) + op.content

  // 处理中间行
  for (let i = startRow + 1; i < endRow; i++) {
    lines[i] = ''
  }

  // 处理结束行
  if (startRow !== endRow) {
    lines[endRow] = op.content + lines[endRow].slice(endCol)
  }
}
