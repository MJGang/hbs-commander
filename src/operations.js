import MagicString from 'magic-string'

export function executeOperations(operations, target) {
  const s = new MagicString(target)

  operations.forEach((op) => {
    const { attrs, content, type } = op
    switch (type) {
      case 'append':
      case 'new':
        s.append(content)
        break
      case 'appendLeft':
        s.appendLeft(attrs.index, content)
        break
      case 'appendRight':
        s.appendRight(attrs.index, content)
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
