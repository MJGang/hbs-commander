import MagicString from 'magic-string'

// 文件操作缓存，用于存储每个文件路径对应的 MagicString 实例
const fileCache = new Map()

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

// 清除文件缓存
export function clearFileCache() {
  fileCache.clear()
}

// 获取文件缓存
export function getFileCache() {
  return fileCache
}

// 手动触发所有缓存文件的写入
export async function applyDeferredWrites(fs) {
  const promises = []
  for (const [filePath, { magicString }] of fileCache.entries()) {
    promises.push(fs.writeFile(filePath, magicString.toString()))
  }
  await Promise.all(promises)
  clearFileCache()
  return promises.length
}

export function executeOperations(operations, target, options = {}) {
  const { filePath, deferWrite } = options

  let s

  // 如果提供了文件路径且启用了延迟写入，尝试从缓存中获取 MagicString 实例
  if (filePath && deferWrite) {
    if (fileCache.has(filePath)) {
      s = fileCache.get(filePath).magicString
    } else {
      s = new MagicString(target)
      fileCache.set(filePath, { magicString: s, originalContent: target })
    }
  } else {
    s = new MagicString(target)
  }

  operations.forEach((op) => {
    const { attrs, content, type } = op
    let insertContent = content
    if (attrs?.newLine) {
      insertContent = '\n' + content
    }
    switch (type) {
      case 'append':
        if (attrs && attrs.row !== undefined && attrs.col !== undefined) {
          // 如果指定了行列，使用 appendRight
          const index = calculateIndex(target, attrs.row, attrs.col)
          s.appendRight(index, insertContent)
        } else {
          // 否则追加到末尾
          s.append(insertContent)
        }
        break
      case 'new':
        s.append(insertContent)
        break
      case 'appendLeft':
        {
          if (attrs.index !== undefined) {
            s.appendLeft(attrs.index, insertContent)
          } else if (attrs.row !== undefined && attrs.col !== undefined) {
            const index = calculateIndex(target, attrs.row, attrs.col)
            s.appendLeft(index, insertContent)
          } else {
            throw new Error('appendLeft requires either index or row and col attributes')
          }
        }
        break
      case 'appendRight':
        {
          if (attrs.index !== undefined) {
            s.appendRight(attrs.index, insertContent)
          } else if (attrs.row !== undefined && attrs.col !== undefined) {
            const index = calculateIndex(target, attrs.row, attrs.col)
            s.appendRight(index, insertContent)
          } else {
            throw new Error('appendRight requires either index or row and col attributes')
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
