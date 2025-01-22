import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import hbscmd from '../dist/hbs-commander.esm.js'
import fs from 'fs'
import path from 'path'

describe('new 模式测试', () => {
  const targetDir = path.join(__dirname, 'target')
  const templateDir = path.join(__dirname, 'template')
  const testFiles = [
    {
      template: {
        filename: 'new.hbs',
        content: `{{!-- new --}}// new 内容{{!-- /new --}}`,
      },
    },
  ]

  beforeAll(() => {
    fs.mkdirSync(targetDir, { recursive: true })
    fs.mkdirSync(templateDir, { recursive: true })
    // 将当前工作目录切换到测试文件所在目录
    process.chdir(__dirname)
  })

  beforeEach(async (context) => {
    const index = (context.task.name.match(/\d+/)?.[0] || 1) - 1

    const testCase = testFiles[index]
    if (!testCase) {
      throw new Error(`Test case ${index} not found`)
    }

    const {
      template: { filename: templateFilename, content: templateContent },
    } = testCase

    context.templatePath = path.join(templateDir, templateFilename)
    context.templateFilename = templateFilename

    fs.writeFileSync(context.templatePath, templateContent)
  })

  it('1. new', async ({ templateFilename }) => {
    await hbscmd({
      template: `./template/${templateFilename}`,
      target: `./target/new.vue`,
    })

    const result = fs.readFileSync(path.join(targetDir, './new.vue'), 'utf-8')

    expect(result).toContain('// new 内容')
  })
})
