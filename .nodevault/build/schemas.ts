import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { generate as generateOpenApi } from 'openapi-typescript-codegen'

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
  // to be used for typescript types and api client generation
  writeFileSync(input, doc)

  // generate the typescript types from the schema file
  await generateOpenApi({
    input: input,
    output: output,
    exportCore: false,
    exportServices: false,
    exportModels: true,
    indent: 'tab',
    useUnionTypes: true,
  })
}

const fix = (path: string) => {
  const file = readFileSync(path, 'utf8')
  const fixed = file.replaceAll("';", ".js'")

  writeFileSync(path, fixed, {
    encoding: 'utf8',
    flag: 'w',
  })
}

const seedIndexFiles = async () => {
  const file = 'export {}'

  ensureFolderExistsSync(path.join(__dirname, '../../components/nodevault/openapi/models'))
  ensureFolderExistsSync(path.join(__dirname, '../../components/domain/openapi/models'))

  writeFileSync(path.join(__dirname, '../../components/nodevault/openapi/models/index.ts'), file, {
    encoding: 'utf8',
    flag: 'w',
  })

  writeFileSync(path.join(__dirname, '../../components/domain/openapi/models/index.ts'), file, {
    encoding: 'utf8',
    flag: 'w',
  })
}

const fixRavenDB = () => {
  const filePath = path.join(__dirname, '../../node_modules/ravendb/dist/esm/Http/RequestExecutor.js')
  const file = readFileSync(filePath, 'utf8')

  writeFileSync(filePath, file.replace('import(importFix("undici"))', 'import("undici")'), {
    encoding: 'utf8',
    flag: 'w',
  })
}

const schemas = async () => {
  fixRavenDB()
  await seedIndexFiles()

  ensureFolderExistsSync(path.join(__dirname, '../openapi'))

  const nodevault = await import('@nodevault/platform.components.nodevault.openapi')
  const domain = await import('@nodevault/platform.components.domain')

  console.log('\u001B[44m OpenAPI Schemas \u001B[0m')

  await generate(
    JSON.stringify(nodevault.composeOpenApiDocument()),
    path.join(__dirname, '../openapi/api.json'),
    path.join(__dirname, '../../components/nodevault/openapi/models'),
  )

  fix(path.join(__dirname, '../../components/nodevault/openapi/models', 'index.ts'))

  await generate(
    JSON.stringify(domain.openapi.composeOpenApiDocument()),
    path.join(__dirname, '../openapi/domain.json'),
    path.join(__dirname, '../../components/domain/openapi/models'),
  )

  fix(path.join(__dirname, '../../components/domain/openapi/models', 'index.ts'))
}

schemas()
