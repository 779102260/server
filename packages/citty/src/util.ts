import { ICmd } from './type'
import mri from 'mri'

/**
 * 将原始命令行参数（process.argv）解析为子命令和参数
 */
export function parseArgs(cmd: ICmd, rawArgs: string[] = []) {
    // -- 子命令 --
    const { commond: subCommand, args: cmdArgs } = matchSubCommond(cmd, rawArgs)

    // -- 选项 & 参数 --
    const restArgs = rawArgs.slice(cmdArgs.length)
    // 解析选项
    const parseOptions: mri.Options = {
        boolean: [],
        string: [],
        alias: {},
        default: {},
    }
    const argDefine = subCommand.args ?? {}
    // eslint-disable-next-line guard-for-in
    for (const key in argDefine) {
        const { type, alias, default: defaultValue } = argDefine[key]
        if (type === 'positional') {
            continue
        }
        if (type === 'boolean') {
            ;(parseOptions.boolean as string[]).push(key)
        }
        if (type === 'string') {
            ;(parseOptions.string as string[]).push(key)
        }
        if (alias) {
            parseOptions.alias![key] = alias
        }
        if (defaultValue) {
            parseOptions.default![key] = defaultValue
        }
    }
    const { _: params, ...options } = mri(restArgs, parseOptions)

    return { subCommand, params, options }
}

/**
 * 从命令行中获取子命令
 */
export function matchSubCommond(cmd: ICmd, rawArgs?: string[]) {
    // -- 处理参数 --
    if (!cmd) {
        throw new Error('参数异常')
    }
    if (!rawArgs) {
        return { commond: cmd, args: [] }
    }

    // -- 查找命令行 --
    let commond = cmd
    const args = []
    for (const arg of rawArgs) {
        const subCommands = commond.subCommands
        if (arg.startsWith('-') || !subCommands || !subCommands[arg]) {
            break
        }
        args.push(arg)
        commond = subCommands[arg]
    }
    return { commond, args }
}
