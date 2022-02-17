/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/4
 */
export type ConsoleLike = Pick<
  Console,
  'log' | 'warn' | 'error' | 'debug' | 'info' | 'trace'
>

export interface IAuthResult {
  chainId: number
  networkId: number
  address: string[]
}
