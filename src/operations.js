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
    let insertContent = content
    if (attrs?.newLine) {
      insertContent = '\n' + content
    }
    switch (type) {
      case 'append':
      case 'new':
        s.append(insertContent)
        break
      case 'appendLeft':
        {
          if (attrs.index) {
            s.appendLeft(attrs.index, insertContent)
          } else {
            const index = calculateIndex(target, attrs.row, attrs.col)
            s.appendLeft(index, insertContent)
          }
        }
        break
      case 'appendRight':
        {
          if (attrs.index) {
            s.appendRight(attrs.index, insertContent)
          } else {
            const index = calculateIndex(target, attrs.row, attrs.col)
            console.log('index', index)
            s.appendRight(index, insertContent)
          }
        }
        break
      case 'overwrite':
        s.overwrite(attrs.start, attrs.end, insertContent)
        break
      case 'cover':
        s.overwrite(0, s.original.length, insertContent)
        break
      case 'prepend':
        s.prepend(insertContent)
        break
      case 'prependLeft':
        s.prependLeft(attrs.index, insertContent)
        break
      case 'prependRight':
        s.prependRight(attrs.index, insertContent)
        break
      case 'replace':
        s.replace(attrs.regexpOrString, insertContent)
        break
      case 'replaceAll':
        s.replaceAll(attrs.regexpOrString, insertContent)
        break
      case 'update':
        s.update(attrs.start, attrs.end, insertContent)
        break

      default:
        throw new Error(`Unknown operation type: ${op.type}`)
    }
  })

  return s.toString()
}
