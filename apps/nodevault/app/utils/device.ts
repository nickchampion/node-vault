interface Device {
  isAndroid: boolean
  isIos: boolean
  isMacOS: boolean
  isWindows: boolean
  isChrome: boolean
  isSafari: boolean
  isEdge: boolean
  isFirefox: boolean
}

export const determineDeviceInfo = (device: Device): string => {
  const platform = device.isAndroid ? 'android' : (device.isIos ? 'ios' : 'web')
  const os = device.isMacOS ? 'mac' : (device.isWindows ? 'windows' : 'linux')
  const browser = device.isChrome
    ? 'chrome'
    : device.isSafari
      ? 'safari'
      : device.isEdge
        ? 'edge'
        : device.isFirefox
          ? 'firefox'
          : 'other'

  return `${platform}, ${os}, ${browser}`
}
