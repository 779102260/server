import type { H3Event } from '../event/event'

/** 发送响应数据 */
export function send(event: H3Event, data?: string, type?: string) {
    if (type) {
        event.node.res.setHeader('Content-Type', type)
    }
    return event.node.res.end(data)
}
