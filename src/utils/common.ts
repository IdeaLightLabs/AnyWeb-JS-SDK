/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/11
 */
import * as forge from 'node-forge'
import { BASE_URL } from '../config'
import {
  IAuthResult,
  IIframeData,
  IIframeEventData,
  IIframeOptions,
} from '../interface/provider'
import { Provider } from '../provider'

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

const closeIframe = (root: HTMLDivElement) => {
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

export const getIframe = async (
  url: string,
  onClose: () => void
): Promise<() => void> => {
  if (
    document.getElementById('anyweb-iframe-mask') &&
    document.getElementById('anyweb-iframe')
  ) {
    const mask = document.getElementById('anyweb-iframe-mask') as HTMLDivElement
    sendMessageToApp({
      type: 'router',
      data: {
        path: `/${url}`,
        mode: 'redirectTo',
      },
    })
    mask.style.display = 'block'
    setBodyNonScrollable()
    return () => {
      onClose()
      closeIframe(mask)
    }
  }
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
  button.onclick = () => {
    setBodyScrollable()
    onClose()
    mask.style.display = 'none'
  }
  document.body.appendChild(style)
  setBodyNonScrollable()
  document.body.insertBefore(mask, document.body.firstElementChild)
  return () => {
    onClose()
    closeIframe(mask)
  }
}

export const callIframe = async (
  path: string,
  {
    appId,
    params,
    chainId,
    scope = [2],
    authType,
    waitResult = true,
  }: IIframeOptions,
  provider: Provider
) => {
  if (waitResult) {
    return new Promise<unknown>(async (resolve, reject) => {
      let callback: IIframeData | undefined = undefined
      const close = await getIframe(
        `${path}?appId=${appId}&authType=${authType}&random=${Math.floor(
          Math.random() * 1000
        )}&chainId=${chainId}&params=${params}&scope=${JSON.stringify(scope)}`,
        () => {
          if (timer) {
            clearTimeout(timer)
          }
        }
      )
      const timer = setTimeout(() => {
        close()
        reject(new Error('Timeout'))
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
            console.log('SDK收到子页面信息: ', event.data)
            callback = event.data.data as IIframeData

            if (callback.type === 'callback') {
              window.removeEventListener(
                'message',
                receiveMessageFromIframePage
              )
              clearTimeout(timer)
              if (callback.success) {
                close()
                resolve(callback.data)
              } else {
                close()
                reject(new Error(callback.data as string))
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
      )}&chainId=${chainId}&params=${params}&scope=${JSON.stringify(scope)}`,
      () => {
        return
      }
    )
    return 'ok'
  }
}

export const readCache = (provider: Provider) => {
  try {
    const result = JSON.parse(
      (window.localStorage && window.localStorage.getItem('anyweb_info')) ||
        '{}'
    )
    if (
      Object.keys(result).length > 0 &&
      Object.keys(result).includes('address') &&
      Object.keys(result).includes('networkId') &&
      Object.keys(result).includes('chainId') &&
      Object.keys(result).includes('expires') &&
      result.expires > new Date().getTime()
    ) {
      provider.address = result.address
      provider.networkId = result.networkId
      provider.chainId = result.chainId
      provider.url = result.url
    }
  } catch (e) {
    provider.logger.error(e)
  }
}

export const setCache = (data: IAuthResult, provider: Provider) => {
  window.localStorage &&
    window.localStorage.setItem(
      'anyweb_info',
      JSON.stringify({
        ...data,
        expires: 60 * 1000 + new Date().getTime(),
      })
    )
  provider.address = data.address || provider.address
  provider.networkId = data.networkId || provider.networkId
  provider.chainId = data.chainId || provider.chainId
  provider.url = data.url
  return data
}
