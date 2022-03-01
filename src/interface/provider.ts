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
  readonly params?: readonly unknown[] | Record<string, unknown>
}

export interface IBaseProviderOptions {
  logger?: ConsoleLike
  appId: string
}

/**
 * Provider RPC Error
 */
export interface IProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
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

export interface IIframeOptions {
  appId: string
  params: string
  chainId: string
  scope?: number[]
  authType?:
    | 'account'
    | 'createContract'
    | 'callContract'
    | 'createTransaction'
    | 'importAddress'
  waitResult?: boolean
}
