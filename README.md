# AnyWeb JS SDK

AnyWeb JS SDK 是为 [Anyweb](https://anyweb.cc) 开发的SDK，提供了一套简单的API，方便开发者快速将 Dapp 接入到 AnyWeb 中实现便捷的钱包服务。

Features:

* 支持在移动端和PC端调用钱包服务
* 支持网页内和跳转App调用钱包服务
* 支持多链钱包服务
* 支持 ` 热钱包 ` 和 ` 冷钱包 `
* 简单易用快速上手

## 支持性

### 已支持

* Conflux

### 待支持

* Conflux EVM Space

## Docs

* [介绍](https://wiki.anyweb.cc/docs/intro)
* [快速开始](https://wiki.anyweb.cc/docs/quick_start)
* [API](https://wiki.anyweb.cc/docs/API/modules)
    * [Provider](https://wiki.anyweb.cc/docs/API/classes/default)
* [Release notes](https://wiki.anyweb.cc/docs/CHANGELOG)

前往[ 官网文档 ](https://wiki.anyweb.cc)了解更多

## 开始之前

请先在[ AnyWeb开放平台 ](https://open.anyweb.cc)注册账号获取到AppId等相关信息。

## 安装

` npm ` 安装

```sh
$ npm install --save @idealight-labs/anyweb-js-sdk
```

## 引用方法

### ESM

```javascript
import { Provider } from 'anyweb-js-sdk';

const provider = new Provider({
  logger: console,
  appId: '从open.anyweb.cc拿到的AppId',
});
```

### UMD

从 `anyweb-js-sdk` 的 `dist` 目录中进行引用 `umd` 版本.

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@idealight-labs/anyweb-js-sdk@latest/dist/anyweb-js-sdk.umd.min.js"></script>

<script type="text/javascript">
  const provider = new window.AnyWeb({
    logger: console,
    appId: '从open.anyweb.cc拿到的AppId'
  })
</script>
```
