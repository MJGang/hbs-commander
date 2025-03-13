import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest'
import hbscmd from '../../src/index.js'
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

describe('竞态条件测试', () => {
  const targetDir = path.join(__dirname, 'target')
  const templateDir = path.join(__dirname, 'template')

  // 清理目录的辅助函数
  const clearDirectory = async (dir) => {
    if (existsSync(dir)) {
      const files = await fs.readdir(dir)
      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(dir, file)
          const stat = await fs.stat(filePath)
          if (stat.isFile()) {
            await fs.unlink(filePath)
          }
        }),
      )
    } else {
      await fs.mkdir(dir, { recursive: true })
    }
  }

  beforeAll(async () => {
    // 确保目录存在
    await fs.mkdir(templateDir, { recursive: true })
    await fs.mkdir(targetDir, { recursive: true })
    // 将当前工作目录切换到测试文件所在目录
    process.chdir(__dirname)
  })

  beforeEach(async () => {
    // 清空目录
    await clearDirectory(templateDir)
    await clearDirectory(targetDir)

    // 创建测试模板文件
    await fs.writeFile(
      path.join(templateDir, 'appendRight1.hbs'),
      `{{!-- appendRight :row="2" :col="10" --}}内容1{{!-- /appendRight --}}`,
    )
    await fs.writeFile(
      path.join(templateDir, 'appendRight2.hbs'),
      `{{!-- appendRight :row="2" :col="10" --}}内容2{{!-- /appendRight --}}`,
    )

    // 创建目标文件
    await fs.writeFile(
      path.join(targetDir, 'target.js'),
      `line 1
line 2
line 3`,
    )
  })

  afterEach(async () => {
    // 清理缓存
    hbscmd.clearFileCache()
  })

  it('不使用延迟写入时应该出现竞态条件', async () => {
    // 并发执行两个操作，修改同一个文件的同一位置
    await Promise.all([
      hbscmd({
        template: path.join(templateDir, 'appendRight1.hbs'),
        target: path.join(targetDir, 'target.js'),
      }),
      hbscmd({
        template: path.join(templateDir, 'appendRight2.hbs'),
        target: path.join(targetDir, 'target.js'),
      }),
    ])

    // 读取结果
    const result = await fs.readFile(path.join(targetDir, 'target.js'), 'utf-8')

    // 由于竞态条件，只有一个修改会生效
    expect(result.includes('内容1') || result.includes('内容2')).toBe(true)
    // 不可能两个都存在
    expect(result.includes('内容1') && result.includes('内容2')).toBe(false)
  })

  it('使用延迟写入时应该正确处理竞态条件', async () => {
    // 并发执行两个操作，但使用延迟写入
    await Promise.all([
      hbscmd({
        template: path.join(templateDir, 'appendRight1.hbs'),
        target: path.join(targetDir, 'target.js'),
        deferWrite: true,
      }),
      hbscmd({
        template: path.join(templateDir, 'appendRight2.hbs'),
        target: path.join(targetDir, 'target.js'),
        deferWrite: true,
      }),
    ])

    // 手动触发写入
    await hbscmd.flushFileCache()

    // 读取结果
    const result = await fs.readFile(path.join(targetDir, 'target.js'), 'utf-8')

    // 两个修改都应该生效
    expect(result.includes('内容1')).toBe(true)
    expect(result.includes('内容2')).toBe(true)
  })
})
