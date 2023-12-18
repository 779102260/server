import { describe, expect, it } from 'vitest'
import { createServer } from 'node:http'
import { createApp, toNodeListener } from '../src/index'

describe('createApp', () => {
    it('正常运行', async () => {
        // 启动服务
        const app = createApp()
        app.use('/home', () => 'hello')
        const server = createServer(toNodeListener(app))
        server.listen(3000)
        // 发起测试
        const res = await fetch('http://localhost:3000/home')
        expect(await res.text()).toBe('hello')
        // 关闭服务
        server.close()
    })
})
