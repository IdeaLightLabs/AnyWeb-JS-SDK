/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/2
 */

import {
  BaseProviderOptions,
  IProvider,
  IRequestArguments,
} from './interface/provider'
import { ConsoleLike } from './utils/types'

/**
 * AnyWeb Provider
 * @class Provider
 * @author Littleor
 * @since 2020/2/2
 * @example
 * const provider = new Provider()
 */
export class Provider implements IProvider {
  protected _logger: ConsoleLike

  constructor(
    { logger }: BaseProviderOptions = {
      logger: console,
    }
  ) {
    this._logger = logger

    // bind functions (to prevent consumers from making unbound calls)
    this.request = this.request.bind(this)
  }

  /**
   * Submits an RPC request
   * @param args {IRequestArguments} Request Arguments: {method, params}
   * @returns {Promise<any>}
   * @example
   * const result = await provider.request({ method: 'cfx_sendTransaction', params})
   */
  async request(args: IRequestArguments): Promise<unknown> {
    if (!args || typeof args !== 'object' || Array.isArray(args)) {
      throw new Error('Invalid request arguments')
    }
    const { method, params } = args
    if (!method || method.trim().length === 0) {
      throw new Error('Method is required')
    }
    console.log('AnyWeb', { method, params })
    // return {
    //   jsonrpc: '2.0',
    //   id: '17eafc5aa55b7cb391878dbb',
    //   result: '0x3e8ef795d71dfd3ca',
    // }
    return '0x3e8ef795d71dfd3ca'
  }

  /**
   * Monitor information
   * @param type {string} Type of information
   * @param listener {Function} Event listener
   * @example
   * provider.on('connected', listener)
   */
  on(type: string, listener: (...args: any[]) => void): void {
    console.log('AnyWeb', { type, listener })
  }
}
