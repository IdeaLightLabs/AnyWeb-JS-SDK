export declare enum AddressType {
    USER = "user",
    CONTRACT = "contract",
    BUILTIN = "builtin",
    NULL = "null"
}
/**
 * Get the type of an address.
 * @param address
 */
export declare const getAddressType: (address: string) => AddressType;
