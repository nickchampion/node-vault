export class FileContent {
  content?: any
  name?: string
  contentType?: string
  extension?: string
  metadata: Record<string, string> = {}

  constructor(content: any, name: string, contentType: string, extension?: string) {
    this.content = content
    this.name = name
    this.contentType = contentType
    this.extension = extension
  }
}

export interface FileUpload {
  /**
   * The size of the uploaded file in bytes. If the file is still being uploaded (see `'fileBegin'`
   * event), this property says how many bytes of the file have been written to disk yet.
   */
  size: number
  /**
   * The name this file had according to the uploading client.
   */
  filename: string | null
  /**
   * The mime type of this file, according to the uploading client.
   */
  mimetype: string | null
  /**
   * Contents of the upload as a buffer
   */
  buffer: Buffer
}
