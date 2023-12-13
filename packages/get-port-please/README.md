获取一个可用的端口

1. 可指定端口或端口组
2. 指定端口被占用时随机获取一个可用端口

Obtain an Available Port

1. Can specify a port or a group of ports
2. When the specified port is occupied, randomly obtain an available port

## Usage

```ts
import { getPort } from "@yangsansuan/get-port-please";

// 获取一个可以使用的port，默认3000
const port = await getPort()
// 获取指定的port
const port = await getPort(3001)
// 从可选列表中获取一个可用的port
const port = await getPort([3000, 3001, 3002])
```