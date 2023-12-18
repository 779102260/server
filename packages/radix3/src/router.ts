import { createRadixNode, getNodeParamNameMatcher, RadixNode, getNodeType, NODE_TYPES } from './radix'

export class Router {
    // 路由规则
    routes: Record<string, any> = {}
    // 静态路由
    staticRoutesMap: Record<string, any> = {}
    // radix树
    rootNode: RadixNode = createRadixNode()

    constructor(routes: Record<string, any>) {
        this.routes = routes
    }

    insert(path: string, data: any) {
        const sections = path.split('/')

        let node = this.rootNode
        let isStatic = true
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
        // data放到最后的叶子节点上，查询时表示终点
        node.data = data
        // 静态路由存储map中，它的优先级更高，匹配速度更快
        if (!isStatic) {
            this.staticRoutesMap[path] = data
        }
    }

    lookup(path: string) {
        /** 优先从静态路由中查找 */
        const staticRoute = this.staticRoutesMap[path]
        if (staticRoute) {
            return staticRoute
        }
        /** radix树查询 */
        const sections = path.split('/')
        let node = this.rootNode
        const dynamicParams: Record<string, string> = {}
        for (const item of sections) {
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
                // dynamicParams[node.paramNameMatcher] = item
            }
        }
        return node.data
    }
    remove(path: string) {}
}

export function createRouter(routes: Record<string, any>) {
    return new Router(routes)
}
