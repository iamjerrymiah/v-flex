import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import queryString from 'query-string';
import { customMutationRequest, deleteRequest, fetcher } from '../../utils/api';

const key = 'products';

export const useGetProducts = (params:any) => {
    let queries = !!params ? queryString.stringify(params) : '';
    return useQuery({
        queryKey: [key, params],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/product?${queries}`);
            return res;
        }
    });
};

export const useGetProduct = (id: string | null | any) => {
    return useQuery({
        queryKey: [key, id],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/product/one/${id}`);
            return res;
        },
        enabled: !!id,
    });
};

export const useAddProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customMutationRequest("SECURITY", `/product`, 'POST', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customMutationRequest("SECURITY", `/product/${data?.id}`, 'PATCH', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return deleteRequest("SECURITY", `/product/${data?.id}`).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key] });
        },
    });
};