import { loadConfig, WatchConfigOptions } from 'c12' // TODO 写个c12
import { ICreateNitroConfig, INitroOptions } from './types/nitro'

export interface ILoadConfigOptions {
    watch?: boolean
    c12?: WatchConfigOptions
}

/** 从配置文件读取配置 */
export async function loadOptions(config: ICreateNitroConfig, opts: ILoadConfigOptions) {
    const c12Config = await loadConfig({
        name: 'nitro',
        cwd: config.rootDir,
    })
    return c12Config.config as INitroOptions
}
