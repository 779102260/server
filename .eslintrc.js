module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    extends: ['eslint:recommended', 'google', 'plugin:prettier/recommended'],
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'prettier/prettier': [
            process.env.NODE_ENV === 'production' ? 'off' : 'error',
            {
                tabWidth: 4,
                printWidth: 120,
                endOfLine: 'auto',
                semi: false,
                singleQuote: true,
            },
        ],
        'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 定义但未使用的变量
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 生产时无console语句
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 生产时无debugger关键字
        'prefer-promise-reject-errors': 'off', // reject时必须new Error返回错误信息，有利于代码栈追踪 （增加代码复杂度，非大型项目不需要）
        'valid-jsdoc': 'off', // 注释检查 （由于object中的方法缺少注释插件，很不好修改，暂时这么着）
        'no-invalid-this': 'off', // 禁止 this 关键字在类或类对象之外出现 （有时候是this在函数里被call间接调用）
        'require-jsdoc': 'off', // 禁止 this 关键字在类或类对象之外出现 （有时候是this在函数里被call间接调用）
    },
}
