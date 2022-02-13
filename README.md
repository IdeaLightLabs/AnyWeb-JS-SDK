# AnyWeb JS SDK

JavaScript AnyWeb Software Development Kit is a complete library for interacting with the AnyChain in both Node.js and
browser environment.

Features:

* Support for Mobile and Desktop
* Support H5 without plugin
* Support for multiple chains
* Support hot Wallet and cold Wallet
* Easy to use for developers

## Docs

* [Home](README.md)
* [Quick Start](docs/quick_start.md)
* [API](docs/api/modules.md)
    * [Provider](docs/api/classed/defaults.md)
* [Release notes](CHANGELOG.md)
*

Check [SDK's documentation](https://wiki.anyweb.cc) site for more info.

## Install

Install through npm

```sh
$ npm install --save anyweb-js-sdk
```

## How to import

### Nodejs

Use in Node.js script

```javascript
import * from 'anyweb-js-sdk';

const conflux = new Provider({
  logger: console,
  appId: 'Your app id which get from open.anyweb.cc',
})
```

### Frontend

#### umd

The front packed package is located in `anyweb-js-sdk`'s dist folder.

```javascript
import { Conflux } from 'anyweb-js-sdk/dist/anyweb-js-sdk.umd.min.js';
```

or if your bundler supports the [`browser` field](https://docs.npmjs.com/files/package.json#browser) in `package.json`

```javascript
import * from 'anyweb-js-sdk';
```

or

```html

<script type="text/javascript" src="node_modules/anyweb-js-sdk/dist/anyweb-js-sdk.umd.min.js"></script>
<script type="text/javascript">
  const anyweb = new window.AnyWeb({
    logger: console,
    appId: 'Your app id which get from open.anyweb.cc'
  })
</script>
```
