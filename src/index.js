import { parseTemplate } from './parser.js'
import { executeOperations } from './operations.js'
import fs from 'fs/promises'

class HbsCommander {
  async cmd({ template, target }) {
    const templateContent = await fs.readFile(template, 'utf-8')
    const targetContent = await fs.readFile(target, 'utf-8')

    const operations = parseTemplate(templateContent)
    const result = executeOperations(operations, targetContent)

    await fs.writeFile(target, result)
  }
}

export default HbsCommander
