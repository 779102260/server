编写命令行工具，copy from [unjs/citty](https://github.com/779102260/citty-read)

## Features

✅ Fast and lightweight argument parser based on mri
🔲 Smart value parsing with typecast, boolean shortcuts and unknown flag handling
✅ Nested sub-commands
🔲 Lazy and Async commands
🔲 Plugable and composable API
🔲 Auto generated usage and help

## Usage

1. 安装
```sh
npm i @yangsansuan/citty -S
```

2. 编写你的脚本

```ts
import { defineCommond, runMain } from '@yangsansuan/citty'

const cmd = defineCommond({
    meta: {
        name: 'mycli',
        description: '命令行描述',
        version: '1.0.0'
    },
    subCommands: {
        dev: {
            meta: {...},
            args: {
                port: {
                    type: 'string',
                    description: '端口号',
                    default: 3000
                },
                ...
            },
            run() {
                console.log(123)
            }
        },
        build: {...}
    }
})

runMain(cmd)
```

3. 配置package.json

```json
{
    "bin": {
        "mycli": "dist/xx.js"
    }
}
```

4. 发布后安装运行
```sh
mycli dev
```