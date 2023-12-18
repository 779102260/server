/** radix tree节点类型 */
export const NODE_TYPES = {
    /** 普通节点 */
    NORMAL: 0 as const,
    /** 泛节点 */
    WILDCARD: 1 as const,
    /** 动态节点 */
    PLACEHOLDER: 2 as const,
    /** 混合节点 */
    MIXED: 3 as const,
}
/**
 * 创建radix树节点
 * @param options
 * @returns
 */
export function createRadixNode(options?: RadixNode): RadixNode {
    return {
        type: options?.type || NODE_TYPES.NORMAL,
        parent: options?.parent,
        children: new Map(),
        /** 路由数据，一般包含路由处理函数handler等 */
        data: options?.data,
        /** 动态参数名称 */
        paramNameMatcher: options?.paramNameMatcher,
    }
}

/** 动态参数匹配正则 */
const PARAMS_RE = /:\w+|[^:]+/g

/**
 * 获取节点类型
 */
export function getNodeType(str: string) {
    if (str.startsWith('**')) {
        return NODE_TYPES.WILDCARD
    }
    const params = [...str.matchAll(PARAMS_RE)].map((i) => i[0])
    if (params.length === 1) {
        return NODE_TYPES.PLACEHOLDER
    }
    if (params.length > 1) {
        return NODE_TYPES.MIXED
    }
    return NODE_TYPES.NORMAL
}

/**
 * 获取动态参数名称
 */
let dynamicParamCount = 0
export function getNodeParamNameMatcher(str: string) {
    const type = getNodeType(str)
    if (type === NODE_TYPES.NORMAL) {
        return undefined
    }
    if (type === NODE_TYPES.WILDCARD) {
        const paramName = str.slice(3) ?? '_'
        return paramName
    }
    if (type === NODE_TYPES.PLACEHOLDER) {
        if (str === '*') {
            dynamicParamCount++
            return `_${dynamicParamCount}`
        }
        const paramName = str.slice(1) ?? '_'
        return paramName
    }
    if (type === NODE_TYPES.MIXED) {
        const sectionRegexString = str.replace(
            /:(\w+)/g,
            (_, id) => `(?<${id}>\\w+)` // 正则命名捕获组，方便后面使用
        )
        return new RegExp(`^${sectionRegexString}$`)
    }
}

/** radix tree节点类型 */
type _NODE_TYPES = typeof NODE_TYPES

/** radix tree节点 */
export type RadixNode = {
    /** radix tree节点类型 */
    type: _NODE_TYPES[keyof _NODE_TYPES]
    /** 父节点 */
    parent?: RadixNode
    /** 子节点 */
    children?: Map<string, RadixNode>
    /** 路由数据，一般包含路由处理函数handler等 */
    data?: { params?: never; [key: string]: any }
    /** 动态参数名称 */
    paramNameMatcher?: string | RegExp
}
