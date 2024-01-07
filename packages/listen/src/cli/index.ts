import { defineCommond, runMain } from '@yangsansuan/citty'
import { createApp, createStatic, toNodeListener } from '@yangsansuan/h3'
import { listen } from '../index'

export const run = (meta: { name: string; description: string; version: string }) => {
    const cmd = defineCommond({
        meta,
        args: {
            port: {
                type: 'string',
                description: '端口号',
            },
        },
        async run(context) {
            // -- 参数处理 --
            const { port } = context.options

            // -- 创建服务 --
            const app = createApp()
            app.use(createStatic())

            // -- 启动 --
            const { port: _port } = await listen(toNodeListener(app), { port })
            console.log(`listen on http://localhost:${_port}`)
        },
    })
    runMain(cmd)
}
