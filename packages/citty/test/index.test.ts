import { it, expect } from 'vitest'
import { defineCommond, runMain } from '../src/index'

it('正常运行', async () => {
    // 定义命令
    const cmd = defineCommond({
        meta: {
            name: 'mycli',
            description: '这是个测试命令行',
            version: '1.0.0',
        },
        subCommands: {
            dev: {
                meta: {
                    name: 'dev',
                    description: '开发模式',
                    version: '1.0.0',
                },
                args: {
                    port: {
                        type: 'string',
                        description: '端口号',
                        default: 3000,
                    },
                },
                run(context) {
                    return `${context.options.port}`
                },
            },
        },
    })

    const result = await runMain(cmd, { rawArgs: ['dev', '--port', '3000'] })
    expect(result).toBe('3000')
})
