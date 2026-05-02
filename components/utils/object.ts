
export const accurateSizeInBytes = <T>(data: T): number => {
  const jsonString = JSON.stringify(data)
  return new TextEncoder().encode(jsonString).length
}

export const copyFields = (obj: Record<string, any>, ignore: unknown[] = []) => {
  const result: Record<string, any> = {}
  Object.keys(obj).forEach(k => {
    if (!ignore.includes(k)) result[k] = obj[k]
  })
  return result
}

export const removeFields = <T extends Record<string, any>>(obj: T, fields: string[]): Partial<T> | null => {
  if (!obj) return null

  const result = { ...obj }
  for (const field of fields) {
    delete result[field]
  }

  return result
}

export const filter = <T>(record: Record<string, T>, fn: (e: T) => boolean): Record<string, T> => {
  const result: Record<string, T> = {}
  Object.keys(record)
    .filter(k => fn(record[k]))
    .forEach(k => (result[k] = record[k]))
  return result
}

export const transform = <T, T2>(record: Record<string, T>, fn: (e: T) => T2): Record<string, T2> => {
  const result: Record<string, T2> = {}
  Object.keys(record).forEach(k => (result[k] = fn(record[k])))
  return result
}

/**
 * Returns the object value at the given path, path should be period separated,
 * i.e. record.storage.id to return the id field from storage object
 * @param obj
 * @param path
 * @returns
 */

export const getValueByPath = (obj: any, path: string): any => {
  return path
    .replace(/\[|\]\.?/g, '.')
    .split('.')
    .filter(s => s)
    .reduce((acc, val) => acc && acc[val], obj)
}

/**
 * As above but sets a value at the given path.
 * @param obj
 * @param path
 * @param value
 */

export const setValueByPath = (obj: any, path: string, value: any): void => {
  if (!obj) return
  let i: number
  const parts = path.split('.')
  for (i = 0; i < parts.length - 1; i++) {
    if (!obj[parts[i]]) obj[parts[i]] = {}
    obj = obj[parts[i]]
  }
  obj[parts[i]] = value
}
