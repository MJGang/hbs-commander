import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import HbsCommander from '../../src/index.js'
import fs from 'fs'
import path from 'path'

describe('HbsCommander 替换模式测试', () => {
  const commander = new HbsCommander()
  const testDir = path.join(__dirname, 'target')
  const templateDir = path.join(__dirname, 'template')
  const testFiles = [
    {
      template: {
        filename: 'replace.hbs',
        content: `
          {{!-- replace :startRow="1" :startCol="2" :endRow="1" :endCol="14" --}}
          <div>替换内容</div>
          {{!-- /replace --}}
        `,
      },
      target: {
        filename: 'replace.vue',
        content: `<template>
  <div>测试</div>
</template>`,
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

  it('1. 应该在指定位置替换内容', async ({ templatePath, targetPath }) => {
    await commander.cmd({
      template: templatePath,
      target: targetPath,
    })

    const result = fs.readFileSync(targetPath, 'utf-8')

    expect(result).toContain('<div>替换内容</div>')
    expect(result).toContain('<template>')
  })
})
