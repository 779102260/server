import { IncomingMessage, ServerResponse } from 'node:http'
import { H3Event } from '../event/event'
import type { App } from '../app'

export function toNodeListener(app: App) {
    return async (req: IncomingMessage, res: ServerResponse) => {
        const event = new H3Event(req, res)
        await app.handler(event)
    }
}
