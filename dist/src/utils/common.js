"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderRpcError = exports.ProviderErrorCode = exports.isIncluded = exports.isArrEqual = exports.writeStorage = exports.callIframe = exports.getIframe = exports.createIframe = exports.sendMessageToApp = exports.isObject = exports.sha512 = exports.isFullScreen = exports.getFrameHeight = exports.getFrameWidth = void 0;
/**
 * @author Littleor <me@littleor.cn>
 * @since 2022/2/11
 */
const forge = __importStar(require("node-forge"));
const config_1 = require("../config");
const getFrameWidth = () => {
    if (window.innerHeight < 736) {
        return ((window.innerHeight - 18) * 9.0) / 16.0;
    }
    else {
        return 414;
    }
};
exports.getFrameWidth = getFrameWidth;
const getFrameHeight = () => {
    if (window.innerHeight < 736) {
        return window.innerHeight - 18;
    }
    else {
        return 736;
    }
};
exports.getFrameHeight = getFrameHeight;
/**
 * Check the window width to decide whether to show in full screen
 */
const isFullScreen = () => {
    return window.innerWidth < 500;
};
exports.isFullScreen = isFullScreen;
/**
 * SHA512加密
 * @param str
 */
function sha512(str) {
    const md = forge.md.sha512.create();
    md.update(str);
    return md.digest().toHex();
}
exports.sha512 = sha512;
const setBodyNonScrollable = () => {
    document.body.style.overflow = 'hidden';
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    document.body.style.cssText +=
        'position:fixed;width:100%;top:-' + scrollTop + 'px;';
    document.addEventListener('touchmove', (e) => {
        e.stopPropagation();
    }, { passive: false });
};
const setBodyScrollable = () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    const top = document.body.style.top;
    document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
    document.body.style.top = '';
    document.removeEventListener('touchmove', (e) => {
        e.stopPropagation();
    });
};
const isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]';
};
exports.isObject = isObject;
const closeIframe = (root, logger) => {
    logger === null || logger === void 0 ? void 0 : logger.debug('[AnyWeb]', 'closeIframe', root.style);
    setBodyScrollable();
    root.style.display = 'none';
};
const sendMessageToApp = ({ data, type, success = true, }) => {
    const iframe = document.getElementById('anyweb-iframe');
    if (!iframe) {
        return;
    }
    iframe.contentWindow &&
        iframe.contentWindow.postMessage({
            data: {
                data,
                type,
                success,
            },
            type: 'anyweb',
        }, '*');
};
exports.sendMessageToApp = sendMessageToApp;
const createIframe = (url, logger) => __awaiter(void 0, void 0, void 0, function* () {
    logger === null || logger === void 0 ? void 0 : logger.debug('[AnyWeb] createIframe', url);
    const mask = document.createElement('div');
    const div = document.createElement('div');
    const iframe = document.createElement('iframe');
    const button = document.createElement('div');
    const style = document.createElement('style');
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
    border-radius: ${(0, exports.isFullScreen)() ? '0' : '15px'};
    width: ${(0, exports.isFullScreen)() ? '100%' : `${(0, exports.getFrameWidth)()}px`};
    height: ${(0, exports.isFullScreen)() ? '100%' : `${(0, exports.getFrameHeight)()}px`};
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }

  .iframe {
    border-radius: ${(0, exports.isFullScreen)() ? '0' : '15px'};
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
  }`;
    mask.className = 'iframe-mask';
    div.className = 'iframe-contain';
    button.className = 'iframe-contain-button';
    iframe.className = 'iframe';
    iframe.id = 'anyweb-iframe';
    mask.id = 'anyweb-iframe-mask';
    iframe.setAttribute('src', `${config_1.BASE_URL}${url}`);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    div.insertBefore(iframe, div.firstElementChild);
    !(0, exports.isFullScreen)() && mask.insertBefore(button, mask.firstElementChild);
    mask.insertBefore(div, mask.firstElementChild);
    // Hide before call the method
    mask.style.display = 'none';
    // setBodyScrollable()
    button.onclick = () => {
        closeIframe(mask);
        throw new ProviderRpcError(ProviderErrorCode.Unauthorized, 'User canceled the operation');
    };
    document.body.appendChild(style);
    document.body.insertBefore(mask, document.body.firstElementChild);
});
exports.createIframe = createIframe;
const getIframe = (url, onClose, silence = false, logger) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(document.getElementById('anyweb-iframe-mask') &&
        document.getElementById('anyweb-iframe'))) {
        logger === null || logger === void 0 ? void 0 : logger.warn('[AnyWeb] Something wrong with the iframe, recreating...');
        yield (0, exports.createIframe)(url);
    }
    (0, exports.sendMessageToApp)({
        type: 'router',
        data: {
            path: `/${url}`,
            mode: 'redirectTo',
        },
    });
    const mask = document.getElementById('anyweb-iframe-mask');
    if (!silence) {
        mask.style.display = 'block';
        setBodyNonScrollable();
    }
    return () => {
        onClose();
        if (!silence) {
            closeIframe(mask);
        }
    };
});
exports.getIframe = getIframe;
const callIframe = (path, { appId, params, chainId, scopes = [], authType, waitResult = true, silence = false, }, provider) => __awaiter(void 0, void 0, void 0, function* () {
    if (waitResult) {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            let callback = undefined;
            const close = yield (0, exports.getIframe)(`${path}?appId=${appId}&authType=${authType}&random=${Math.floor(Math.random() * 1000)}&chainId=${chainId}&params=${params}&scopes=${JSON.stringify(scopes)}`, () => {
                if (timer) {
                    clearTimeout(timer);
                }
            }, silence);
            const timer = setTimeout(() => {
                close();
                reject('Timeout');
            }, 10 * 60 * 1000);
            // Set Listeners
            window.addEventListener('message', function receiveMessageFromIframePage(event) {
                var _a;
                if (event.data &&
                    (0, exports.isObject)(event.data) &&
                    'type' in event.data &&
                    event.data.type === 'anyweb') {
                    (_a = provider.logger) === null || _a === void 0 ? void 0 : _a.debug('[AnyWeb] SDK收到子页面信息: ', event.data);
                    callback = event.data.data;
                    if (callback.type === 'callback') {
                        window.removeEventListener('message', receiveMessageFromIframePage);
                        clearTimeout(timer);
                        close();
                        if (callback.success) {
                            resolve(callback.data);
                        }
                        else {
                            reject(callback.data);
                        }
                    }
                    else if (callback.type === 'event') {
                        const eventData = callback.data;
                        switch (eventData.type) {
                            case 'changeNetwork':
                                provider.events.onNetworkChanged &&
                                    provider.events.onNetworkChanged(String(eventData.data));
                                break;
                            case 'changeChain':
                                provider.events.onChainChanged &&
                                    provider.events.onChainChanged(String(eventData.data));
                                break;
                            default:
                                break;
                        }
                    }
                }
            }, false);
        }));
    }
    else {
        yield (0, exports.getIframe)(`${path}?appId=${appId}&authType=${authType}&random=${Math.floor(Math.random() * 1000)}&chainId=${chainId}&params=${params}&scopes=${JSON.stringify(scopes)}`, () => {
            return;
        }, silence);
        return 'ok';
    }
});
exports.callIframe = callIframe;
const writeStorage = (key, content, expiresTime = 5 * 60 * 1000) => {
    window.localStorage &&
        window.localStorage.setItem(`anyweb_${key}`, JSON.stringify(Object.assign(Object.assign({}, content), { expires: expiresTime + new Date().getTime() })));
};
exports.writeStorage = writeStorage;
const isArrEqual = (arr1, arr2) => {
    return arr1.length === arr2.length && arr1.every((ele) => arr2.includes(ele));
};
exports.isArrEqual = isArrEqual;
const isIncluded = (arr1, arr2) => {
    return arr1.length === new Set([...arr1, ...arr2]).size;
};
exports.isIncluded = isIncluded;
var ProviderErrorCode;
(function (ProviderErrorCode) {
    ProviderErrorCode[ProviderErrorCode["UserRejectedRequest"] = 4001] = "UserRejectedRequest";
    ProviderErrorCode[ProviderErrorCode["Unauthorized"] = 4100] = "Unauthorized";
    ProviderErrorCode[ProviderErrorCode["UnsupportedMethod"] = 4200] = "UnsupportedMethod";
    ProviderErrorCode[ProviderErrorCode["Disconnected"] = 4900] = "Disconnected";
    ProviderErrorCode[ProviderErrorCode["ChainDisconnected"] = 4901] = "ChainDisconnected";
    ProviderErrorCode[ProviderErrorCode["SDKNotReady"] = 5000] = "SDKNotReady";
    ProviderErrorCode[ProviderErrorCode["ParamsError"] = 6000] = "ParamsError";
    ProviderErrorCode[ProviderErrorCode["RequestError"] = 7000] = "RequestError";
    ProviderErrorCode[ProviderErrorCode["SendTransactionError"] = 7001] = "SendTransactionError";
    ProviderErrorCode[ProviderErrorCode["ImportAddressError"] = 7002] = "ImportAddressError";
})(ProviderErrorCode = exports.ProviderErrorCode || (exports.ProviderErrorCode = {}));
class ProviderRpcError extends Error {
    constructor(code, message, logger = console) {
        super('[AnyWeb] ' + message);
        logger.debug(`[AnyWeb] Throw the error(${code}):` + message);
        this.code = code;
        this.name = ProviderErrorCode[code];
    }
}
exports.ProviderRpcError = ProviderRpcError;
