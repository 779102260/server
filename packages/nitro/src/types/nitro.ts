export type INitro = {
    options: INitroOptions
}

export type INitroOptions = {
    /** 前端可以直接访问的静态资源目录(public)，包含scanDirs下面的同名目录 */
    publicAssets: IPublicAssetDir[]
}

export type IPublicAssetDir = { dir: string }
