import { convert } from './conversions.js'

export const weightUnitFromName = (name: string) => {
  switch (name?.toLowerCase()) {
    case 'tonne':
      return 't'
    case 'bushel':
      return 'bu'
    default:
      return name
  }
}

export const formatWeight = (name: string, weight: number, conversion: number) => {
  return `${convert.from.kgs(weight, conversion)}${weightUnitFromName(name)}`
}

export const formatWeightRange = (minKG: number | null, maxKG: number | null, weightName: string, conversion: number) => {
  if (minKG == null && maxKG != null) {
    return formatWeight(weightName, maxKG, conversion)
  } else if (minKG != null && maxKG == null) {
    return formatWeight(weightName, minKG, conversion)
  }

  const min = convert.from.kgs(minKG, conversion)
  const max = convert.from.kgs(maxKG, conversion)
  const unit = weightUnitFromName(weightName)

  return min === max ? `${min}${unit}` : `${min}-${max}${unit}`
}

export const roundToLoadWeightKG = (kg: number): number => {
  if (kg <= 0) {
    return 29000
  }

  // Round to the nearest multiple of 29000kg (29t).
  return Math.round(kg / 29000.0) * 29000
}
