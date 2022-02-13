[anyweb-js-sdk](../README.md) / [Exports](../modules.md) / default

# Class: default

AnyWeb Provider

**`author`** Littleor

**`since`** 2020/2/2

**`example`**
const provider = new Provider()

## Implements

- `IProvider`

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [address](default.md#address)
- [appId](default.md#appid)
- [logger](default.md#logger)

### Methods

- [call](default.md#call)
- [enable](default.md#enable)
- [on](default.md#on)
- [rawRequest](default.md#rawrequest)
- [request](default.md#request)
- [send](default.md#send)

## Constructors

### constructor

• **new default**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `BaseProviderOptions` |

#### Defined in

[provider.ts:27](https://github.com/Littleor/AnyWeb-JS-SDK/blob/bbab8f6/src/provider.ts#L27)

## Properties

### address

• `Protected` **address**: `string`[] = `[]`

#### Defined in

[provider.ts:25](https://github.com/Littleor/AnyWeb-JS-SDK/blob/bbab8f6/src/provider.ts#L25)

___

### appId

• `Protected` **appId**: `string`

#### Defined in

[provider.ts:24](https://github.com/Littleor/AnyWeb-JS-SDK/blob/bbab8f6/src/provider.ts#L24)

___

### logger

• `Protected` **logger**: `ConsoleLike`

#### Defined in

[provider.ts:23](https://github.com/Littleor/AnyWeb-JS-SDK/blob/bbab8f6/src/provider.ts#L23)

## Methods

### call

▸ **call**(...`arg`): `Promise`<`unknown`\>

Deprecated: use `request` instead

#### Parameters

| Name | Type |
| :------ | :------ |
| `...arg` | `any`[] |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[provider.ts:61](https://github.com/Littleor/AnyWeb-JS-SDK/blob/bbab8f6/src/provider.ts#L61)

___

### enable

▸ **enable**(): `Promise`<`unknown`\>

Deprecated: use `request` instead

#### Returns

`Promise`<`unknown`\>

#### Defined in

[provider.ts:93](https://github.com/Littleor/AnyWeb-JS-SDK/blob/bbab8f6/src/provider.ts#L93)

___

### on

▸ **on**(`type`, `listener`): `void`

Monitor information

**`example`**
provider.on('connected', listener)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | Type of information |
| `listener` | (...`args`: `any`[]) => `void` | Event listener |

#### Returns

`void`

#### Implementation of

IProvider.on

#### Defined in

[provider.ts:144](https://github.com/Littleor/AnyWeb-JS-SDK/blob/bbab8f6/src/provider.ts#L144)

___

### rawRequest

▸ `Protected` **rawRequest**(`method`, `params?`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `params?` | `object` \| readonly `unknown`[] |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[provider.ts:99](https://github.com/Littleor/AnyWeb-JS-SDK/blob/bbab8f6/src/provider.ts#L99)

___

### request

▸ **request**(`args`): `Promise`<`unknown`\>

Submits an RPC request

**`example`**
const result = await provider.request({ method: 'cfx_sendTransaction', params})

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `IRequestArguments` | Request Arguments: {method, params} |

#### Returns

`Promise`<`unknown`\>

#### Implementation of

IProvider.request

#### Defined in

[provider.ts:77](https://github.com/Littleor/AnyWeb-JS-SDK/blob/bbab8f6/src/provider.ts#L77)

___

### send

▸ **send**(...`arg`): `Promise`<`unknown`\>

Deprecated: use `request` instead

#### Parameters

| Name | Type |
| :------ | :------ |
| `...arg` | `any`[] |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[provider.ts:49](https://github.com/Littleor/AnyWeb-JS-SDK/blob/bbab8f6/src/provider.ts#L49)
