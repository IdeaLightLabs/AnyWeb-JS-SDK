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
import config from '../package.json'
import { AddressType, getAddressType } from './utils/address'

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

    try {
      this.address =
        JSON.parse(
          (window.localStorage &&
            window.localStorage.getItem('anyweb_address')) ||
            '[]'
        ) || []
    } catch (e) {
      this.logger.error(e)
    }

    // bind functions (to prevent consumers from making unbound calls)
    this.request = this.request.bind(this)
    this.call = this.call.bind(this)
    this.send = this.call.bind(this)
    this.enable = this.enable.bind(this)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.conflux = this
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.anyweb = this
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
    console.debug(`[AnyWeb] request ${method} with`, params)
    const result = await this.rawRequest(method, params)
    console.debug(`[AnyWeb] request(${method}):`, result)
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

  /**
   * Submits an RPC request
   * @param method
   * @param params
   * @protected
   */
  protected async rawRequest(
    method: string,
    params?: readonly unknown[] | Record<string, unknown>
  ): Promise<unknown> {
    switch (method) {
      case 'cfx_netVersion':
        return 1
      case 'cfx_chainId':
        return 1
      case 'cfx_requestAccounts':
        return this.rawRequest('cfx_accounts')
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
        window.localStorage &&
          window.localStorage.setItem(
            'anyweb_address',
            JSON.stringify(this.address)
          )
        return this.address
      case 'cfx_sendTransaction':
        const paramsObj = params
          ? Array.isArray(params) && params.length > 0
            ? params[0]
            : params
          : {}
        return await callIframe('pages/dapp/auth', {
          appId: this.appId,
          chainId: (await this.request({ method: 'cfx_chainId' })) as string,
          params: params ? JSON.stringify(paramsObj) : '',
          authType:
            params && Object.keys(paramsObj).includes('to') && paramsObj['to']
              ? getAddressType(paramsObj['to']) === AddressType.CONTRACT
                ? 'callContract'
                : 'createTransaction'
              : 'createContract',
        })
      case 'anyweb_version':
        return config.version
      case 'anyweb_home':
        return await callIframe('pages/index/home', {
          appId: this.appId,
          chainId: (await this.request({ method: 'cfx_chainId' })) as string,
          params: params
            ? JSON.stringify(
                Array.isArray(params) && params.length > 0 ? params[0] : params
              )
            : '',
          waitResult: false,
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
