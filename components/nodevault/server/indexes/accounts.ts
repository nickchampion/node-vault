import type { Account } from '@nodevault/platform.components.nodevault.server'
import { AbstractJavaScriptIndexCreationTask } from 'ravendb'

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
