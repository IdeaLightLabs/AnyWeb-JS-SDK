/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/18
 */

export interface IAuthResult {
  chainId: number
  networkId: number
  address: string[]
  url: string
}

export interface IProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export interface IProviderConnectInfo {
  readonly chainId: string
}

export interface IProviderMessage {
  readonly type: string
  readonly data: unknown
}
