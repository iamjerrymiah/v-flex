import moment from 'moment'

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

export const moneyFormat = (amount: string | number, integer?: boolean) => {
    if (amount === 'NIL') {
        return amount
    } else {
        let newAmount = Number(amount) ? Number(amount) : Number(0)
        return newAmount.toLocaleString(undefined, {minimumFractionDigits: integer ? 0 : 2, maximumFractionDigits: integer ? 0 : 2})
    }
}

export const isSuperUser = (role: any) => {
    switch (role) {
        case "admin":
        case "superAdmin":
        return true;
        default:
        return false;
    }
};

export const isJustSuperAdmin = (role: any) => {
    switch (role) {
        case "superAdmin":
        return true;
        default:
        return false;
    }
}

export const formatNumberToShortForm = (number:number|any) => {
    if (number >= 1_000_000_000_000) {
        return `${(number / 1_000_000_000_000).toFixed(0)}T`; // Trillions
    } else if (number >= 1_000_000_000) {
        return `${(number / 1_000_000_000).toFixed(0)}B`; // Billions
    } else if (number >= 1_000_000) {
        return `${(number / 1_000_000).toFixed(1)}M`; // Millions
    } else if (number >= 1_000) {
        return `${(number / 1_000).toFixed(1)}k`; // Thousands
    }
    return number; // Return as-is for numbers below 1000
};

export function inputDateFormat(date = '') {
    return date ? moment(date).format("YYYY-MM-DD") : '' 
}
export function preferDateFormat(date = '') {
    return date ? moment(date).format("ll") : '' 
}
export function prettyDateFormat(date = '') {
    return date ? moment(date).format("ll") : '' 
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