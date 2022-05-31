import { IIframeData, IIframeOptions, IProviderRpcError } from '../interface/provider';
import { Provider } from '../provider';
import { ConsoleLike } from './types';
export declare const getFrameWidth: () => number;
export declare const getFrameHeight: () => number;
/**
 * Check the window width to decide whether to show in full screen
 */
export declare const isFullScreen: () => boolean;
/**
 * SHA512加密
 * @param str
 */
export declare function sha512(str: string): string;
export declare const isObject: (obj: unknown) => boolean;
export declare const sendMessageToApp: ({ data, type, success, }: IIframeData) => void;
export declare const createIframe: (url: string, logger?: ConsoleLike | undefined) => Promise<void>;
export declare const getIframe: (url: string, onClose: () => void, silence?: boolean, logger?: ConsoleLike | undefined) => Promise<() => void>;
export declare const callIframe: (path: string, { appId, params, chainId, scopes, authType, waitResult, silence, }: IIframeOptions, provider: Provider) => Promise<unknown>;
export declare const writeStorage: (key: string, content: Record<string, unknown>, expiresTime?: number) => void;
export declare const isArrEqual: <T>(arr1: T[], arr2: T[]) => boolean;
export declare const isIncluded: <T>(arr1: T[], arr2: T[]) => boolean;
export declare enum ProviderErrorCode {
    UserRejectedRequest = 4001,
    Unauthorized = 4100,
    UnsupportedMethod = 4200,
    Disconnected = 4900,
    ChainDisconnected = 4901,
    SDKNotReady = 5000,
    ParamsError = 6000,
    RequestError = 7000,
    SendTransactionError = 7001,
    ImportAddressError = 7002
}
export declare class ProviderRpcError extends Error implements IProviderRpcError {
    code: number;
    data?: unknown;
    constructor(code: ProviderErrorCode, message: string, logger?: ConsoleLike);
}
