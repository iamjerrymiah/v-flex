import { useQuery } from '@tanstack/react-query';
import queryString from 'query-string';
import { fetcher } from '../../utils/api';

const key = 'admin';

export const useGetAllUsers = (params:any) => {
    let queries = !!params ? queryString.stringify(params) : '';
    return useQuery({
        queryKey: [key, 'users', params],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/user?${queries}`);
            return res;
        }
    });
};