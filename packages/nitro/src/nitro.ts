import type { INitro, ICreateNitroConfig } from './types/nitro'
import type { ILoadConfigOptions } from './options'
import { loadOptions } from './options'

/**
 * 创建nitro
 * 使用对象+函数代替类的形式，好处是清晰，坏处是不能重写（不过可以通过适量的配置和钩子等解决）
 */
export async function createNitro(config: ICreateNitroConfig = {}, opts: ILoadConfigOptions) {
    // -- 解析options --
    const options = await loadOptions(config, opts)

    // -- nitro实例 --
    const nitro: INitro = { options }

    // TODO

    return nitro
}
