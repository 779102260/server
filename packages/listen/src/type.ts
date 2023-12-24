import { getPort } from '@yangsansuan/get-port-please'

/** listen 配置项 */
export type ListenOptions = {
    port?: Parameters<typeof getPort>[0]
}
