import { format } from 'fast-csv'
import type { IDocumentQuery, IDocumentSession, IRawDocumentQuery } from 'ravendb'
import { Writable } from 'stream'

export interface IExporter<T extends object, TResult> {
  headers: string[]
  writeHeaders?: boolean
  query?: IDocumentQuery<T>
  rawQuery?: IRawDocumentQuery<T>
  map: (doc: T) => TResult | TResult[] | Promise<TResult> | Promise<TResult[]>
  iterator?: (doc: T) => void
}

export class CsvExporter<T extends object, TResult> {
  session: IDocumentSession
  settings: IExporter<T, TResult>
  processor: (document: T) => void

  constructor(session: IDocumentSession, settings: IExporter<T, TResult>, processor?: (document: T) => void) {
    this.session = session
    this.settings = settings
    this.processor = processor
  }

  async export(): Promise<Writable> {
    const stream = this.settings.rawQuery
      ? await this.session.advanced.stream<T>(this.settings.rawQuery)
      : await this.session.advanced.stream<T>(this.settings.query)

    const csvStream = format({
      headers: this.settings.headers,
      writeHeaders: this.settings.writeHeaders ?? true,
      delimiter: ','
    })

    return new Promise((resolve, reject) => {
      stream.on('data', data => {
        try {
          if (this.processor) this.processor(data.document)

          const row = this.settings.map(data.document)

          if (this.settings.iterator) this.settings.iterator(data.document)

          if (row) {
            if (Array.isArray(row)) {
              row.forEach(r => {
                csvStream.write(r)
              })
            } else {
              csvStream.write(row)
            }
          }
        } catch (e) {
          reject(e)
        }
      })

      stream.on('error', err => {
        reject(err)
      })

      stream.on('end', async () => {
        csvStream.end()
        resolve(csvStream)
      })
    })
  }
}
