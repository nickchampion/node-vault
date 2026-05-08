import { AccountApi } from './apis/account'
import { AuthApi } from './apis/auth'
import { CommsApi } from './apis/comms'
import { ApiClient } from './client'

export class NodeVaultApiClient extends ApiClient {
  private _account: AccountApi | null = null
  private _comms: CommsApi | null = null
  private _auth: AuthApi | null = null

  get account(): AccountApi {
    return this._account ?? (this._account = new AccountApi(this))
  }

  get comms(): CommsApi {
    return this._comms ?? (this._comms = new CommsApi(this))
  }

  get auth(): AuthApi {
    return this._auth ?? (this._auth = new AuthApi(this))
  }
}
