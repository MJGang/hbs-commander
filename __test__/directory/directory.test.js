import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import hbsCommander from '../../src/index.js'

describe('目录递归处理测试', () => {
  const testDir = path.join(process.cwd(), '__test__/directory/test-temp')
  const templateDir = path.join(testDir, 'templates')
  const targetDir = path.join(testDir, 'target')

  beforeAll(async () => {
    // 清理旧测试目录（新增部分）
    try {
      await fs.access(testDir)
      await fs.rm(testDir, { recursive: true, force: true })
    } catch {
      // 目录不存在时忽略错误
    }

    // 创建新的测试目录结构
    await fs.mkdir(templateDir, { recursive: true })
    await fs.mkdir(path.join(templateDir, 'components'), { recursive: true })

    // 创建测试模板文件
    await Promise.all([
      fs.writeFile(
        path.join(templateDir, 'main.js.hbs'),
        '{{!-- new --}}\n// Main Content\n{{!-- /new --}}',
      ),
      fs.writeFile(
        path.join(templateDir, 'components', 'button.html.hbs'),
        '{{!-- new --}}\n<button>Click</button>\n{{!-- /new --}}',
      ),
      //   fs.writeFile(path.join(templateDir, 'ignore.txt'), 'This file should be ignored'),
    ])
  })

  it('应该递归处理目录中的所有.hbs文件', async () => {
    await hbsCommander({
      template: templateDir,
      target: targetDir,
    })

    // 验证根目录文件
    const mainContent = await fs.readFile(path.join(targetDir, 'main.js'), 'utf-8')
    expect(mainContent).toMatchInlineSnapshot('"// Main Content"')

    // 验证子目录文件
    const buttonContent = await fs.readFile(
      path.join(targetDir, 'components', 'button.html'),
      'utf-8',
    )
    expect(buttonContent).toMatchInlineSnapshot('"<button>Click</button>"')
  })

  it('当目标路径是文件时应抛出错误', async () => {
    const testFile = path.join(testDir, 'invalid-target.txt')
    await fs.writeFile(testFile, '')

    await expect(
      hbsCommander({
        template: templateDir,
        target: testFile,
      }),
    ).rejects.toThrowError('When template is a directory, target must also be a directory')
  })

  it('应该自动创建不存在的目标目录', async () => {
    const newTargetDir = path.join(testDir, 'new-target')

    await hbsCommander({
      template: templateDir,
      target: newTargetDir,
    })

    // 验证目录创建
    const dirStat = await fs.stat(newTargetDir)
    expect(dirStat.isDirectory()).toBe(true)

    // 验证文件复制
    const mainContent = await fs.readFile(path.join(newTargetDir, 'main.js'), 'utf-8')
    expect(mainContent).toBe('// Main Content')
  })
})
