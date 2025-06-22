import { useQuery } from '@tanstack/react-query';
import queryString from 'query-string';
import { fetcher } from '../../utils/api';

const key = 'payments-admin';

export const useGetPayments = (params:any) => {
    let queries = !!params ? queryString.stringify(params) : '';
    return useQuery({
        queryKey: [`${key}`, params],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/payment?${queries}`);
            return res;
        }
    });
};

export const useGetPayment = (id:any) => {
    return useQuery({
        queryKey: [`${key}`, id],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/payment/one/${id}`);
            return res;
        },
        enabled: !!id,
    });
};