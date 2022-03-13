/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/2
 */

import {
  IAuthResult,
  IBaseProviderOptions,
  IProvider,
  IProviderConnectInfo,
  IProviderMessage,
  IProviderRpcError,
  IRequestArguments,
} from './interface/provider'
import { callIframe, readCache, setCache } from './utils/common'
import config from '../package.json'
import { AddressType, getAddressType } from './utils/address'
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
  logger: ConsoleLike
  public readonly appId: string
  address: string[] = []
  networkId = -1
  chainId = -1
  url = ''
  events: {
    onConnect?: (connectInfo: IProviderConnectInfo) => void
    onDisconnect?: (error: IProviderRpcError) => void
    onChainChanged?: (chainId: string) => void
    onAccountsChanged?: (accounts: string[]) => void
    onMessage?: (message: IProviderMessage) => void
    onNetworkChanged?: (networkId: string) => void
  } = {}

  constructor({ logger, appId }: IBaseProviderOptions) {
    if (!logger) {
      logger = console
    }
    this.logger = logger
    this.appId = appId
    readCache(this)

    // bind functions (to prevent consumers from making unbound calls)
    this.request = this.request.bind(this)
    this.call = this.call.bind(this)
    this.send = this.call.bind(this)
    this.enable = this.enable.bind(this)

    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.conflux = this
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.anyweb = this
    }
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
    const paramsObj = params
      ? Array.isArray(params) && params.length > 0
        ? params[0]
        : params
      : {}
    switch (method) {
      case 'cfx_netVersion':
        if (this.networkId === -1) {
          return 1
        }
        return this.networkId
      case 'cfx_chainId':
        if (this.chainId === -1) {
          return 1
        }
        return this.chainId
      case 'cfx_requestAccounts':
        return this.rawRequest('cfx_accounts')
      case 'cfx_accounts':
        if (this.address.length > 0) {
          return this.address
        }
        const result = (await callIframe('pages/dapp/auth', {
          appId: this.appId,
          params: params ? JSON.stringify(params) : '',
          chainId: (await this.request({ method: 'cfx_chainId' })) as string,
          authType: 'account',
        })) as IAuthResult
        setCache(result, this)
        this.events.onAccountsChanged &&
          this.events.onAccountsChanged(result.address)
        this.events.onChainChanged &&
          this.events.onChainChanged(String(result.chainId))
        this.events.onNetworkChanged &&
          this.events.onNetworkChanged(String(result.networkId))
        return this.address
      case 'cfx_sendTransaction':
        try {
          return await callIframe('pages/dapp/auth', {
            appId: this.appId,
            chainId: (await this.request({ method: 'cfx_chainId' })) as string,
            params: params ? JSON.stringify(paramsObj) : '',
            authType:
              params && Object.keys(paramsObj).includes('to') && paramsObj['to']
                ? getAddressType(paramsObj['to'] as string) ===
                  AddressType.CONTRACT
                  ? 'callContract'
                  : 'createTransaction'
                : 'createContract',
          })
        } catch (e) {
          console.error('Error to sendTransaction', e)
          return e
        }
      case 'anyweb_importAccount':
        try {
          return await callIframe('pages/dapp/auth', {
            appId: this.appId,
            chainId: (await this.request({ method: 'cfx_chainId' })) as string,
            params: params ? JSON.stringify(paramsObj) : JSON.stringify([]),
            authType: 'importAccount',
          })
        } catch (e) {
          console.error('Error to import Address', e)
          return e
        }
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
        return 'Unsupported method'
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
    switch (type) {
      case 'connect':
        this.events.onConnect = listener
        break
      case 'disconnect':
        this.events.onDisconnect = listener
        break
      case 'chainChanged':
        this.events.onChainChanged = listener
        break
      case 'accountsChanged':
        this.events.onAccountsChanged = listener
        break
      case 'message':
        this.events.onMessage = listener
        break
      case 'networkChanged':
        this.events.onNetworkChanged = listener
        break
      default:
        break
    }
  }
}
