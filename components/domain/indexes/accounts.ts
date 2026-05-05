import { AbstractJavaScriptIndexCreationTask } from 'ravendb'
import type { Account } from '../models/index.js'

export class Accounts extends AbstractJavaScriptIndexCreationTask<Account> {
  constructor() {
    super()

    this.searchEngineType = 'Corax'
    this.map('Accounts', (account) => {
      return {
        firstName: account.name,
        createdAtUTC: new Date(account.createdAtUTC!),
      }
    })
  }
}
