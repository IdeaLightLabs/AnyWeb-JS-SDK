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
  return decode(address).type as AddressType
}
