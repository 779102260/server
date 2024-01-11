import { defineCommond, runMain } from '@yangsansuan/citty'
import dev from './commands/dev'

export const run = (meta: { name: string; description: string; version: string }) => {
    const cmd = defineCommond({
        meta,
        // TODO 支持异步加载命令，这样cli启动快
        subCommands: {
            dev,
        },
    })
    runMain(cmd)
}
