import { describe, expect, it } from 'vitest'
import { createServer } from 'node:http'
import { createApp, createRouter, toNodeListener } from '../src/index'

describe('createApp', () => {
    it('正常运行', async () => {
        // 启动服务
        const app = createApp()
        const router = createRouter()
            .get('/home', () => 'hello')
            .get('/hello/:name', (event) => `Hello ${event.context.params.name}!`)
        app.use(router)
        const server = createServer(toNodeListener(app))
        server.listen(3000)
        // 发起测试
        const res = await fetch('http://localhost:3000/home')
        expect(await res.text()).toBe('hello')
        const res2 = await fetch('http://localhost:3000/hello/world')
        expect(await res2.text()).toBe('Hello world!')
        // 关闭服务
        server.close()
    })
})
