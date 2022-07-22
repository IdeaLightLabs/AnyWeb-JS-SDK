/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/2
 */

import {
  IAuthResult,
  IBaseProviderOptions,
  IIframeData,
  IIframeOptions,
  IProvider,
  IProviderConnectInfo,
  IProviderMessage,
  IProviderRpcError,
  IRequestArguments,
} from './interface/provider'
import {
  callIframe,
  createIframe,
  isObject,
  ProviderErrorCode,
  ProviderRpcError,
} from './utils/common'
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
  logger?: ConsoleLike
  public readonly appId!: string
  private chainId = 1
  private static instance: Provider
  public static ready = false

  events: {
    onConnect?: (connectInfo: IProviderConnectInfo) => void
    onDisconnect?: (error: IProviderRpcError) => void
    onChainChanged?: (chainId: string) => void
    onAccountsChanged?: (accounts: string[]) => void
    onMessage?: (message: IProviderMessage) => void
    onNetworkChanged?: (networkId: string) => void
    onReady?: () => void
  } = {}

  constructor({ logger = console, appId }: IBaseProviderOptions) {
    if (Provider.instance) {
      return Provider.instance
    }
    Provider.instance = this

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

    const messageHandler = (event: MessageEvent) => {
      if (
        event.data &&
        isObject(event.data) &&
        'type' in event.data &&
        event.data.type === 'anyweb'
      ) {
        const IframeData = event.data.data as IIframeData
        if (
          IframeData.type == 'event' &&
          IframeData.data == 'ready' &&
          IframeData.success
        ) {
          this.logger?.debug('[AnyWeb] SDK初始化完成')
          Provider.ready = true
          this.events.onReady && this.events.onReady()
          window.removeEventListener('message', messageHandler)
        }
      }
    }
    window.addEventListener('message', messageHandler)

    createIframe('pages/index/home', this.logger)
      .then()
      .catch((e) => this.logger?.error('[AnyWeb] createIframe error', e))
  }

  public static getInstance(params?: IBaseProviderOptions) {
    if (!Provider.instance) {
      if (params) {
        Provider.instance = new Provider(params)
      } else {
        throw new ProviderRpcError(
          ProviderErrorCode.SDKNotReady,
          'Provider is not initialized'
        )
      }
    }
    return Provider.instance
  }

  /**
   * Deprecated: use `request` instead
   * @param arg
   */
  async send(...arg: any[]) {
    this.logger?.info('[AnyWeb] `send` is deprecated, use `request` instead')
    if (arg.length > 1) {
      return await this.request({ method: arg[0], params: arg[1] })
    }
    throw new ProviderRpcError(
      ProviderErrorCode.ParamsError,
      'Invalid arguments'
    )
  }

  /**
   * Deprecated: use `request` instead
   * @param arg
   */
  async call(...arg: any[]) {
    this.logger?.info(
      '[AnyWeb] `call` is deprecated, use `request` instead',
      arg
    )
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
      throw new ProviderRpcError(
        ProviderErrorCode.ParamsError,
        'Invalid request arguments'
      )
    }
    const { method, params } = args
    if (!method || method.trim().length === 0) {
      throw new ProviderRpcError(
        ProviderErrorCode.ParamsError,
        'Invalid request arguments: Method is required'
      )
    }

    this.logger?.debug(`[AnyWeb] request ${method} with`, params)
    const result = await this.rawRequest(method, params)
    this.logger?.debug(`[AnyWeb] request(${method}):`, result)
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async rawRequest(method: string, params?: any): Promise<unknown> {
    if (!Provider.ready) {
      throw new ProviderRpcError(
        ProviderErrorCode.SDKNotReady,
        "Provider is not ready, please use on('ready', callback) to listen to ready event"
      )
    }
    try {
      switch (method) {
        case 'cfx_requestAccounts':
          return this.rawRequest('cfx_accounts')
        case 'cfx_accounts':
          this.logger?.debug('[AnyWeb]', { params })
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
            this.logger?.debug('[AnyWeb]', 'silent auth result', result)
          } catch (e) {
            this.logger?.debug('[AnyWeb]', 'need to auth', e)
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
        case 'cfx_signTypedData':
          const from = params[0]
          const data = params[1]
          const isRsv = !!params[2]
          return await callIframe(
            'pages/dapp/auth',
            {
              appId: this.appId,
              chainId: this.chainId,
              params: params
                ? JSON.stringify({
                    from,
                    data,
                    isRsv,
                  })
                : '',
              authType: 'signTypedData',
            },
            this
          )
        case 'cfx_sendTransaction':
          let authType: IIframeOptions['authType']
          const payload = params[0]
          const to = payload.to
          if (to) {
            authType =
              getAddressType(to, this.logger) === AddressType.CONTRACT
                ? 'callContract'
                : 'createTransaction'
          } else {
            authType = 'createContract'
          }

          return await callIframe(
            'pages/dapp/auth',
            {
              appId: this.appId,
              chainId: this.chainId,
              params: params
                ? JSON.stringify({
                    payload: params[0],
                    tradeNo: params[1] || '',
                    gatewayPayload: params[2],
                    functionName: params[3],
                  })
                : '',
              authType: authType,
            },
            this
          )
        case 'anyweb_importAccount':
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
          return this.rawRequest('anyweb_revoke', params)
        case 'anyweb_revoke':
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
            this.logger?.debug(
              '[AnyWeb]',
              'Check identify result',
              identifyResult
            )
          } catch (e) {
            this.logger?.debug('[AnyWeb]', 'need to identify', e)
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
            this.logger?.debug('[AnyWeb]', 'need to login', e)
            return false
          }
        default:
          throw new ProviderRpcError(
            ProviderErrorCode.UnsupportedMethod,
            'Unsupported Method: ' + method
          )
      }
    } catch (e: any) {
      // const codeList = {
      //   cfx_sendTransaction: ProviderErrorCode.SendTransactionError,
      //   anyweb_importAccount: ProviderErrorCode.ImportAddressError,
      // }
      this.logger?.info(`Error when handler request '${method}'!`)
      throw new ProviderRpcError(
        ProviderErrorCode.RequestError,
        isObject(e) && 'message' in e ? e.message : e,
        isObject(e) && 'data' in e ? e.data : {}
      )
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
    this.logger?.debug('[AnyWeb] on', {
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
      case 'ready':
        this.events.onReady = listener
        break
      default:
        break
    }
  }
}
