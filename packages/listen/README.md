## Features
✅ 支持自定义端口
✅ 支持命令行
🔲 支持自定义路径
🔲 支持文件修改自动重启

## Useage

安装
```shell
npm i @yangsansuan/listen
```

#### 基础用法
```ts
import { createApp, createRouter, toNodeListener } from '@yangsansuan/h3'
import { listen } from '@yangsansuan/listen'

const app = createApp()
const router = createRouter()
    .get('/home', () => 'hello')
    .get('/hello/:name', (event) => `Hello ${event.context.params.name}!`)
app.use(router)
await listen(toNodeListener(app), { port: 3000 })
```

#### 命令行

进入文件夹，运行
```shell
listen
```