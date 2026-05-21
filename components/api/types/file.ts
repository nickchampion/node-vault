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
