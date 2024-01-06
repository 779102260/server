import { parseArgs } from './util'
import type { ICmd } from './type'

/**
 * 定义命令行
 */
export function defineCommond(config: ICmd) {
    return config
}

/**
 * 运行命令行
 */
export async function runCommond(cmd: ICmd, opts: { rawArgs?: string[] }) {
    let result
    try {
        // -- 找到对应的命令 --
        const { rawArgs } = opts
        const { subCommand, params, options } = parseArgs(cmd, rawArgs)

        // -- 执行命令 --
        const context = {
            cmd,
            options,
            params,
        }
        result = await subCommand.run?.(context)
    } catch (error) {
        console.error(error)
    }

    // -- 执行完毕，执行cleanup钩子 --
    // TODO
    return result
}

/**
 * 运行主命令行
 * @param cmd 命令行
 * @param opts 配置
 * @param opts.rawArgs 原始命令行参数（process.argv），比如二级命令
 */
export function runMain(cmd: ICmd, opts: { rawArgs?: string[] }) {
    // -- 处理入参 --
    const rawArgs = opts.rawArgs || process.argv.slice(2)

    // -- 处理help参数 --
    if (rawArgs.includes('--help') || rawArgs.includes('-h')) {
        // TODO
        return
    }
    // -- 处理version参数 --
    if (rawArgs.includes('--version') || rawArgs.includes('-v')) {
        // TODO
        return
    }

    return runCommond(cmd, { rawArgs })
}
