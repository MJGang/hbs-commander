const State = {
  TEXT: 'TEXT',
  OPEN_TAG_START: 'OPEN_TAG_START',
  OPEN_TAG: 'OPEN_TAG',
  CLOSE_TAG: 'CLOSE_TAG',
}

export function parseTemplate(template, mode = 'comment', type, attrs) {
  if (mode === 'config') {
    // 从配置选项读取操作
    return [
      {
        type,
        content: template,
        attrs,
      },
    ]
  }
  const operations = []
  const stack = []

  let state = State.TEXT
  let buffer = ''
  let currentTag = null
  let contentStart = 0

  for (let i = 0; i < template.length; i++) {
    const char = template[i]

    switch (state) {
      case State.TEXT:
        if (char === '{' && template[i + 1] === '{') {
          i++
          if (
            template[i + 1] === '!' &&
            template[i + 2] === '-' &&
            template[i + 3] === '-' &&
            template[i + 4] === ' ' &&
            template[i + 5] === '/'
          ) {
            i += 5
            state = State.CLOSE_TAG
            buffer = ''
          } else if (
            template[i + 1] === '!' &&
            template[i + 2] === '-' &&
            template[i + 3] === '-'
          ) {
            i += 3
            state = State.OPEN_TAG_START
          }
        } else {
          // 普通文本
          buffer += char
        }
        break

      case State.OPEN_TAG_START:
        if (char === ' ') {
          state = State.OPEN_TAG
          buffer = ''
        }
        break

      case State.OPEN_TAG:
        if (
          char === '-' &&
          template[i + 1] === '-' &&
          template[i + 2] === '}' &&
          template[i + 3] === '}'
        ) {
          i += 3
          const tagMatch = buffer.match(/^(\w+)(.*)$/)
          if (tagMatch) {
            const [, tagName, attrsStr] = tagMatch
            currentTag = {
              type: tagName,
              attrs: parseAttributes(attrsStr),
              startIndex: i - buffer.length - 6 - 3, // 6 for {{!-- 3 for -}}
            }
            stack.push(currentTag)
            contentStart = i + 1
          } else {
            throw new Error(`Invalid tag format: ${buffer}`)
          }

          state = State.TEXT
          buffer = ''
        } else {
          buffer += char
        }
        break

      case State.CLOSE_TAG:
        if (
          char === '-' &&
          template[i + 1] === '-' &&
          template[i + 2] === '}' &&
          template[i + 3] === '}'
        ) {
          i += 3
          const tagName = buffer.trim()
          if (stack.length === 0 || stack[stack.length - 1].type !== tagName) {
            throw new Error(`Invalid closing tag: ${tagName}`)
          }

          const openTag = stack.pop()
          const operation = {
            type: openTag.type,
            content: template
              .slice(contentStart, i - buffer.length - 4 - 7 + 1)
              .trimStart()
              .trimEnd(), // 4 for --}} 7 for {{!-- /
            attrs: openTag.attrs,
            startIndex: openTag.startIndex,
            endIndex: i,
          }
          operations.push(operation)

          state = State.TEXT
          buffer = ''
        } else {
          buffer += char
        }
        break
    }
  }

  if (stack.length > 0) {
    throw new Error(`Unclosed tag: ${stack[stack.length - 1].type}`)
  }

  return operations
}

function parseAttributes(attrsStr) {
  const attrs = {}
  const regex = /:(\w+)="([^"]*)"/g
  let match

  while ((match = regex.exec(attrsStr)) !== null) {
    const [, key, value] = match
    attrs[key] = parseValue(value)
  }

  return attrs
}

function parseValue(value) {
  try {
    if (value.startsWith("'") && value.endsWith("'")) {
      return value.slice(1, -1)
    }
    if (value === 'true' || value === 'false') {
      return value === 'true'
    }
    if (!isNaN(Number(value))) {
      return Number(value)
    }
    if (value.startsWith('{') || value.startsWith('[')) {
      return new Function(`return ${value}`)()
    }
    return value
  } catch {
    throw new Error(`Invalid value: ${value}`)
  }
}
