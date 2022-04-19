"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressType = exports.AddressType = void 0;
const conflux_address_js_1 = require("@conflux-dev/conflux-address-js");
var AddressType;
(function (AddressType) {
    AddressType["USER"] = "user";
    AddressType["CONTRACT"] = "contract";
    AddressType["BUILTIN"] = "builtin";
    AddressType["NULL"] = "null";
})(AddressType = exports.AddressType || (exports.AddressType = {}));
/**
 * Get the type of an address.
 * @param address
 */
const getAddressType = (address) => {
    const decodeResult = (0, conflux_address_js_1.decode)(address);
    console.log('decodeResult', decodeResult);
    if (Object.keys(decodeResult).includes('type')) {
        return decodeResult.type;
    }
    else {
        return AddressType.USER;
    }
};
exports.getAddressType = getAddressType;
