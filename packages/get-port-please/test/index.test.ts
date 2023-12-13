import { describe, it, expect } from 'vitest'
import { getPort } from '../index'
import { createServer } from 'node:net'

describe('getPort', () => {
    it('should return default port', async () => {
        const port = await getPort()
        expect(port).toBe(3000)
    })

    it('should return a single port', async () => {
        const port = await getPort(3001)
        expect(port).toBe(3001)
    })

    it('should return the first available port from an array of ports', async () => {
        // 占用3000端口
        const close = await usePort(3000)
        const port = await getPort([3000, 3001, 3002])
        expect(port).toBe(3001)
        close()
    })

    it.only('should return random port', async () => {
        // 占用3000端口
        const close = await usePort(3000)
        const port = await getPort(3000)
        expect(port).toBeTruthy()
        close()
    })
})

function usePort(port: number) {
    return new Promise<any>((resolve) => {
        const server = createServer()
        const close = () => server.close()
        server.listen(port, () => {
            resolve(close)
        })
    })
}
