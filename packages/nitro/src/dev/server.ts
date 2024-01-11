import { createApp, createStatic, toNodeListener } from '@yangsansuan/h3'
import { listen } from '@yangsansuan/listen'
import type { App } from '@yangsansuan/h3'
import type { INitro, IPublicAssetDir } from '../types/nitro'

/** 创建devServer */
export function createDevServer(nitro: INitro) {
    // -- 创建server --
    const app = createApp()

    // -- 静态资源地址 --
    _loadStaticMiddleware(app, nitro.options.publicAssets)

    // -- proxy --

    // -- 监听端口 --
    const listen = _createListen(app)

    return { listen }
}

function _loadStaticMiddleware(app: App, publicAssets: IPublicAssetDir[]) {
    for (const { dir } of publicAssets) {
        app.use(createStatic({ dir }))
    }
}

function _createListen(app: App) {
    return async (port: number) => {
        const listener = await listen(toNodeListener(app), { port })
        return listener
    }
}
