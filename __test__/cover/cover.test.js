import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import hbscmd from '../../dist/hbs-commander.esm.js'
import fs from 'fs'
import path from 'path'

describe('cover 模式测试', () => {
  const targetDir = path.join(__dirname, 'target')
  const templateDir = path.join(__dirname, 'template')
  const testFiles = [
    {
      template: {
        filename: 'cover.hbs',
        content: `{{!-- cover --}}// cover 内容{{!-- /cover --}}`,
      },
      target: {
        filename: 'cover.vue',
        content: `<template>
  <div>测试</div>
</template>`,
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
    // 清空template和target目录
    const clearDirectory = (dir) => {
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach((file) => {
          const filePath = path.join(dir, file)
          if (fs.lstatSync(filePath).isFile()) {
            fs.unlinkSync(filePath)
          }
        })
      }
    }
    clearDirectory(templateDir)
    clearDirectory(targetDir)

    const index = (context.task.name.match(/\d+/)?.[0] || 1) - 1
    fs.mkdirSync(targetDir, { recursive: true })
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
    context.targetPath = path.join(targetDir, targetFilename)
    context.templateFilename = templateFilename
    context.targetFilename = targetFilename

    fs.writeFileSync(context.templatePath, templateContent)
    fs.writeFileSync(context.targetPath, targetContent)
  })

  it('1. cover', async ({ targetPath, templateFilename, targetFilename }) => {
    await hbscmd({
      template: `./template/${templateFilename}`,
      target: `./target/${targetFilename}`,
    })

    const result = fs.readFileSync(targetPath, 'utf-8')

    expect(result).toContain('// cover 内容')
  })
})
