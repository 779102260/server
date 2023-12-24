import { createError } from 'h3'
import { createResponse, Response } from './plugin/response'
import type { H3Event } from './event/event'
import type { RouteHandler } from './plugin/router'

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
    /** 响应插件 */
    response: Response

    constructor(response?: Response) {
        this.response = response ?? createResponse()
    }

    /** 添加插件，这里移除了代码中的支持路由功能，所有功能通过插件实现 */
    use(layer: Layer) {
        this.stack.push(layer)
        return this
    }

    /** createServer处理函数 */
    async handler(event: H3Event) {
        try {
            // 遍历stack
            for (const layer of this.stack) {
                // 执行handler
                const handler = typeof layer === 'function' ? layer : layer.handler.bind(layer)
                const body = await handler(event)
                if (body) {
                    // 响应
                    await this.response.handler(event, body)
                }
                if (!event.handled) {
                    throw createError({
                        statusCode: 404,
                        statusMessage: `Cannot find any path matching ${event.node.req.url || '/'}.`,
                    })
                }
            }
        } catch (error) {
            this.response.sendError(event, error)
        }
    }
}

/**
 * 创建App实例
 */
export function createApp() {
    const app = new App()
    return app
}
