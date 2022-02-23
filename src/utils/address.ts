import { decode } from '@conflux-dev/conflux-address-js'

export enum AddressType {
  USER = 'user',
  CONTRACT = 'contract',
  BUILTIN = 'builtin',
  NULL = 'null',
}

/**
 * Get the type of an address.
 * @param address
 */
export const getAddressType = (address: string): AddressType => {
  const decodeResult = decode(address)
  console.log('decodeResult', decodeResult)
  if (Object.keys(decodeResult).includes('type')) {
    return decodeResult.type as AddressType
  } else {
    return AddressType.USER
  }
}
