import http from 'node:http'
import { promisify } from 'node:util'
import { getPort } from '@yangsansuan/get-port-please'
import type { ListenOptions } from './type'
import type { RequestListener } from 'node:http'

/** 启动一个服务 */
export async function listen(handler: RequestListener, options?: ListenOptions) {
    // --- Port ---
    const port = await getPort(options?.port)

    // --- Create Server ---
    const server = http.createServer(handler)
    // @ts-ignore
    await promisify<any>(server.listen.bind(server))(port)

    return { server, port }
}
