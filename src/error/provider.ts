/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/4
 */
import { IProviderRpcError } from '../interface/provider'
import { ProviderRpcErrorCode } from '../../lib/interface/rpc'

class ProviderRpcError extends Error implements IProviderRpcError {
  code: number
  message: string
  data?: unknown

  constructor(message: string, code: ProviderRpcErrorCode, data?: unknown) {
    super(message)
    this.code = code
    this.message = message
    this.data = data || null
    this.name = 'ProviderRpcError'
  }
}
