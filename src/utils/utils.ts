
export function allCaps(text: string | number) {
    return String(text ?? '').toUpperCase()
}
export function allLower(text: string | number) {
    return String(text ?? '').toLowerCase()
}
export const camelCase = (text: string = '') => {
    return String(text).charAt(0).toLowerCase() + String(text).slice(1)
}
export function capCase(text: string = '', splitter: string = ' ') {
    if (text === '' || text == null || text == 'null') {
        return ''
    }
    let newStr = String(text).split(splitter)
    return newStr.map(e => `${allCaps(e[0])}${allLower(e.slice(1))}`).join(' ')
}

export const parseResError = ( err: any ) => {
    const response = err.response;
    if (typeof response != 'undefined') {
        const statusCode = response.status;
        const data = {
            statusCode,
            status: statusCode,
            statusText: response.statusText,
            message: response.data?.message ? response.data?.message : response?.data?.error || response.statusText,
            error: response?.data?.error || response.statusText,
            errors: response?.data?.errors ,
            hasError: true,
        };

        return data;

    }
    return { hasError: true, statusColor: err.code, message: err.message };
}