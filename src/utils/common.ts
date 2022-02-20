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
export const isPhone = () => {
  return window.screen.width < 500
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
  const hash = sha512(JSON.stringify({ appId, params }))
  const iframe = document.createElement('iframe')
  let serialNumber = ''
  iframe.style.width = isPhone() ? '100%' : '414px'
  iframe.style.height = isPhone() ? '100%' : '736px'
  iframe.style.position = 'fixed'
  iframe.style.top = '50%'
  iframe.style.left = '50%'
  iframe.style.zIndex = '9999'
  iframe.style.transform = 'translate(-50%, -50%)'
  iframe.style.background = 'white'
  iframe.id = 'anyweb'
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
  iframe.setAttribute(
    'src',
    `${BASE_URL}${path}?appId=${appId}&authType=${authType}&serialNumber=${serialNumber}&hash=${hash}&random=${Math.floor(
      Math.random() * 1000
    )}&chainId=${chainId}&params=${params}&scope=${JSON.stringify(scope)}`
  )
  document.body.insertBefore(iframe, document.body.firstElementChild)
  if (waitResult) {
    return new Promise<unknown>(async (resolve, reject) => {
      const delay = 800
      const next = (i: number) => {
        const timer = setTimeout(async () => {
          try {
            const data = (
              await axios.post(`${API_BASE_URL}/open/serial/read`, {
                serialNumber: serialNumber,
                hash: hash,
              })
            ).data.data
            if (data && data !== 'false' && data !== false) {
              clearTimeout(timer)
              document.getElementById('anyweb')?.remove()
              resolve(JSON.parse(data))
            } else {
              if (i * delay > 10 * 60 * 1000) {
                document.getElementById('anyweb')?.remove()
                reject('time out')
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
