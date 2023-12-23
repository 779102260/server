简版 http 框架
minimal http framework

## Features

## Usage

1. 安装
```
pnpm i @yangsansuan/h3
```
2. 使用

```ts
import { createServer } from "node:http";
import { createApp, eventHandler, toNodeListener } from "h3";

const app = createApp();
const router = createServer().get("/", eventHandler(() => "Hello world!"));
app.use(router);
createServer(toNodeListener(app)).listen(3000);
```
