import { defineCommond } from '@yangsansuan/citty'
import { getArgs as getListenArgs } from '@yangsansuan/listen/dist/cli/args'
import path from 'path'
import { createNitro } from '../../nitro'
import { createDevServer } from '../../dev/server'
import { build } from '../../build'

export default defineCommond({
    meta: {
        name: 'dev',
        description: '启动本地开发服务',
    },
    args: {
        ...getListenArgs(),
    },
    async run({ options }) {
        let nitro: any
        /** listen + rollup */
        const start = async () => {
            if (nitro) {
                // TODO close
            }
            // -- 创建nitro实例 --
            nitro = createNitro(
                {
                    rootDir: path.resolve('.'),
                },
                {}
            )
            // -- 启动devServer --
            const server = createDevServer(nitro)
            server.listen(options.port)
            // -- 项目构建（rollup） --
            build(nitro)
        }
        await start()
    },
})
