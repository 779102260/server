import { isEmpty } from 'lodash-es'
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
        const sections = path.split('/')
        for (const item of sections) {
            const childNode = node.children?.get(item)
            /** 已存在 */
            if (childNode) {
                node = childNode
                continue
            }
            /** 新增 */
            const type = getNodeType(item)
            const paramNameMatcher = getNodeParamNameMatcher(item)
            const newChild = createRadixNode({
                type,
                parent: node,
                paramNameMatcher,
            })
            node.children?.set(item, newChild)
            if (type === NODE_TYPES.WILDCARD) {
                node.wildcardChildNode = newChild
                isStatic = false
            } else if (type === NODE_TYPES.PLACEHOLDER) {
                node.placeholderChildNode = newChild
                isStatic = false
            }
            node = newChild
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
        const sections = path.split('/')
        let node = this.rootNode
        let dynamicParams: Record<string, string> = {}
        for (let i = 0; i < sections.length; i++) {
            const item = sections[i]
            const { wildcardChildNode, placeholderChildNode, children } = node
            // 普通节点
            const childNode = children?.get(item)
            console.log(111, item, childNode)
            if (childNode) {
                node = childNode
                continue
            }
            console.log(222, placeholderChildNode, wildcardChildNode)
            // 子节点是动态节点
            if (placeholderChildNode) {
                node = placeholderChildNode
                if (node.type === NODE_TYPES.PLACEHOLDER) {
                    dynamicParams[node.paramNameMatcher as string] = item
                } else {
                    const params = item.match(node.paramNameMatcher as RegExp)
                    dynamicParams = { ...params?.groups, ...dynamicParams }
                }
                continue
            }
            // 子节点是泛节点：后面不需要再匹配了
            if (wildcardChildNode) {
                node = wildcardChildNode
                dynamicParams[node.paramNameMatcher as string] = sections.slice(i).join('/')
                break
            }

            console.log(333)
            return null
        }

        // 查找的路由是完整路由的一部分
        if (!node.data) {
            return null
        }

        const data: Record<string, any> = { ...node.data }
        if (!isEmpty(dynamicParams)) {
            data.params = dynamicParams
        }
        return data
    }
    // 需要这个？
    remove(path: string) {}
}

export function createRouter(routes: Record<string, any> = {}) {
    return new Router(routes)
}
