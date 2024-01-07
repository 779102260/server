import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { H3Event } from '../../event/event'

type IOptions = {
    /** 相对目录，默认当前服务目录 */
    dir?: string
}

export function createStatic(options: IOptions = {}) {
    return async (event: H3Event) => {
        // -- 参数处理 --
        const { dir = '' } = options
        const url = event.node.req.url
        if (!url) {
            return
        }

        // -- 读取文件 --
        const fileDir = join(process.cwd(), dir)
        const body = await readFile(join(fileDir, url))
        return body
    }
}
