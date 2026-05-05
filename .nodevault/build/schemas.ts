/* eslint-disable quotes */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { generate as generateOpenApi } from 'openapi-typescript-codegen'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ensureFolderExistsSync = (path: string): void => {
  try {
    mkdirSync(path)
  } catch {
    /* empty */
  }
}

const generate = async (doc: string, input: string, output: string) => {
  // write the open API json file to scripts folder
  //to be used for typescript types and api client generation
  writeFileSync(input, doc)

  // generate the typescript types from the schema file
  await generateOpenApi({
    input: input,
    output: output,
    exportCore: false,
    exportServices: false,
    exportModels: true,
    indent: 'tab',
    useUnionTypes: true
  })
}

const fix = (path: string) => {
  const file = readFileSync(path, 'utf-8')
  const fixed = file.replaceAll("';", ".js'")

  writeFileSync(path, fixed, {
    encoding: 'utf-8',
    flag: 'w'
  })
}

const seedIndexFiles = async () => {
  const file = `export {}`

  ensureFolderExistsSync(path.join(__dirname, `../../components/api/schemas/models`))

  writeFileSync(path.join(__dirname, `../../components/api/schemas/models/index.ts`), file, {
    encoding: 'utf-8',
    flag: 'w'
  })
}

const fixRavenDB = () => {
  const filePath = path.join(__dirname, `../../node_modules/ravendb/dist/esm/Http/RequestExecutor.js`)
  const file = readFileSync(filePath, 'utf-8')

  writeFileSync(filePath, file.replace('import(importFix("undici"))', 'import("undici")'), {
    encoding: 'utf-8',
    flag: 'w'
  })
}

const schemas = async () => {
  fixRavenDB()
  await seedIndexFiles()

  ensureFolderExistsSync(path.join(__dirname, '../openapi'))

  const schemas = await import('@nodevault/platform.components.api.schemas')

  console.log('\x1b[44m OpenAPI Schemas \x1b[0m')

  await generate(
    JSON.stringify(schemas.composeOpenApiDocument()),
    path.join(__dirname, '../openapi/api.json'),
    path.join(__dirname, '../../components/api/schemas/models')
  )

  fix(path.join(__dirname, '../../components/api/schemas/models', 'index.ts'))
}

schemas()
