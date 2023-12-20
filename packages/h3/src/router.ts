import { Router } from '@yangsansuan/radix3'

const HttpMethods = ['connect', 'delete', 'get', 'head', 'options', 'post', 'put', 'trace', 'patch'] as const
type IHttpMethods = (typeof HttpMethods)[number]

// 定义一个映射类型，为每个 HTTP 方法创建一个函数类型
type HttpMethodFunctions = {
    [Method in IHttpMethods]: (path: string, handler: Function) => void
}

class ServerRouter extends Router implements HttpMethodFunctions {
    constructor(routes: Record<string, any> = {}) {
        super(routes)
        HttpMethods.forEach((method) => {
            this[method] = (path: string, handler: Function) => {
                return this.addRoute(method, path, handler)
            }
        })
    }
    add() {}
    handler() {}
}
