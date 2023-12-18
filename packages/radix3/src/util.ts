/**
 * 移除末尾的/
 * @param path
 * @returns
 */
export function normalizeTrailingSlash(path: string) {
    return path.replace(/\/$/, '') || '/'
}
