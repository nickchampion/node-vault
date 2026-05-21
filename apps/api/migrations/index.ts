import { migrations } from '@nodevault/platform.components.ravendb'
import { serverConfiguration } from '@nodevault/platform.components.nodevault.server'
import { manifest } from '../manifest'

const load = async (path: string, file: string) => {
  return {
    module: await import(`${path}/${file}`),
    name: file,
    path: `${path}/${file}`,
  }
}

const run = async () => {
  try {
    await migrations.execute(load, serverConfiguration.ravendb.database, {
      ...manifest.indexes,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

run()
