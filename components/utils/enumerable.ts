export const groupBy = (array: unknown[], field: string): unknown => {
  return array.reduce((result, currentValue) => {
    ;(result[currentValue[field]] = result[currentValue[field]] || []).push(currentValue)
    return result
  }, {})
}

export const groupByFn = <T>(array: T[], fieldSelector: (obj: T) => string | string[]): Record<string, T[]> => {
  const results: Record<string, T[]> = {}

  array.forEach(e => {
    const value = fieldSelector(e)
    const values = Array.isArray(value) ? value : [value]

    values.forEach(v => {
      if (results[v]) {
        results[v].push(e)
      } else {
        results[v] = [e]
      }
    })
  })

  return results
}

export const uniqueValues = <T>(array: T[], key: string): T[] => {
  return [...new Set(array.map(item => item[key]))]
}

export const uniqueBy = <T>(array: T[], key: string): T[] => {
  return [...new Map(array.map(item => [item[key], item])).values()]
}

export const uniqueByMany = <T>(array: T[], fields: string[]): T[] => {
  return Object.values(
    array.reduce((uniqueMap, entry) => {
      const key = fields.map(k => entry[k]).join('|')
      if (!(key in uniqueMap)) uniqueMap[key] = entry
      return uniqueMap
    }, {})
  )
}

export const uniqueObjects = <T>(array: T[]): T[] => {
  return Array.from(new Set(array.map(<any>JSON.stringify))).map(<any>JSON.parse)
}

export const nextId = (array: { id: number }[]): number => {
  if (!array?.length) return 1
  return array.map(a => a.id).sort((a, b) => b - a)[0] + 1
}

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)]
}

export const last = <T>(array: T[]): T => {
  return array?.slice(-1)[0] ?? null
}

export const first = <T>(array: T[]): T => {
  return array?.slice(0)[0] ?? null
}

export function arraysEqual<T>(array1: T[], array2: T[]) {
  return array1.length == array2.length && array1.filter(e => array2.includes(e)).length == array1.length
}

export function arraysHaveCommonElement<T>(array1: T[], array2: T[]) {
  return array1.some(item => array2.includes(item))
}

export const mergeBy = <T>(arr1: T[], arr2: T[], key: string) =>
  arr1.map(itm => ({
    ...arr2.find(item => item[key] === itm[key] && item),
    ...itm
  }))

export const sortByString = <T>(arr: T[], keySelector: (o: T) => string) => {
  arr.sort((a, b) => {
    const keyA = keySelector(a).toUpperCase()
    const keyB = keySelector(b).toUpperCase()
    if (keyA < keyB) return -1
    if (keyA > keyB) return 1
    return 0
  })
  return arr
}

/**
 * Partition an array into chunks
 */
export const partition = <T>(arr: T[], size: number): T[][] =>
  arr.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size))
    return acc
  }, [])

/**
 * Add elements from arr2 into arr1 if it does not currently exist
 * @param arr1
 * @param arr2
 * @param key
 * @returns
 */
export const combineBy = <T>(arr1: T[], arr2: T[], key: string | ((i: T) => string)): T[] => {
  if (!arr2?.length) return arr1

  arr2.forEach(item2 => {
    const selector = (item: T) => (typeof key == 'string' ? item[key] : key(item))

    if (!arr1.find(item1 => selector(item1) === selector(item2))) {
      arr1.push(item2)
    }
  })

  return arr1
}
