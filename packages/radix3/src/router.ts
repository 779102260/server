import { createRadixNode, NODE_TYPES, RadixNode, getNodeType } from './radix'

export class Router {
    routes: Record<string, any> = {}
    staticRoutesMap: Record<string, any> = {}
    rooutNode: RadixNode = createRadixNode()

    constructor(routes: Record<string, any>) {
        this.routes = routes
    }

    insert(path: string, data: any) {
        const sections = path.split('/')

        let node = this.rooutNode
        for (const item of sections) {
            const childNode = node.children?.get(item)
            /** 已存在 */
            if (childNode) {
                node = childNode
                continue
            }
            /** 新增 */
            const type = getNodeType(item)
            const newChild = createRadixNode({
                type,
                parent: node,
            })
            node.children?.set(item, newChild)
            // 泛类型
            if (type === NODE_TYPES.WILDCARD) {
                // TODO
            }
        }
    }
    lookup(path: string) {}
    remove(path: string) {}
}

export function createRouter(routes: Record<string, any>) {
    return new Router(routes)
}
