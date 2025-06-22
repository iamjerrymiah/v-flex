import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import queryString from 'query-string';
import { customMutationRequest, deleteRequest, fetcher } from '../../utils/api';

const key = 'users';

export const useGetUserCarts = (params:any) => {
    let queries = !!params ? queryString.stringify(params) : '';
    return useQuery({
        queryKey: [`${key}-carts`, params],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/user/cart?${queries}`);
            return res;
        }
    });
};

export const useAddProductToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customMutationRequest("SECURITY", `/user/cart`, 'POST', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`${key}-carts`] });
        },
    });
};

export const useUpdateCartProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customMutationRequest("SECURITY", `/user/cart`, 'PATCH', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`${key}-carts`] });
        },
    });
};

export const useDeleteCartProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return deleteRequest("SECURITY", `/user/cart`, data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`${key}-carts`] });
        },
    });
};


export const useGetUserWishlists = (params:any) => {
    let queries = !!params ? queryString.stringify(params) : '';
    return useQuery({
        queryKey: [`${key}-wishlist`, params],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/user/wishlist?${queries}`);
            return res;
        }
    });
};

export const useAddProductToWishlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customMutationRequest("SECURITY", `/user/wishlist`, 'POST', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`${key}-wishlist`] });
        },
    });
};

export const useDeleteWishlistProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return deleteRequest("SECURITY", `/user/wishlist`, data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`${key}-wishlist`] });
        },
    });
};


export const useGetAllUsers = (params:any) => {
    let queries = !!params ? queryString.stringify(params) : '';
    return useQuery({
        queryKey: [`${key}-admin`, params],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/user/all?${queries}`);
            return res;
        }
    });
};

export const useGetOneUserByEmail = (email:any) => {
    return useQuery({
        queryKey: [`${key}`, email],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/user/email/${email}`);
            return res;
        },
        enabled: !!email,
    });
};

export const useChangeUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customMutationRequest("SECURITY", `/user/admin`, 'POST', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`${key}-admin`] });
        },
    });
};

export const useActivateDeactivate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customMutationRequest("SECURITY", `/user/status/${data?.id}`, 'PATCH', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`${key}-admin`] });
        },
    });
};