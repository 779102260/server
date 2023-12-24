import { it, expect } from 'vitest'
import { createApp, createRouter, toNodeListener } from '@yangsansuan/h3'
import { listen } from '../src/listen'

it('正常运行', async () => {
    // 启动服务
    const app = createApp()
    const router = createRouter()
        .get('/home', () => 'hello')
        .get('/hello/:name', (event) => `Hello ${event.context.params.name}!`)
    app.use(router)
    const { server } = await listen(toNodeListener(app), { port: 3000 })
    // 发起测试
    const res = await fetch('http://localhost:3000/home')
    expect(await res.text()).toBe('hello')
    // 关闭服务
    server.close()
})
