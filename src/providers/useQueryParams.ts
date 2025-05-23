import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import queryString from 'query-string';

export function useQueryParams<T>(replace: boolean = false) {
  const location = useLocation();
  const navigate = useNavigate();

  const parsedSearch = useMemo(() => {
    return queryString.parse(location.search) as Partial<T>;
  }, [location.search]);

  const setQueryParams = (params: Partial<T>) => {
    const currentParams = queryString.parse(location.search);

    const updatedParams = {
      ...currentParams,
      ...params,
    };

    // Remove undefined, null, or empty string params
    Object.keys(updatedParams).forEach((key) => {
      const value = updatedParams[key as keyof typeof updatedParams];
      if (value === undefined || value === null || value === '') {
        delete updatedParams[key as keyof typeof updatedParams];
      }
    });

    const newSearch = queryString.stringify(updatedParams);
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;

    if (replace) {
      navigate(newUrl, { replace: true });
    } else {
      navigate(newUrl);
    }
  };

  return { queryParams: parsedSearch, setQueryParams };
}