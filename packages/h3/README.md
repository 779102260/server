简版 http 框架
minimal http framework

## Features

## Usage

1. 安装
2. 使用

```ts
import { createServer } from "node:http";
import { createApp, eventHandler, toNodeListener } from "h3";

const app = createApp();
app.use(
  "/",
  () => "Hello world!",
);

createServer(toNodeListener(app)).listen(3000);
```
