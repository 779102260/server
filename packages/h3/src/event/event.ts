import type { IncomingMessage, ServerResponse } from 'node:http'

export interface NodeEventContext {
    req: IncomingMessage
    res: ServerResponse
}

/** 请求event包装 */
export class H3Event {
    node: NodeEventContext
    /** 上下文，用于共享数据 */
    context: Record<string, any> = {}
    // 响应是否已经处理了，用于防止重复处理
    _handled = false

    constructor(req: IncomingMessage, res: ServerResponse) {
        this.node = { req, res }
    }
    get handled(): boolean {
        return this._handled || this.node.res.writableEnded || this.node.res.headersSent
    }
}
