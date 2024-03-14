import type { InputOptions, OutputOptions } from 'rollup'
import type { DeepPartial } from './util'

export type INitro = {
    options: INitroOptions
}

export type INitroOptions = {
    /** 前端可以直接访问的静态资源目录(public)，包含scanDirs下面的同名目录 */
    publicAssets: IPublicAssetDir[]

    /** 根目录 */
    rootDir: string

    // -- 构建 --

    /** rollup配置 */
    entry: string
    /** bundle生成目录 */
    output: {
        dir: string
        serverDir: string
        publicDir: string
    }
    rollupConfig: IRollupConfig
}

export type NitroPreset = ICreateNitroConfig | (() => ICreateNitroConfig)

export type ICreateNitroConfig = DeepPartial<INitroOptions> & { extends?: string | string[] | NitroPreset }

export type IPublicAssetDir = { dir: string }

export type IRollupConfig = InputOptions & { output: OutputOptions }
