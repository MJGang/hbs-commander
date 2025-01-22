import { parseTemplate } from './parser.js'
import { executeOperations } from './operations.js'
import fs from 'node:fs/promises'
import path from 'node:path'

async function hbsCommander({ template, target }) {
  const cwd = process.cwd()
  // 解析路径
  const resolvePath = (filePath) => {
    if (path.isAbsolute(filePath)) {
      return filePath
    }
    return path.resolve(cwd, filePath)
  }

  try {
    // 读取文件
    const templatePath = resolvePath(template)
    const targetPath = resolvePath(target)
    console.log('templatePath', templatePath)
    console.log('targetPath', targetPath)

    const [templateContent, targetContent] = await Promise.all([
      fs.readFile(templatePath, 'utf-8'),
      fs.readFile(targetPath, 'utf-8'),
    ])

    // 解析模板并执行操作
    console.log('templateContent', templateContent)
    console.log('targetContent', targetContent)
    const operations = parseTemplate(templateContent)
    const result = executeOperations(operations, targetContent)

    // 写入结果
    await fs.writeFile(targetPath, result)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

export default hbsCommander
