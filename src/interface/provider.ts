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
  readonly params?: readonly unknown[] | object
}

export interface BaseProviderOptions {
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
