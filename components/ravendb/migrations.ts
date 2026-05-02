import { DocumentStore } from 'ravendb'
import { readdirSync, existsSync } from 'node:fs'
import { join, resolve, parse } from 'node:path'
import { createDocumentStore } from './index.js'
import { createMD5FileHash, sleep } from '@nodevault/platform.components.utils'
import { Errors, HectareError } from '@nodevault/platform.components.common'

const logOk = msg => console.log(`  \x1b[32m✔\x1b[0m ${msg}`)

export class MigrationRegistry {
  id: string
  scripts: Record<string, string>
  sql: Record<string, string>
  tasks: Record<string, Task>

  constructor() {
    this.id = MigrationRegistry.id
    this.scripts = {}
    this.sql = {}
    this.tasks = {}
  }

  static id = 'MigrationRegistry'
  static collection = 'Singletons'
}

export type Task = {
  id: number
  hash: string
  changedUTC: string
}

export type Migration = {
  module: any
  path: string
  name: string
}

export const execute = async (
  load: (path: string, file: string) => Promise<Migration>,
  database: string,
  indexes: Record<string, any>
) => {
  let store: DocumentStore

  try {
    console.log(`\x1b[41m ${database} \x1b[0m Starting migrations...`)

    store = createDocumentStore(database)

    // update any ravendb indexes that have changed
    await Promise.all(Object.values(indexes).map(index => new index().execute(store)))
    logOk('Indexes')

    const registry = await loadRegistry(store)
    const scripts = await loadFiles(database, 'migrations/scripts', load)
    const tasks = await loadFiles(database, 'migrations/tasks', load)

    // execute migration scripts
    const appliedScripts = await executeScripts(store, registry.scripts, scripts)

    // if we get a failure we still need to record the migrations that executed successfully
    if (appliedScripts.error) {
      await saveWithRetries(store, appliedScripts.applied, {}, {})
      throw appliedScripts.error
    }

    // execute migration tasks
    const appliedTasks = await executeTasks(store, registry, tasks)

    // update the migrations registry with concurrency retries to support dev with 1 database
    await saveWithRetries(store, appliedScripts.applied, {}, appliedTasks.applied)

    if (appliedTasks.error) throw appliedTasks.error

    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    store.dispose()
  }
}

export const saveWithRetries = async (
  store: DocumentStore,
  scripts: Record<string, string>,
  sql: Record<string, string>,
  tasks: Record<string, Task>
) => {
  for (let i = 1; i <= 3; i += 1) {
    try {
      const session = store.openSession()

      const registry = await session.load<MigrationRegistry>(new MigrationRegistry().id)

      for (const key in scripts) {
        if (!registry.scripts[key]) {
          registry.scripts[key] = scripts[key]
        }
      }

      for (const key in sql) {
        if (!registry.sql[key]) {
          registry.sql[key] = sql[key]
        }
      }

      for (const key in tasks) {
        if (!registry.tasks[key] || registry.tasks[key].hash !== tasks[key].hash) {
          registry.tasks[key] = tasks[key]
        }
      }

      await session.saveChanges()
    } catch {
      if (i >= 3) {
        throw new HectareError(Errors.Custom('Migrations', 'Failed to save migration registry'))
      } else {
        await sleep(1000)
      }
    }
  }
}

export const loadRegistry = async (store: DocumentStore) => {
  const session = store.openSession()
  let registry = await session.load<MigrationRegistry>(new MigrationRegistry().id)

  if (!registry) {
    registry = new MigrationRegistry()
    await session.store<MigrationRegistry>(registry)
    await session.saveChanges()
  }

  return registry
}

const loadFiles = async (
  service: string,
  dir: string,
  load: (path: string, file: string) => Promise<Migration>
): Promise<Migration[]> => {
  let path = `${resolve()}/${dir}`

  if (!existsSync(path)) {
    path = `${resolve()}/services/${service.toLowerCase()}/api/${dir}`
  }

  if (!existsSync(path)) {
    return []
  }

  const files = readdirSync(join(path)).filter(f => f.indexOf('.map') == -1 && f.indexOf('.gitkeep') == -1)
  return (await Promise.all(files.map(s => load(path, s)))).map(m => {
    m.name = parse(m.name).name
    return m
  })
}

const executeScripts = async (
  store: DocumentStore,
  field: Record<string, string>,
  migrations: Migration[]
): Promise<{ error: Error; applied: Record<string, string> }> => {
  const applied: Record<string, string> = {}

  try {
    for (const migration of migrations) {
      if (!Object.prototype.hasOwnProperty.call(field, migration.name)) {
        const start = new Date().valueOf()
        await migration.module.up(store)
        applied[migration.name] = `Executed at: ${new Date().toISOString()} in: ${new Date().valueOf() - start}ms`
        field[migration.name] = applied[migration.name]
        logOk(`\x1b[44m ${migration.name} \x1b[0m \x1b[32m${new Date().valueOf() - start}ms`)
      }
    }
  } catch (e) {
    return {
      error: e,
      applied: applied
    }
  }

  return {
    error: null,
    applied: applied
  }
}

const executeTasks = async (
  store: DocumentStore,
  registry: MigrationRegistry,
  migrations: Migration[]
): Promise<{ error: Error; applied: Record<string, Task> }> => {
  const applied: Record<string, Task> = {}

  try {
    const createTask = (name: string) => {
      registry.tasks[name] = {
        id: null,
        hash: null,
        changedUTC: null
      }
      return registry.tasks[name]
    }

    for (const migration of migrations) {
      // generate a hash of the file so we can see if its changed and needs updating
      const hash = createMD5FileHash(migration.path)

      // load the task from the regsitry or create if its not there
      const task = registry.tasks[migration.name] || createTask(migration.name)

      // check to see if the file hash has changed, if it has execute again
      if (task.hash !== hash) {
        await migration.module.execute(task, store)

        task.hash = hash
        task.changedUTC = new Date().toISOString()

        applied[migration.name] = task

        logOk(`\x1b[45m ${migration.name} \x1b[0m ${hash}`)
      }
    }
  } catch (e) {
    return {
      error: e,
      applied: applied
    }
  }

  return {
    error: null,
    applied: applied
  }
}
