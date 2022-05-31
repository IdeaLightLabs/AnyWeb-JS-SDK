/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/11
 */
import * as forge from 'node-forge'
import { BASE_URL } from '../config'
import {
  IIframeData,
  IIframeEventData,
  IIframeOptions,
  IProviderRpcError,
} from '../interface/provider'
import { Provider } from '../provider'
import { ConsoleLike } from './types'

export const getFrameWidth = () => {
  if (window.innerHeight < 736) {
    return ((window.innerHeight - 18) * 9.0) / 16.0
  } else {
    return 414
  }
}

export const getFrameHeight = () => {
  if (window.innerHeight < 736) {
    return window.innerHeight - 18
  } else {
    return 736
  }
}

/**
 * Check the window width to decide whether to show in full screen
 */
export const isFullScreen = () => {
  return window.innerWidth < 500
}

/**
 * SHA512加密
 * @param str
 */
export function sha512(str: string) {
  const md = forge.md.sha512.create()
  md.update(str)
  return md.digest().toHex()
}

const setBodyNonScrollable = () => {
  document.body.style.overflow = 'hidden'
  const scrollTop =
    document.body.scrollTop || document.documentElement.scrollTop
  document.body.style.cssText +=
    'position:fixed;width:100%;top:-' + scrollTop + 'px;'
  document.addEventListener(
    'touchmove',
    (e) => {
      e.stopPropagation()
    },
    { passive: false }
  )
}

const setBodyScrollable = () => {
  document.body.style.overflow = ''
  document.body.style.position = ''
  const top = document.body.style.top
  document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
  document.body.style.top = ''

  document.removeEventListener('touchmove', (e) => {
    e.stopPropagation()
  })
}

export const isObject = (obj: unknown) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

const closeIframe = (root: HTMLDivElement, logger?: ConsoleLike) => {
  logger?.debug('[AnyWeb]', 'closeIframe', root.style)
  setBodyScrollable()
  root.style.display = 'none'
}
export const sendMessageToApp = ({
  data,
  type,
  success = true,
}: IIframeData) => {
  const iframe: HTMLIFrameElement | null = document.getElementById(
    'anyweb-iframe'
  ) as HTMLIFrameElement | null
  if (!iframe) {
    return
  }
  iframe.contentWindow &&
    iframe.contentWindow.postMessage(
      {
        data: {
          data,
          type,
          success,
        },
        type: 'anyweb',
      },
      '*'
    )
}

export const createIframe = async (url: string, logger?: ConsoleLike) => {
  logger?.debug('[AnyWeb] createIframe', url)
  const mask = document.createElement('div')
  const div = document.createElement('div')
  const iframe = document.createElement('iframe')
  const button = document.createElement('div')
  const style = document.createElement('style')
  style.innerHTML = `  
.iframe-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(247, 247, 247, 0.8);
    z-index: 99999;
  }
  .iframe-contain {
    position: fixed;
    background: #FFFFFF;
    border: 1px solid #EAEAEA;
    z-index: 999999999;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    border-radius: ${isFullScreen() ? '0' : '15px'};
    width: ${isFullScreen() ? '100%' : `${getFrameWidth()}px`};
    height: ${isFullScreen() ? '100%' : `${getFrameHeight()}px`};
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }

  .iframe {
    border-radius: ${isFullScreen() ? '0' : '15px'};
    height: 100%;
    width: 100%;
    z-index: 999999;
    overflow-x: hidden;
  }

  .iframe-contain-button {
    border-radius: 9px;
    width: 18px;
    height: 18px;
    z-index: 9999999;
    position: absolute;
    top: 36px;
    right: 36px;
    cursor: pointer;
  }

  .iframe-contain-button:before {
    position: absolute;
    content: '';
    width: 2px;
    height: 24px;
    background: black;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)  rotate(45deg);
  }

  .iframe-contain-button:after {
    content: '';
    position: absolute;
    width: 2px;
    height: 24px;
    background: black;
    transform: translate(-50%, -50%)  rotate(-45deg);
    top: 50%;
    left: 50%;
  }`
  mask.className = 'iframe-mask'
  div.className = 'iframe-contain'
  button.className = 'iframe-contain-button'
  iframe.className = 'iframe'

  iframe.id = 'anyweb-iframe'
  mask.id = 'anyweb-iframe-mask'

  iframe.setAttribute('src', `${BASE_URL}${url}`)
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('scrolling', 'no')

  div.insertBefore(iframe, div.firstElementChild)
  !isFullScreen() && mask.insertBefore(button, mask.firstElementChild)
  mask.insertBefore(div, mask.firstElementChild)
  // Hide before call the method
  mask.style.display = 'none'
  // setBodyScrollable()

  button.onclick = () => {
    closeIframe(mask)

    throw new ProviderRpcError(
      ProviderErrorCode.Unauthorized,
      'User canceled the operation'
    )
  }
  document.body.appendChild(style)

  document.body.insertBefore(mask, document.body.firstElementChild)
}

export const getIframe = async (
  url: string,
  onClose: () => void,
  silence = false,
  logger?: ConsoleLike
): Promise<() => void> => {
  if (
    !(
      document.getElementById('anyweb-iframe-mask') &&
      document.getElementById('anyweb-iframe')
    )
  ) {
    logger?.warn('[AnyWeb] Something wrong with the iframe, recreating...')
    await createIframe(url)
  }
  sendMessageToApp({
    type: 'router',
    data: {
      path: `/${url}`,
      mode: 'redirectTo',
    },
  })
  const mask = document.getElementById('anyweb-iframe-mask') as HTMLDivElement
  if (!silence) {
    mask.style.display = 'block'
    setBodyNonScrollable()
  }
  return () => {
    onClose()
    if (!silence) {
      closeIframe(mask)
    }
  }
}

export const callIframe = async (
  path: string,
  {
    appId,
    params,
    chainId,
    scopes = [],
    authType,
    waitResult = true,
    silence = false,
  }: IIframeOptions,
  provider: Provider
) => {
  if (waitResult) {
    return new Promise<unknown>(async (resolve, reject) => {
      let callback: IIframeData | undefined = undefined
      const close = await getIframe(
        `${path}?appId=${appId}&authType=${authType}&random=${Math.floor(
          Math.random() * 1000
        )}&chainId=${chainId}&params=${params}&scopes=${JSON.stringify(
          scopes
        )}`,
        () => {
          if (timer) {
            clearTimeout(timer)
          }
        },
        silence
      )
      const timer = setTimeout(() => {
        close()
        reject('Timeout')
      }, 10 * 60 * 1000)

      // Set Listeners
      window.addEventListener(
        'message',
        function receiveMessageFromIframePage(event) {
          if (
            event.data &&
            isObject(event.data) &&
            'type' in event.data &&
            event.data.type === 'anyweb'
          ) {
            provider.logger?.debug('[AnyWeb] SDK收到子页面信息: ', event.data)
            callback = event.data.data as IIframeData

            if (callback.type === 'callback') {
              window.removeEventListener(
                'message',
                receiveMessageFromIframePage
              )
              clearTimeout(timer)
              close()
              if (callback.success) {
                resolve(callback.data)
              } else {
                reject(callback.data as string)
              }
            } else if (callback.type === 'event') {
              const eventData = callback.data as IIframeEventData
              switch (eventData.type) {
                case 'changeNetwork':
                  provider.events.onNetworkChanged &&
                    provider.events.onNetworkChanged(String(eventData.data))
                  break
                case 'changeChain':
                  provider.events.onChainChanged &&
                    provider.events.onChainChanged(String(eventData.data))
                  break
                default:
                  break
              }
            }
          }
        },
        false
      )
    })
  } else {
    await getIframe(
      `${path}?appId=${appId}&authType=${authType}&random=${Math.floor(
        Math.random() * 1000
      )}&chainId=${chainId}&params=${params}&scopes=${JSON.stringify(scopes)}`,
      () => {
        return
      },
      silence
    )
    return 'ok'
  }
}

export const writeStorage = (
  key: string,
  content: Record<string, unknown>,
  expiresTime: number = 5 * 60 * 1000
) => {
  window.localStorage &&
    window.localStorage.setItem(
      `anyweb_${key}`,
      JSON.stringify({
        ...content,
        expires: expiresTime + new Date().getTime(),
      })
    )
}

export const isArrEqual = <T>(arr1: T[], arr2: T[]) => {
  return arr1.length === arr2.length && arr1.every((ele) => arr2.includes(ele))
}

export const isIncluded = <T>(arr1: T[], arr2: T[]): boolean => {
  return arr1.length === new Set([...arr1, ...arr2]).size
}

export enum ProviderErrorCode {
  UserRejectedRequest = 4001,
  Unauthorized = 4100,
  UnsupportedMethod = 4200,
  Disconnected = 4900,
  ChainDisconnected = 4901,
  SDKNotReady = 5000,
  ParamsError = 6000,
  RequestError = 7000,
  SendTransactionError = 7001,
  ImportAddressError = 7002,
}

export class ProviderRpcError extends Error implements IProviderRpcError {
  code: number
  data?: unknown

  constructor(
    code: ProviderErrorCode,
    message: string,
    logger: ConsoleLike = console
  ) {
    super('[AnyWeb] ' + message)
    logger.debug(`[AnyWeb] Throw the error(${code}):` + message)
    this.code = code
    this.name = ProviderErrorCode[code]
  }
}
