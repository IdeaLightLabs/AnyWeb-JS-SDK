/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/11
 */
import * as forge from 'node-forge'
import axios from 'axios'
import { API_BASE_URL, BASE_URL } from '../config'
import { IAuthResult } from '../interface/provider'
import { Provider } from '../provider'

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

export interface IIframeOptions {
  appId: string
  params: string
  chainId: string
  scope?: number[]
  authType?: 'account' | 'createContract' | 'callContract' | 'createTransaction'
  waitResult?: boolean
}

export const getIframe = async (
  url: string,
  onClose: () => void
): Promise<HTMLDivElement> => {
  const div = document.createElement('div')
  const iframe = document.createElement('iframe')
  const button = document.createElement('div')
  const style = document.createElement('style')
  style.innerHTML = `  .iframe-contain {
    position: fixed;
    background: #FFFFFF;
    border: 1px solid #EAEAEA;
    z-index: 999999999;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    width: 414px;
    height: 736px;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }

  .iframe {
    border-radius: 15px;
    height: 100%;
    width: 100%;
    z-index: 1;
  }

  .iframe-contain-button {
    border-radius: 9px;
    background: rgba(130, 138, 147, 0.5);
    width: 18px;
    height: 18px;
    z-index: 2;
    position: absolute;
    top: ${isFullScreen() ? '0' : '-9px'};
    right: ${isFullScreen() ? '0' : '-9px'};
    cursor: pointer;
  }

  .iframe-contain-button:before {
    position: absolute;
    content: '';
    width: 2px;
    height: 12px;
    background: black;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)  rotate(45deg);
  }

  .iframe-contain-button:after {
    content: '';
    position: absolute;
    width: 2px;
    height: 12px;
    background: black;
    transform: translate(-50%, -50%)  rotate(-45deg);
    top: 50%;
    left: 50%;
  }
`
  div.className = 'iframe-contain'
  button.className = 'iframe-contain-button'
  iframe.className = 'iframe'
  div.id = 'anyweb-iframe-contain'
  div.style.width = isFullScreen() ? '100%' : '414px'
  div.style.height = isFullScreen() ? '100%' : '736px'
  iframe.setAttribute('src', url)
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('scrolling', 'none')
  div.insertBefore(iframe, div.firstElementChild)
  div.insertBefore(button, div.firstElementChild)
  button.onclick = () => {
    onClose()
    div.remove()
  }
  document.body.appendChild(style)
  document.body.insertBefore(div, document.body.firstElementChild)
  return div
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
  }: IIframeOptions
) => {
  let serialNumber = ''
  const hash = sha512(JSON.stringify({ appId, params }))

  try {
    serialNumber = (
      await axios.post(`${API_BASE_URL}/open/serial/create`, {
        hash: hash,
      })
    ).data.data.serialNumber
  } catch (e) {
    console.error('Get serialNumber error', e)
    throw new Error('Get serialNumber error')
  }
  if (waitResult) {
    return new Promise<unknown>(async (resolve, reject) => {
      let timer: NodeJS.Timeout | undefined = undefined
      const iframeContain = await getIframe(
        `${BASE_URL}${path}?appId=${appId}&authType=${authType}&serialNumber=${serialNumber}&hash=${hash}&random=${Math.floor(
          Math.random() * 1000
        )}&chainId=${chainId}&params=${params}&scope=${JSON.stringify(scope)}`,
        () => {
          if (timer) {
            clearTimeout(timer)
            reject(new Error('User cancel'))
          }
        }
      )
      const delay = 800
      const next = (i: number) => {
        timer = setTimeout(async () => {
          try {
            const data = (
              await axios.post(`${API_BASE_URL}/open/serial/read`, {
                serialNumber: serialNumber,
                hash: hash,
              })
            ).data.data
            if (data && data !== 'false' && data !== false) {
              timer && clearTimeout(timer)
              iframeContain.remove()
              resolve(JSON.parse(data))
            } else {
              if (i * delay > 10 * 60 * 1000) {
                iframeContain.remove()
                reject(new Error('Timeout'))
              }
              next(i++)
            }
          } catch (e) {
            console.error("Can't get result from iframe", e)
          }
        }, delay)
      }
      next(0)
    })
  }
  return 'ok'
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
  provider.address = data.address
  provider.networkId = data.networkId
  provider.chainId = data.chainId
  provider.url = data.url
  return data
}
