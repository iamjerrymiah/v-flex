import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import queryString from 'query-string';
import { customFormdataMutationRequest, customMutationRequest, deleteRequest, fetcher } from '../../utils/api';

const key = 'products';

export const useGetProducts = (params:any) => {
    let queries = !!params ? queryString.stringify(params) : '';
    return useQuery({
        queryKey: [key, params],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/product?${queries}`);
            return res;
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
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

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customFormdataMutationRequest("SECURITY", `/product`, 'POST', data).then((res:any) => res)
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
            return customMutationRequest("SECURITY", `/product`, 'PATCH', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key] });
        },
    });
};

export const useUpdateProductMainImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customFormdataMutationRequest("SECURITY", `/product/image/${data?.productId}`, 'PATCH', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key] });
        },
    });
};

export const useAddProductImages = (query: any) => {
    let productId = query?.productId ?? ''

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customFormdataMutationRequest("SECURITY", `/product/image/${productId}`, 'POST', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => {
            return deleteRequest("SECURITY", `/product`).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key] });
        },
    });
};