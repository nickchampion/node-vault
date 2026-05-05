/* eslint-disable prefer-rest-params */
import originalMulter from 'multer'

const multerOrig = originalMulter

const multer = (options: any) => {
  const m = multerOrig(options)

  makePromise(m, 'any')
  makePromise(m, 'array')
  makePromise(m, 'fields')
  makePromise(m, 'none')
  makePromise(m, 'single')

  return m
}

const parseFile = (file: any) => {
  return {
    filename: file['originalname'],
    size: file['size'],
    mimetype: file['mimetype'],
    buffer: file['buffer'],
  }
}

const makePromise = (mlt: any, name: string) => {
  if (!mlt[name]) return

  const fn = mlt[name]

  mlt[name] = function () {
    const middleware = Reflect.apply(fn, this, arguments)

    return async (ctx: any, next: any) => {
      await new Promise((resolve, reject) => {
        middleware(ctx.req, ctx.res, (err: any) => {
          if (err) return reject(err)

          if ('request' in ctx) {
            if (ctx.req.body) {
              ctx.request.body = ctx.req.body
              delete ctx.req.body
            }

            if (ctx.req.file) {
              ctx.request.files = {}
              ctx.request.files[ctx.req.file['fieldname']] = parseFile(ctx.req.file)
              ctx.files = ctx.request.files
              delete ctx.req.file
            }

            if (ctx.req.files) {
              ctx.request.files = {}

              for (const f of ctx.req.files) {
                ctx.request.files[f['fieldname']] = parseFile(f)
              }

              ctx.files = ctx.request.files
              delete ctx.req.files
            }
          }

          resolve(ctx)
        })
      })

      return next()
    }
  }
}

multer.diskStorage = originalMulter.diskStorage
multer.memoryStorage = originalMulter.memoryStorage

export default multer
