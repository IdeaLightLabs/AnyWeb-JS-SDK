/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/2
 */
import { IBaseProviderOptions, IProvider, IProviderConnectInfo, IProviderMessage, IProviderRpcError, IRequestArguments } from './interface/provider';
import { ConsoleLike } from './utils/types';
/**
 * AnyWeb Provider
 * @class Provider
 * @author Littleor
 * @since 2020/2/2
 * @example
 * const provider = new Provider()
 */
export declare class Provider implements IProvider {
    logger: ConsoleLike | null;
    readonly appId: string;
    private chainId;
    private static instance;
    static ready: boolean;
    appUrl: string | undefined;
    events: {
        onConnect?: (connectInfo: IProviderConnectInfo) => void;
        onDisconnect?: (error: IProviderRpcError) => void;
        onChainChanged?: (chainId: string) => void;
        onAccountsChanged?: (accounts: string[]) => void;
        onMessage?: (message: IProviderMessage) => void;
        onNetworkChanged?: (networkId: string) => void;
        onReady?: () => void;
    };
    constructor({ logger, appId, global }: IBaseProviderOptions, appUrl?: string);
    static getInstance(params?: IBaseProviderOptions): Provider;
    /**
     * Deprecated: use `request` instead
     * @param arg
     */
    send(...arg: any[]): Promise<unknown>;
    /**
     * Deprecated: use `request` instead
     * @param arg
     */
    call(...arg: any[]): Promise<unknown>;
    /**
     * Submits an RPC request
     * @param args {IRequestArguments} Request Arguments: {method, params}
     * @returns {Promise<any>}
     * @example
     * const result = await provider.request({ method: 'cfx_sendTransaction', params})
     */
    request(args: IRequestArguments): Promise<unknown>;
    /**
     * Deprecated: use `request` instead
     */
    enable(): Promise<unknown>;
    /**
     * Submits an RPC request
     * @param method
     * @param params
     * @protected
     */
    protected rawRequest(method: string, params?: any): Promise<unknown>;
    /**
     * Monitor information
     * @param type {string} Type of information
     * @param listener {Function} Event listener
     * @example
     * provider.on('connected', listener)
     */
    on(type: string, listener: (...args: any[]) => void): void;
}
