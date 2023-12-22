import { IncomingMessage, ServerResponse } from 'node:http'
import { H3Event } from '../event/event'
import type { IApp } from '../app'

/** 包装node的http请求，req和res包装到H3Event */
export function toNodeListener(app: IApp) {
    return async (req: IncomingMessage, res: ServerResponse) => {
        const event = new H3Event(req, res)
        await app.handler(event)
    }
}
