import { splitCookiesString, isStream, sendStream, createError, isError } from 'h3'
import { isWebResponse, MIMES } from './util'
import type { Readable } from 'node:stream'
import type { H3Event } from '../../event/event'

type IResponse = { body: any; [key: string]: any }
type IResponseOption = {
    onBeforeResponse?: (Event: H3Event, response: IResponse) => any
    onAfterResponse?: (Event: H3Event, response: IResponse) => any
}

export class Response {
    constructor(public options: IResponseOption = {}) {
        this.options = options
    }
    async handler(event: H3Event, body: any) {
        const { onBeforeResponse, onAfterResponse } = this.options
        const _response: IResponse = { body }
        // 响应前处理
        if (onBeforeResponse) {
            await onBeforeResponse(event, _response)
        }
        // 响应
        this.send(event, _response)
        // 响应后处理
        if (onAfterResponse) {
            await onAfterResponse(event, _response)
        }
    }
    /** 发送响应数据 */
    sendError(event: H3Event, error: any) {
        if (event.handled) {
            return
        }
        const h3Error = isError(error) ? error : createError(error)
        const responseBody = {
            statusCode: h3Error.statusCode,
            statusMessage: h3Error.statusMessage,
            stack: [] as string[],
            data: h3Error.data,
        }

        // TODO 生产不应该打印堆栈？
        responseBody.stack = (h3Error.stack || '').split('\n').map((l) => l.trim())

        if (event.handled) {
            return
        }
        const _code = Number.parseInt(h3Error.statusCode as unknown as string)
        this.setContentType(event, MIMES.json)
        this.setStatus(event, _code, h3Error.statusMessage)
        event.node.res.end(JSON.stringify(responseBody))
    }
    protected send(event: H3Event, response: IResponse) {
        const { body } = response
        // 空值
        if (!body) {
            return this.sendEmpty(event)
        }
        // 转发response
        if (isWebResponse(body)) {
            return this.sendWebRespons(event, body)
        }
        // stream
        if (isStream(body)) {
            return this.sendStream(event, body)
        }
        // buffer
        if (body.buffer) {
            return this.end(event, body)
        }
        // Blob
        if (body.arrayBuffer && typeof body.arrayBuffer === 'function') {
            return this.sendBlob(event, body)
        }
        // Error
        if (body instanceof Error) {
            // TODO Error也研究下
            // 不会造成程序中断吗？
            return createError(body)
        }
        // Node.js Server Response (already handled with res.end())
        if (typeof body.end === 'function') {
            return true
        }
        const bodyType = typeof body
        // 字符串(text/html)
        if (bodyType === 'string') {
            return this.sendString(event, body)
        }
        // json
        if (bodyType === 'object') {
            return this.sendJson(event, body)
        }
        // bigint
        if (bodyType === 'bigint') {
            return this.sendBigint(event, body)
        }
        // 无法处理的数据格式
        // Symbol or Function (undefined is already handled by consumer)
        throw createError({
            statusCode: 500,
            statusMessage: `[h3] Cannot send ${bodyType} as response.`,
        })
    }
    /** 空响应 */
    protected sendEmpty(event: H3Event) {
        event.node.res.writeHead(200).end()
    }
    /** 发送另一个请求的Response */
    protected sendWebRespons(event: H3Event, response: WebResponse) {
        // copy header
        for (const [key, value] of response.headers) {
            // set-cookie存在多个需要特殊处理
            if (key === 'set-cookie') {
                event.node.res.appendHeader(key, splitCookiesString(value))
            } else {
                event.node.res.setHeader(key, value)
            }
        }
        // copy status & statusMessage
        event.node.res.statusCode = response.status
        event.node.res.statusMessage = response.statusText
        // copy 重定向
        if (response.redirected) {
            event.node.res.setHeader('location', response.url)
        }
        // copy body
        const body = response.body
        if (!body) {
            event.node.res.end()
            return
        }
        return this.sendStream(event, response.body)
    }
    /** 发送stream */
    protected sendStream(event: H3Event, stream: Readable | ReadableStream) {
        // TODO 学习下流相关api，这里先不研究了
        return sendStream(event as any, stream)
    }
    /** 发送blob */
    protected sendBlob(event: H3Event, blob: Blob) {
        // TODO Blob格式也研究下
        return blob.arrayBuffer().then((arrayBuffer) => {
            this.setContentType(event, blob.type)
            return this.end(event, Buffer.from(arrayBuffer))
        })
    }
    /** 发送字符串 */
    protected sendString(event: H3Event, str: string) {
        this.setContentType(event, MIMES.html)
        return this.end(event, str)
    }
    /** 发送json */
    protected sendJson(event: H3Event, json: string | Record<string, any>) {
        this.setContentType(event, MIMES.json)
        return this.end(event, typeof json === 'string' ? json : JSON.stringify(json))
    }
    /** 发送bigint */
    protected sendBigint(event: H3Event, bigint: bigint) {
        return this.sendJson(event, bigint.toString())
    }
    /** 设置响应头 */
    protected setHeader(event: H3Event, headers: Record<string, string>) {
        for (const [key, value] of Object.entries(headers)) {
            event.node.res.setHeader(key, value)
        }
    }

    /** 设置content-type */
    protected setContentType(event: H3Event, type: string) {
        if (type && !event.node.res.getHeader('content-type')) {
            event.node.res.setHeader('content-type', type)
        }
    }
    /** 设置status */
    protected setStatus(event: H3Event, statusCode: number = 200, statusMessage?: string) {
        event.node.res.writeHead(statusCode)
        if (statusMessage) {
            event.node.res.statusMessage = statusMessage
        }
    }
    /** 发送响应数据 */
    protected end(event: H3Event, body?: any, statusCode = 200) {
        this.setStatus(event, statusCode)
        event.node.res.end(body)
    }
}

export function createResponse() {
    return new Response()
}
