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
import { callIframe } from './utils/common'

/**
 * AnyWeb Provider
 * @class Provider
 * @author Littleor
 * @since 2020/2/2
 * @example
 * const provider = new Provider()
 */
export class Provider implements IProvider {
  protected logger: ConsoleLike
  protected appId: string
  protected address: string[] = []

  constructor({ logger, appId }: BaseProviderOptions) {
    if (!logger) {
      logger = console
    }
    this.logger = logger
    this.appId = appId

    // bind functions (to prevent consumers from making unbound calls)
    this.request = this.request.bind(this)
    this.call = this.call.bind(this)
    this.send = this.call.bind(this)
    this.enable = this.enable.bind(this)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.conflux = this
  }

  /**
   * Deprecated: use `request` instead
   * @param arg
   */
  async send(...arg: any[]) {
    console.info('[AnyWeb] `send` is deprecated, use `request` instead')
    if (arg.length > 1) {
      return await this.request({ method: arg[0], params: arg[1] })
    }
    throw new Error('Invalid arguments')
  }

  /**
   * Deprecated: use `request` instead
   * @param arg
   */
  async call(...arg: any[]) {
    console.info('[AnyWeb] `call` is deprecated, use `request` instead', arg)
    if (arg.length > 1) {
      return await this.request({ method: arg[0], params: arg[1] })
    } else {
      return this.enable()
    }
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
    const result = await this.rawRequest(method, params)
    console.info('(AnyWeb) request result:', result)
    return result
  }

  /**
   * Deprecated: use `request` instead
   */
  public async enable() {
    return await this.request({
      method: 'cfx_requestAccounts',
    })
  }

  protected async rawRequest(
    method: string,
    params?: readonly unknown[] | object
  ): Promise<unknown> {
    switch (method) {
      case 'cfx_netVersion':
        return 1
      case 'cfx_chainId':
        return 1
      case 'cfx_requestAccounts':
        return ['cfxtest:aakd43w1n0dxfskatfv96nrtx1k88gx366azg3gvdz']
      case 'cfx_accounts':
        if (this.address.length > 0) {
          return this.address
        }
        this.address = (await callIframe('pages/dapp/auth', {
          appId: this.appId,
          params: params ? JSON.stringify(params) : '',
          chainId: (await this.request({ method: 'cfx_chainId' })) as string,
          authType: 'account',
        })) as string[]
        return this.address
      case 'cfx_sendTransaction':
        return await callIframe('pages/dapp/auth', {
          appId: this.appId,
          chainId: (await this.request({ method: 'cfx_chainId' })) as string,
          params: params
            ? JSON.stringify(
                Array.isArray(params) && params.length > 0 ? params[0] : params
              )
            : '',
          authType: 'createTransaction',
        })
      default:
        return 'default'
    }
  }

  /**
   * Monitor information
   * @param type {string} Type of information
   * @param listener {Function} Event listener
   * @example
   * provider.on('connected', listener)
   */
  on(type: string, listener: (...args: any[]) => void): void {
    console.log('(AnyWeb) on', {
      type,
      listener,
    })
  }
}
