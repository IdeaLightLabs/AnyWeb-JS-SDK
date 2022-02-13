# Quickstart

> All code starting with a $ is meant to run on your terminal. All code starting with a &gt; is meant to run in a node.js interpreter.

## Install

Install the SDK with npm.

```text
$ npm install --save anyweb-js-sdk
```

## Include in H5

HTML

```html
<script src="path/anyweb-js-sdk.umd.min.js"></script>
<script src="path/js-conflux-sdk.umd.min.js"></script>
```

JS

```javascript
window.conflux = new window.AnyWeb.Provider({
  logger: console,
  appId: 'ccb32218-56d4-4765-ba97-867adad7a63c',
})
```

## Use

AnyWeb JS SDK follow the [EIP1193](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md), so you can use the
SDK to interact with the conflux by [js-sdk-conflux](https://github.com/Conflux-Chain/js-conflux-sdk).

Usage can be found in the [js-sdk-conflux]() repository, all you should do is to import the SDK and set the provider.

```javascript   
const conflux = new Conflux({
  url: 'https://test.confluxrpc.com',
  networkId: 1,
  logger: console, // for debug
});
conflux.provider = new window.AnyWeb.Provider({
  logger: console,
  appId: 'ccb32218-56d4-4765-ba97-867adad7a63c',
})    
```
