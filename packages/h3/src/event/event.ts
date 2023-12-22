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
    constructor(req: IncomingMessage, res: ServerResponse) {
        this.node = { req, res }
    }
}
