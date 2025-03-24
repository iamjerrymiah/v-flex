import queryString from 'query-string';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export function useQueryParams<T>(replace: boolean = false) {
    const router = useNavigate();
    const pathname = useLocation();
    const searchString = useSearchParams().toString();
    const parsedSearch = useMemo(() => queryString.parse(searchString) ?? undefined, [searchString] )
    
    const urlSearchParams = new URLSearchParams(searchString);

    const setQueryParams = (params: Partial<T>) => {
        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null) {
                urlSearchParams.delete(key);
            } else {
                urlSearchParams.set(key, String(value));
            }
        })

        const search = urlSearchParams.toString();
        const query = search ? `?${search}` : '';

        if (replace) {
            router(`${pathname}${query}`);
        } else {
            router(`${pathname}${query}`);
        }
    }

  return { queryParams: parsedSearch, setQueryParams };
}