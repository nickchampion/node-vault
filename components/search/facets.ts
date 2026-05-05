import type { Value, KeyValuePair } from '@nodevault/platform.components.common'
import { toObject as toObject } from '@nodevault/platform.components.utils'
import type { FacetMap } from './entities.js'

export const getFacetMap = (
  name: string,
  displayName: string,
  values: Value[],
  map?: (t: string) => string,
  filter?: (t: string, id: string) => boolean,
): FacetMap => {
  return {
    name,
    displayName,
    map,
    terms: toObject(
      values,
      n => n.id.toString(),
      false,
      n => n.name,
    ),
    filter,
  }
}

export const getFacetMapKvp = (
  name: string,
  displayName: string,
  values?: KeyValuePair[],
  map?: (t: string) => string,
  termMap?: (t: string) => string,
  filter?: (t: string, id: string) => boolean,
): FacetMap => {
  return {
    name,
    displayName,
    map,
    termMap,
    terms: values
      ? toObject(
        values,
        n => n.key,
        false,
        n => n.value,
      )
      : null,
    filter,
  }
}

export const getFacetMapBoolYesNo = (name: string, displayName: string) => getFacetMapKvp(name, displayName, [
  {
    key: 'true',
    value: 'Yes',
  },
  {
    key: 'false',
    value: 'No',
  },
])
