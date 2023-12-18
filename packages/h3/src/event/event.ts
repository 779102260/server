import type { IncomingMessage, ServerResponse } from 'node:http'

export interface NodeEventContext {
    req: IncomingMessage
    res: ServerResponse
}

/** 请求event包装 */
export class H3Event {
    node: NodeEventContext
    constructor(req: IncomingMessage, res: ServerResponse) {
        this.node = { req, res }
    }
}
