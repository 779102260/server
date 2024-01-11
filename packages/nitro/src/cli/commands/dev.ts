import { defineCommond } from '@yangsansuan/citty'
import { getArgs as getListenArgs } from '@yangsansuan/listen/dist/cli/args'
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

        const start = async () => {
            if (nitro) {
                // TODO close
            }
            // -- 创建nitro实例 --
            nitro = createNitro()
            // -- 启动devServer --
            const server = createDevServer(nitro)
            server.listen(options.port)
            // -- 项目构建（rollup） --
            build(nitro)
        }
        await start()
    },
})
