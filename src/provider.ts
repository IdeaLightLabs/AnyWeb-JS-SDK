/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/2
 */

import {
  IAuthResult,
  IBaseProviderOptions,
  IIframeOptions,
  IProvider,
  IProviderConnectInfo,
  IProviderMessage,
  IProviderRpcError,
  IRequestArguments,
} from './interface/provider'
import { callIframe, createIframe } from './utils/common'
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
  private chainId = 1

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
    // bind functions (to prevent consumers from making unbound calls)
    this.request = this.request.bind(this)
    this.call = this.call.bind(this)
    this.send = this.call.bind(this)
    this.enable = this.enable.bind(this)

    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.anyweb = this
    }

    createIframe('pages/index/home')
      .then()
      .catch((e) => console.error('[AnyWeb] createIframe error', e))
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
  protected async rawRequest(method: string, params?: any): Promise<unknown> {
    switch (method) {
      case 'cfx_requestAccounts':
        return this.rawRequest('cfx_accounts')
      case 'cfx_accounts':
        console.debug('[AnyWeb]', { params })
        const scopes = params[0].scopes
        let result: IAuthResult
        try {
          result = (await callIframe(
            'pages/dapp/auth',
            {
              appId: this.appId,
              params: params ? JSON.stringify(params[0]) : '',
              chainId: this.chainId,
              authType: 'check_auth',
              scopes: scopes,
              silence: true,
            },
            this
          )) as IAuthResult
          console.debug('[AnyWeb]', 'silent auth result', result)
        } catch (e) {
          console.debug('[AnyWeb]', 'need to auth', e)
          result = (await callIframe(
            'pages/dapp/auth',
            {
              appId: this.appId,
              params: params ? JSON.stringify(params[0]) : '',
              chainId: this.chainId,
              authType: 'account',
              scopes: scopes,
            },
            this
          )) as IAuthResult
        }

        result.scopes = scopes
        this.events.onAccountsChanged &&
          this.events.onAccountsChanged(result.address)
        this.events.onChainChanged &&
          this.events.onChainChanged(String(result.chainId))
        this.events.onNetworkChanged &&
          this.events.onNetworkChanged(String(result.networkId))
        if (scopes.length > 0) {
          return {
            address: result.address,
            code: result.code,
            scopes: scopes,
            chainId: result.chainId,
            networkId: result.networkId,
          }
        } else {
          return false
        }
      case 'cfx_sendTransaction':
        try {
          let authType: IIframeOptions['authType']
          const payload = params[0]
          const to = payload.to
          if (to) {
            authType =
              getAddressType(to) === AddressType.CONTRACT
                ? 'callContract'
                : 'createTransaction'
          } else {
            authType = 'createContract'
          }

          // createContract
          return await callIframe(
            'pages/dapp/auth',
            {
              appId: this.appId,
              chainId: this.chainId,
              params: params
                ? JSON.stringify({
                    payload: params[0],
                    gatewayPayload: params[1],
                  })
                : '',
              authType: authType,
            },
            this
          )
        } catch (e) {
          console.error('[AnyWeb] Error to sendTransaction', e)
          return e
        }
      case 'anyweb_importAccount':
        try {
          return await callIframe(
            'pages/dapp/auth',
            {
              appId: this.appId,
              chainId: this.chainId,
              params: params ? JSON.stringify(params[0]) : JSON.stringify({}),
              authType: 'importAccount',
            },
            this
          )
        } catch (e) {
          console.error('[AnyWeb] Error to import Address', e)
          return e
        }
      case 'anyweb_version':
        return config.version
      case 'anyweb_home':
        return await callIframe(
          'pages/index/home',
          {
            appId: this.appId,
            chainId: this.chainId,
            params: params ? JSON.stringify(params) : '',
            waitResult: false,
          },
          this
        )
      case 'exit_accounts':
        return await callIframe(
          'pages/dapp/auth',
          {
            appId: this.appId,
            chainId: this.chainId,
            params: params ? JSON.stringify(params) : '',
            authType: 'exit_accounts',
            silence: true,
          },
          this
        )
      case 'anyweb_identify':
        let identifyResult
        try {
          identifyResult = await callIframe(
            'pages/user/identify',
            {
              appId: this.appId,
              chainId: this.chainId,
              params: params ? JSON.stringify(params) : '',
              authType: 'check_identify',
              silence: true,
            },
            this
          )
          console.debug('[AnyWeb]', 'Check identify result', identifyResult)
        } catch (e) {
          console.debug('[AnyWeb]', 'need to identify', e)
          identifyResult = await callIframe(
            'pages/user/identify',
            {
              appId: this.appId,
              chainId: this.chainId,
              params: params ? JSON.stringify(params) : '',
              authType: 'identify',
            },
            this
          )
        }
        return identifyResult
      case 'anyweb_logout':
        // Logout the account of AnyWeb
        return await callIframe(
          'pages/dapp/auth',
          {
            appId: this.appId,
            chainId: this.chainId,
            params: params ? JSON.stringify(params) : '',
            authType: 'logout',
            silence: true,
          },
          this
        )
      case 'anyweb_loginstate':
        try {
          return await callIframe(
            'pages/dapp/auth',
            {
              appId: this.appId,
              params: '',
              chainId: this.chainId,
              authType: 'check_login',
              silence: true,
            },
            this
          )
        } catch (e) {
          console.debug('[AnyWeb]', 'need to login', e)
          return false
        }
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
    console.debug('[AnyWeb] on', {
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
