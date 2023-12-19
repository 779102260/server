import { createRadixNode, getNodeParamNameMatcher, RadixNode, getNodeType, NODE_TYPES } from './radix'
import { normalizeTrailingSlash } from './util'

export class Router {
    // 路由规则
    routes: Record<string, any> = {}
    // 静态路由
    staticRoutesMap: Record<string, any> = {}
    // radix树
    rootNode: RadixNode = createRadixNode()

    constructor(routes: Record<string, any>) {
        this.routes = routes
        for (const path in routes) {
            if (Object.prototype.toString.call(routes[path]) !== '[object Object]') {
                continue
            }
            this.insert(path, routes[path])
        }
    }

    /** 插入路由 */
    insert(path: string, data: any) {
        /** 参数处理 */
        if (!path || !data) {
            console.error('path or data is empty')
            return
        }
        path = normalizeTrailingSlash(path)

        /** 插入radix tree */
        let node = this.rootNode
        let isStatic = true
        const sections = path.split('/').filter(Boolean)
        for (const item of sections) {
            const childNode = node.children?.get(item)
            /** 已存在 */
            if (childNode) {
                node = childNode
                continue
            }
            /** 新增 */
            const type = getNodeType(item)
            if (type !== NODE_TYPES.NORMAL) {
                isStatic = false
            }
            const paramNameMatcher = getNodeParamNameMatcher(item)
            const newChild = createRadixNode({
                type,
                parent: node,
                paramNameMatcher,
            })
            node.children?.set(item, newChild)
        }
        // data放到最后的叶子节点上
        node.data = data
        // 静态路由存储map中，它的优先级更高，匹配速度更快
        if (isStatic) {
            this.staticRoutesMap[path] = data
        }
    }

    /** 查找路由 */
    lookup(path: string) {
        /** 优先从静态路由中查找 */
        const staticRoute = this.staticRoutesMap[path]
        if (staticRoute) {
            return staticRoute
        }
        /** radix树查询 */
        const sections = path.split('/').filter(Boolean)
        let node = this.rootNode
        let dynamicParams: Record<string, string> = {}
        for (const item of sections) {
            // children的key改成正则吧
            const childNode = node.children?.get(item)
            // 不存在的路由
            if (!childNode) {
                return null
            }
            node = childNode
            // 路由参数
            if (node.type === NODE_TYPES.NORMAL) {
                continue
            }
            if (node.type === NODE_TYPES.MIXED) {
                const params = item.match(node.paramNameMatcher as RegExp)
                dynamicParams = { ...params?.groups, ...dynamicParams }
                continue
            }
            // WILDCARD PLACEHOLDER
            const paramName = node.paramNameMatcher
            dynamicParams[paramName as string] = item
        }

        if (!node.data) {
            console.error('代码有问题')
        }

        return { ...node.data, params: dynamicParams }
    }

    // 需要这个？
    remove(path: string) {}
}

export function createRouter(routes: Record<string, any> = {}) {
    return new Router(routes)
}
