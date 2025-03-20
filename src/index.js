import { parseTemplate } from './parser.js'
import { executeOperations, applyDeferredWrites, clearFileCache } from './operations.js'
import fs from 'node:fs/promises'
import { existsSync } from 'fs'
import path from 'node:path'

async function hbsCommander({
  template,
  target,
  mode = 'comment',
  type,
  attrs,
  deferWrite = false,
}) {
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

  // 读取文件或目录
  const processFile = async (templatePath, targetPath) => {
    let templateContent = ''
    if (existsSync(templatePath)) {
      templateContent = await fs.readFile(templatePath, 'utf-8')
    } else {
      throw new Error(`Template file not found: ${templatePath}`)
    }

    const operations = parseTemplate(templateContent, mode, type, attrs)

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

    const result = executeOperations(operations, targetContent, {
      filePath: targetPath,
      deferWrite,
    })

    // 只有在不延迟写入的情况下才立即写入文件
    if (!deferWrite) {
      await fs.writeFile(targetPath, result)
    }

    return result
  }

  const processDirectory = async (templateDir, targetDir) => {
    const files = await fs.readdir(templateDir)
    await Promise.all(
      files.map(async (file) => {
        const templatePath = path.join(templateDir, file)
        const ext = path.extname(file)
        const targetFile = ext === '.hbs' ? path.basename(file, ext) : file
        const targetPath = path.join(targetDir, targetFile)

        const stat = await fs.stat(templatePath)

        if (stat.isDirectory()) {
          if (!existsSync(targetPath)) {
            await fs.mkdir(targetPath, { recursive: true })
          }
          return processDirectory(templatePath, targetPath)
        } else if (stat.isFile()) {
          if (ext === '.hbs') {
            return processFile(templatePath, targetPath)
          } else {
            return Promise.resolve()
          }
        }
      }),
    )
  }

  const templatePath = resolvePath(template)
  const targetPath = resolvePath(target)

  const templateStat = await fs.stat(templatePath)
  const targetStat = existsSync(targetPath) ? await fs.stat(targetPath) : null

  if (templateStat.isDirectory()) {
    if (targetStat && !targetStat.isDirectory()) {
      throw new Error('When template is a directory, target must also be a directory')
    }
    if (!existsSync(targetPath)) {
      await fs.mkdir(targetPath, { recursive: true })
    }
    await processDirectory(templatePath, targetPath)
  } else {
    if (targetStat && targetStat.isDirectory()) {
      throw new Error('When template is a file, target must also be a file')
    }
    await processFile(templatePath, targetPath)
  }
}

// 导出主函数和辅助函数
hbsCommander.applyDeferredWrites = async () => await applyDeferredWrites(fs)
hbsCommander.clearFileCache = clearFileCache

export default hbsCommander
