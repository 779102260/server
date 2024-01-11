const args = {
    port: {
        type: 'string',
        description: '端口号',
    },
} as const

type X = typeof args
export type IArgs = {
    [P in keyof X]?: X[P]['type']
}

export function getArgs() {
    return { ...args }
}

export function parseArgs(_args: IArgs & Record<string, any>) {
    const argsExtra: Record<string, any> = {}
    for (const key in _args) {
        if (!(key in args)) {
            continue
        }
        argsExtra[key] = _args[key]
    }
    return argsExtra as IArgs
}
