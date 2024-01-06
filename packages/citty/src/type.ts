// -- 命令行 --

/** 命令行名称 */
type IMeta = {
    /** 命名行名称 */
    name?: string
    /** 命令行版本 */
    version?: string
    /** 命令行描述 */
    description?: string
}

/** 命令行参数 */
type IArag = {
    /** 参数类型： positional - 位置参数 */
    type?: 'boolean' | 'string' | 'positional'
    /** 参数描述 */
    description?: string
    /** 值提示 */
    valueHint?: string
    /** 参数别名 */
    alias?: string | string[]
    /** 默认值 */
    default?: any
    /** 是否必填 */
    required?: boolean
}

/** 命令行 */
export type ICmd = {
    /** 命令行名称 */
    meta: IMeta
    /** 命令行参数  */
    args?: Record<string, IArag>
    /** 命令行子命令 */
    subCommands?: Record<string, ICmd>
    /** 执行函数 */
    run?: (params: IRunParams) => any
}
export type IRunParams = {
    cmd: ICmd
    options: Record<string, any>
    params: string[]
}
