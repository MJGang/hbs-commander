import MagicString from 'magic-string'

function calculateIndex(target, row, col) {
  const lines = target.split('\n')
  let index = 0
  for (let i = 0; i < row - 1; i++) {
    if (i < lines.length) {
      index += lines[i].length + 1 // +1 for the newline character
    } else {
      // 如果指定的行号大于实际行数，则追加到末尾
      return target.length
    }
  }
  if (row - 1 < lines.length) {
    index += Math.min(col, lines[row - 1].length)
  }

  return index
}

export function executeOperations(operations, target) {
  const s = new MagicString(target)

  operations.forEach((op) => {
    const { attrs, content, type } = op
    switch (type) {
      case 'append':
      case 'new':
        {
          if (type === 'append' && attrs.row !== undefined && attrs.col !== undefined) {
            const index = calculateIndex(target, attrs.row, attrs.col)
            s.appendRight(index, content)
          } else {
            s.append(content)
          }
        }
        break
      case 'appendLeft':
        {
          if (attrs.index) {
            s.appendLeft(attrs.index, content)
          } else {
            const index = calculateIndex(target, attrs.row, attrs.col)
            s.appendLeft(index, content)
          }
        }
        break
      case 'appendRight':
        {
          if (attrs.index) {
            s.appendRight(attrs.index, content)
          } else {
            const index = calculateIndex(target, attrs.row, attrs.col)
            console.log('index', index)
            s.appendRight(index, content)
          }
        }
        break
      case 'overwrite':
        s.overwrite(attrs.start, attrs.end, content)
        break
      case 'cover':
        s.overwrite(0, s.original.length, content)
        break
      case 'prepend':
        s.prepend(content)
        break
      case 'prependLeft':
        s.prependLeft(attrs.index, content)
        break
      case 'prependRight':
        s.prependRight(attrs.index, content)
        break
      case 'replace':
        s.replace(attrs.regexpOrString, content)
        break
      case 'replaceAll':
        s.replaceAll(attrs.regexpOrString, content)
        break
      case 'update':
        s.update(attrs.start, attrs.end, content)
        break

      default:
        throw new Error(`Unknown operation type: ${op.type}`)
    }
  })

  return s.toString()
}
