import * as rollup from 'rollup'
import { getRollupConfig } from './rollup/config'
import type { INitro, IRollupConfig } from './types/nitro'

export async function build(nitro: INitro) {
    // -- 生成rollup配置 --
    const rollupConfig = getRollupConfig(nitro)
    // -- 启动roolup --
    _watch(nitro, rollupConfig)
}

async function _watch(nitro: INitro, rollupConfig: IRollupConfig) {
    async function load() {
        startRollupWatcher(nitro, rollupConfig)
    }
    await load()
}

function startRollupWatcher(nitro: INitro, rollupConfig: IRollupConfig) {
    let start: number
    // 模块已更改时，将重新打包
    const watcher = rollup.watch(rollupConfig)
    watcher.on('event', (e) => {
        switch (e.code) {
            case 'BUNDLE_START': {
                start = Date.now()
                return
            }
            case 'END': {
                console.log(`start used ${Date.now() - start} ms`)
            }
        }
    })
    return watcher
}
