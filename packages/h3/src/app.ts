import { send } from './util/reponse'
import { MIMES } from './util/consts'
import type { H3Event } from './event/event'

/** 路由处理函数 */
type Handler = (event: H3Event) => any
/** 路由配置 */
type Layer = {
    route: string
    handler: Handler
}
/** 路由队列 */
type Stack = Layer[]
/** app */
export type App = ReturnType<typeof createApp>

/**
 * 原理
 * 1. use添加路由到stack
 * 2. handler在请求触发时，遍历stack，匹配后执行pstack.handler
 */
export function createApp() {
    const stack: Stack = []
    const appEventHandler = createAppEventHandler(stack)

    const app = {
        /** 路由队列 */
        stack,
        /** 添加路由 */
        use: (path: string, handler: Handler) => use(app, path, handler),
        /** 处理路由 */
        handler: appEventHandler,
    }
    return app
}

function createAppEventHandler(stack: Stack) {
    /** 匹配路由并执行 */
    return async (event: H3Event) => {
        // 获取path
        const _reqPath = event.node.req.url
        console.log('请求路径', _reqPath)
        // 遍历stack
        for (const layer of stack) {
            if (layer.route !== _reqPath) {
                continue
            }
            // 执行handler
            const body = await layer.handler(event)
            // 响应
            await handleHandlerResponse(event, body)
        }
    }
}
async function handleHandlerResponse(event: H3Event, val: any) {
    const valType = typeof val
    // 返回字符串(text/html)
    if (valType === 'string') {
        return send(event, val, MIMES.html)
    }
    // 返回json
    if (valType === 'object') {
        return send(event, JSON.stringify(val), MIMES.json)
    }
    // 返回stream

    // 500
    // TODO 错误状态码有点复杂，一会再搞
    throw new Error('500')
}

function use(app: App, path: string, handler: Handler) {
    app.stack.push({
        route: path,
        handler,
    })
    return app
}
