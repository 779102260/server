import { createError } from 'h3'
import { Router } from '@yangsansuan/radix3'
import type { H3Event } from '../../event/event'

const HttpMethods = ['connect', 'delete', 'get', 'head', 'options', 'post', 'put', 'trace', 'patch'] as const
type IHttpMethods = (typeof HttpMethods)[number]

/** 路由处理函数，H3Event会注入matchedRoute和params */
export type RouteHandler = (event: H3Event) => any
/** 定义一个映射类型，为每个 HTTP 方法创建一个函数类型 */
type HttpMethodFunctions = {
    [Method in IHttpMethods]: (path: string, handler: RouteHandler) => ServerRouter
}

/**
 * ServerRouter类，继承Router类
 * - 扩展get post等方法添加对应method路由
 */
class ServerRouter extends Router implements HttpMethodFunctions {
    connect = (path: string, handler: RouteHandler) => this.add(path, handler, 'connect')
    delete = (path: string, handler: RouteHandler) => this.add(path, handler, 'delete')
    get = (path: string, handler: RouteHandler) => this.add(path, handler, 'get')
    head = (path: string, handler: RouteHandler) => this.add(path, handler, 'head')
    options = (path: string, handler: RouteHandler) => this.add(path, handler, 'options')
    post = (path: string, handler: RouteHandler) => this.add(path, handler, 'post')
    put = (path: string, handler: RouteHandler) => this.add(path, handler, 'put')
    trace = (path: string, handler: RouteHandler) => this.add(path, handler, 'trace')
    patch = (path: string, handler: RouteHandler) => this.add(path, handler, 'patch')

    constructor() {
        super()
    }

    /**
     * 添加路由
     * @param path 路径
     * @param handler 处理函数
     * @param method HTTP 方法
     */
    add(path: string, handler: RouteHandler, method: IHttpMethods | IHttpMethods[] | 'all' = 'all') {
        /** 参数处理 */
        const methods = Array.isArray(method) ? method : [method]

        /** 插入路由 */
        const data: Partial<Record<IHttpMethods | 'all', Function> & { path: string }> = { path }
        methods.forEach((m) => {
            data[m] = handler
        })
        this.insert(path, data)
        return this
    }

    /**
     * 执行路由函数入口
     * @param event
     */
    handler(event: H3Event) {
        const url = event.node.req.url
        const method = event.node.req.method?.toLowerCase() || 'get'

        /** 查找路由 */
        const path = url?.split('?')[0]
        const matched = this.lookup(path!)
        if (!matched) {
            console.error('未匹配到路由')
            return
        }
        const handler = matched[method] ?? matched.get ?? matched.all

        /** 注入上下文 */
        event.context.matchedRoute = matched
        event.context.params = matched.params ?? {}

        /** 执行路由函数 */
        return handler(event)
    }
}

export function createRouter() {
    const router = new ServerRouter()
    return router
}
