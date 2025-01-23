import { parseTemplate } from './parser.js'
import { executeOperations } from './operations.js'
import fs from 'node:fs/promises'
import { existsSync } from 'fs'
import path from 'node:path'

async function hbsCommander({ template, target, mode = 'comment', type, attrs }) {
  // 验证mode参数
  if (!['comment', 'config'].includes(mode)) {
    throw new Error(`Invalid mode: ${mode}. Must be either 'comment' or 'config'`)
  }
  if (mode === 'config' && !type) {
    throw new Error('Type is required when mode is "config"')
  }
  const cwd = process.cwd()
  // 解析路径
  const resolvePath = (filePath) => {
    if (path.isAbsolute(filePath)) {
      return filePath
    }
    return path.resolve(cwd, filePath)
  }

  // 读取文件
  const templatePath = resolvePath(template)
  const targetPath = resolvePath(target)

  let templateContent = ''
  // 检查模板文件是否存在
  if (existsSync(templatePath)) {
    templateContent = await fs.readFile(templatePath, 'utf-8')
  } else {
    throw new Error(`Template file not found: ${templatePath}`)
  }

  // 解析模板并执行操作
  const operations = parseTemplate(templateContent, mode, type, attrs)

  // 如果目标文件不存在则创建空文件
  let targetContent = ''
  if (existsSync(targetPath)) {
    if (operations.some((op) => op.type === 'new')) {
      throw new Error(`target file already exists: ${targetPath}`)
    } else {
      targetContent = await fs.readFile(targetPath, 'utf-8')
    }
  } else {
    if (operations.some((op) => op.type === 'new')) {
      await fs.writeFile(targetPath, '')
    } else {
      throw new Error(`target file not found: ${targetPath}`)
    }
  }

  const result = executeOperations(operations, targetContent)

  // 写入结果
  await fs.writeFile(targetPath, result)
}

export default hbsCommander
