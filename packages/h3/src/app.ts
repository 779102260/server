import { MIMES } from './util/consts'
import type { H3Event } from './event/event'
import type { RouteHandler } from './router'

/** 插件  */
type Layer = RouteHandler | { handler: RouteHandler; [key: string]: any }
/** 插件队列 */
type Stack = Layer[]
/** app */
export type IApp = ReturnType<typeof createApp>

/**
 * Server App实例
 * 只包含处理响应逻辑，其他功能依赖插件系统完成（比如router）
 * // TODO 洋葱模型更好些？
 */
export class App {
    /** 路由队列 */
    stack: Stack = []

    /** 添加插件，这里移除了代码中的支持路由功能，所有功能通过插件实现 */
    use(layer: Layer) {
        this.stack.push(layer)
        return this
    }

    /** 路由处理函数 */
    async handler(event: H3Event) {
        // 遍历stack
        for (const layer of this.stack) {
            // 执行handler
            const handler = typeof layer === 'function' ? layer : layer.handler.bind(layer)
            const body = await handler(event)
            // 响应
            await this.handleHandlerResponse(event, body)
        }
    }

    /** 处理响应 */
    protected handleHandlerResponse(event: H3Event, val: any) {
        const valType = typeof val
        // 返回字符串(text/html)
        if (valType === 'string') {
            return this.send(event, val, MIMES.html)
        }
        // 返回json
        if (valType === 'object') {
            return this.send(event, JSON.stringify(val), MIMES.json)
        }
        // 返回stream
        // 500
        // TODO 错误状态码有点复杂，一会再搞
        // throw new Error('500')
    }

    /** 发送响应数据 */
    protected send(event: H3Event, data?: string, type?: string) {
        if (type) {
            event.node.res.setHeader('Content-Type', type)
        }
        return event.node.res.end(data)
    }
}

/**
 * 创建App实例
 */
export function createApp() {
    const app = new App()
    return app
}
