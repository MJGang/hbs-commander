import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import HbsCommander from '../../dist/hbs-commander.esm.js'
import fs from 'fs'
import path from 'path'

describe('HbsCommander 插入模式测试', () => {
  const commander = new HbsCommander()
  const testDir = path.join(__dirname, 'target')
  const templateDir = path.join(__dirname, 'template')
  const testFiles = [
    {
      template: {
        filename: 'insert_inline.hbs',
        content: `{{!-- insert :startRow="0" :startCol="0" --}}// 新功能{{!-- /insert --}}`,
      },
      target: {
        filename: 'insert_inline.vue',
        content: `<template>
  <div>测试</div>
</template>`,
      },
    },
    {
      template: {
        filename: 'insert_notInline.hbs',
        content: `
          {{!-- insert :startRow="1" :startCol="18" --}}
          // 新功能
          {{!-- /insert --}}
        `,
      },
      target: {
        filename: 'insert_notInline.vue',
        content: `<script>
  export default {}
</script>
<template>
  <div>测试</div>
</template>`,
      },
    },
    {
      template: {
        filename: 'insert_invalid.hbs',
        content: `
          {{!-- insert :startRow="100" :startCol="0" --}}
          // 新功能
          {{!-- /insert --}}
        `,
      },
      target: {
        filename: 'insert_invalid.vue',
        content: `
          <template>
            <div>测试</div>
          </template>
        `,
      },
    },
  ]

  beforeAll(() => {
    fs.mkdirSync(testDir, { recursive: true })
    fs.mkdirSync(templateDir, { recursive: true })
  })

  beforeEach(async (context) => {
    const index = (context.task.name.match(/\d+/)?.[0] || 1) - 1
    fs.mkdirSync(testDir, { recursive: true })
    fs.mkdirSync(templateDir, { recursive: true })

    const testCase = testFiles[index]
    if (!testCase) {
      throw new Error(`Test case ${index} not found`)
    }

    const {
      template: { filename: templateFilename, content: templateContent },
      target: { filename: targetFilename, content: targetContent },
    } = testCase

    context.templatePath = path.join(templateDir, templateFilename)
    context.targetPath = path.join(testDir, targetFilename)

    fs.writeFileSync(context.templatePath, templateContent)
    fs.writeFileSync(context.targetPath, targetContent)
  })

  it('1. 应该在指定位置插入内容', async ({ templatePath, targetPath }) => {
    await commander.cmd({
      template: templatePath,
      target: targetPath,
    })

    const result = fs.readFileSync(targetPath, 'utf-8')

    expect(result).toContain('// 新功能')
    expect(result).toContain('<template>')
  })

  it('2. 应该正确处理范围插入', async ({ templatePath, targetPath }) => {
    await commander.cmd({
      template: templatePath,
      target: targetPath,
    })

    const result = fs.readFileSync(targetPath, 'utf-8')

    expect(result).toMatch(/<script>[\s\S]*\/\/ 新功能[\s\S]*<template>/)
  })

  // it('3. 当位置超出边界时应抛出错误', async ({ templatePath, targetPath }) => {
  //   await expect(
  //     commander.cmd({
  //       template: templatePath,
  //       target: targetPath,
  //     }),
  //   ).rejects.toThrow()
  // })
})
