/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/4
 */
import { ConsoleLike } from '../utils/types'

/**
 * Request Args
 */
export interface IRequestArguments {
  readonly method: string
  readonly params?: unknown
  readonly chainId?: number
}

export interface IBaseProviderOptions {
  logger?: ConsoleLike
  appId: string
}

/**
 * Base Provider
 */
export interface IProvider {
  /**
   * Request
   * @param args {IRequestArguments} Request Arguments: {method, params}
   * @returns {Promise<any>}
   */
  request(args: IRequestArguments): Promise<unknown>

  /**
   * monitor information
   * @param type {string} monitor type
   * @param listener {Function} callback
   */
  on(type: string, listener: (...args: any[]) => void): void
}

/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/18
 */

export interface IAuthResult {
  chainId: number
  networkId: number
  address: string[]
  url: string
  code: string
  scopes: string[]
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

export type IMethodType =
  | 'account'
  | 'createContract'
  | 'callContract'
  | 'createTransaction'
  | 'importAccount'
  | 'exitAccounts'
  | 'signTypedData'
  | 'logout'
  | 'checkAuth'
  | 'checkLogin'
  | 'home'
  | 'unknownType'
  | 'identify'
  | 'checkIdentify'

export interface IIframeOptions {
  appId: string
  params: string
  chainId: number
  scopes?: string[]
  waitResult?: boolean
  silence?: boolean
}

export interface IIframeData {
  type: 'event' | 'callback' | 'router' | 'default'
  data: unknown
  success?: boolean
  message?: string
  code: number
}

export interface IIframeEventData {
  type: 'changeNetwork' | 'changeChain'
  data: unknown
}

export type IRequestParams =
  | IRequestParamsAccounts
  | { payload: IPayload; gatewayPayload?: IGatewayPayload }
  | IPayload

export interface IRequestParamsAccounts {
  scopes: string[]

  [key: string]: unknown
}

export interface IPayload {
  to: string

  [key: string]: unknown
}

export interface IGatewayPayload {
  [key: string]: unknown
}
