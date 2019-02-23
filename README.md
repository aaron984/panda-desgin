<div class="panda-doc-intro">
  <img style="height: 80px" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" alt="" />
  <h2>panda</h2>
  <p>轻量、可靠的移动端 react 组件库</p>
</div>
---

## 特性

* 10+ 个经过线上业务检验的组件
* 95%+ 单元测试覆盖率
* 完善的中文档和示例
* 支持 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import)

## 安装

#### NPM

```shell
npm install panda-desgin
```

#### YARN

```shell
yarn add panda-desgin
```

## 快速上手

#### 方式一. 使用  [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) (推荐)

`babel-plugin-import` 是一款 babel 插件，它会在编译过程中将 import 的写法自动转换为按需引入的方式

```bash
# 安装 babel-plugin-import 插件
npm i babel-plugin-import -D
```

```js
// 在 .babelrc 或 babel-loader 中添加插件配置
// 注意：webpack 1 无需设置 libraryDirectory。
{
  "plugins": [
    ["import", {
      "libraryName": "panda-desgin",
      "libraryDirectory": "es",
      "style": true
    }]
  ]
}
```

接着你可以在代码中直接引入 panda-desgin 组件，插件会自动将代码转化为方式二中的按需引入形式。

```js
import { Button } from 'panda-desgin';
```

#### 方式二. 按需引入组件

在不使用插件的情况下，可以手动引入需要的组件

```js
import Button from 'panda-desgin/lib/button';
import 'panda-desgin/lib/button/style';
```

#### 方式三. 导入所有组件

```js
import { Button } from 'panda-desgin';
import 'panda-desgin/lib/index.css';

```

> 注意：配置 babel-plugin-import 插件后将不允许导入所有组件

## 浏览器支持

现代浏览器以及 Android 4.0+, iOS 6+.

## 开源协议

本项目基于 [MIT](https://zh.wikipedia.org/wiki/MIT%E8%A8%B1%E5%8F%AF%E8%AD%89) 协议，请自由地享受和参与开源。
