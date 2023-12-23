export function isWebResponse(data: any) {
    return typeof Response !== 'undefined' && data instanceof Response
}

export const MIMES = {
    html: 'text/html',
    json: 'application/json',
}
