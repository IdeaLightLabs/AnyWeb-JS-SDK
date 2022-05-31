import { decode } from '@conflux-dev/conflux-address-js'
import { ConsoleLike } from './types'

export enum AddressType {
  USER = 'user',
  CONTRACT = 'contract',
  BUILTIN = 'builtin',
  NULL = 'null',
}

/**
 * Get the type of an address.
 * @param address
 * @param logger
 */
export const getAddressType = (
  address: string,
  logger: ConsoleLike = console
): AddressType => {
  const decodeResult = decode(address)
  logger.debug('[AnyWeb] decodeResult', decodeResult)
  if (Object.keys(decodeResult).includes('type')) {
    return decodeResult.type as AddressType
  } else {
    return AddressType.USER
  }
}
