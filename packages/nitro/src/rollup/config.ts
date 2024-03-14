import { merge } from 'lodash-es'
import type { INitro, IRollupConfig } from '../types/nitro'

export function getRollupConfig(nitro: INitro) {
    const { rollupConfig } = nitro.options

    const extractRollupConfig: Partial<IRollupConfig> = {
        input: nitro.options.entry,
        output: {
            // dir:
            format: 'esm',
        },
        plugins: [],
    }
    merge(rollupConfig, extractRollupConfig)

    return rollupConfig
}
