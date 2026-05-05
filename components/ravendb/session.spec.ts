import type { IDocumentStore } from 'ravendb'
import { BaseModel } from '@nodevault/platform.components.common'
import { randomAlphaNumeric } from '@nodevault/platform.components.utils'
import { configuration } from '../configuration/server/index.js'
import { Session, createDocumentStore } from './index.js'

let store: IDocumentStore | null = null

beforeAll(async () => {
  store = createDocumentStore(`IntegrationTests_${configuration.ravendb.testDatabaseName}`)
})

afterAll(async () => {
  store?.dispose()
})

class TestModel extends BaseModel {
  name: string

  constructor(id: string, name: string) {
    super(null, 'singletons')
    this.id = id
    this.name = name
  }
}

describe('RavenDB Session Tests', () => {
  test('session is not committed if veto is set to true', async () => {
    const id = randomAlphaNumeric(15)
    let session = new Session(store)

    await session.store(new TestModel(id, 'hectare'))
    session.veto = true
    await session.commit()

    // make sure the doc does not exist
    session = new Session(store)
    const doc = await session.get(id)

    expect(doc).toBe(null)
  })

  test('concurrency error throws as expected and contains expected error name', async () => {
    const id = randomAlphaNumeric(15)

    {
      const session = new Session(store)

      await session.store(new TestModel(id, 'hectare'))
      await session.commit()
    }

    const session1 = new Session(store)
    const session2 = new Session(store)

    const doc1 = await session1.get<TestModel>(id)
    const doc2 = await session2.get<TestModel>(id)

    doc1.name = 'test1'
    doc2.name = 'test2'

    await session1.commit()

    let error = null

    try {
      await session2.commit()
    } catch (error_) {
      error = error_
    }

    expect(error).not.toBe(null)
    expect((error as Error).name).not.toBe(undefined)
    expect((error as Error).name).toBe('ConcurrencyException')
  })

  test('session commit actions are executed successfully', async () => {
    const id = randomAlphaNumeric(15)
    let session = new Session(store)

    await session.store(new TestModel(id, 'hectare'))

    // add a commit action to delete the doc we just stored
    session.on('afterCommit', async (s) => {
      await s.database!.delete(id)
      await s.commit()
    })

    await session.commit()

    // make sure the doc does not exist
    session = new Session(store)
    const doc = await session.get(id)

    expect(doc).toBe(null)
  })

  test('session rollback actions are executed successfully', async () => {
    const id = randomAlphaNumeric(15)
    let session = new Session(store)

    // create test doc
    await session.store(new TestModel(id, 'hectare'))
    await session.commit()

    // new session try and create again which should fail
    session = new Session(store)

    session.on('commitError', async (s) => {
      await s.database!.delete(id)
      await s.commit()
    })

    // should fail and rollback to delete the orig doc
    await session.store(new TestModel(id, 'hectare'))

    // should throw error, but execute rollback actions
    try {
      await session.commit()
    } catch {
      /* empty */
    }

    // make sure the doc does not exist, should have been deleted by rollback actions
    session = new Session(store)
    const doc = await session.get(id)

    expect(doc).toBe(null)
  })
})
