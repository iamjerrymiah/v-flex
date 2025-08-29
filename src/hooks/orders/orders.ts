import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import queryString from 'query-string';
import { customMutationRequest, fetcher } from '../../utils/api';

const key = 'orders';

export const useGetUserOrders = (params:any) => {
    let queries = !!params ? queryString.stringify(params) : '';
    return useQuery({
        queryKey: [`${key}`, params],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/order?${queries}`);
            return res;
        }
    });
};

export const useGetOrder = (id: string) => {
    return useQuery({
        queryKey: [`${key}`, id],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/order/${id}`);
            return res;
        },
        enabled: !!id,
    });
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customMutationRequest("SECURITY", `/order`, 'POST', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`${key}`] });
        },
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customMutationRequest("SECURITY", `/order/delivery/status`, 'PATCH', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`${key}-admin`] });
        },
    });
};

export const useGetAllOrders = (params:any) => {
    let queries = !!params ? queryString.stringify(params) : '';
    return useQuery({
        queryKey: [`${key}-admin`, params],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/order/all?${queries}`);
            return res;
        }
    });
};

export const useValidateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customMutationRequest("SECURITY", `/order/validate`, 'POST', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`${key}-pay`] });
        },
    });
};

export const useGetAllCoupons = (params:any) => {
    let queries = !!params ? queryString.stringify(params) : '';
    return useQuery({
        queryKey: [`${key}-coupons`, params],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/order/coupon?${queries}`);
            return res;
        }
    });
};

export const useCreateCoupoun = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customMutationRequest("SECURITY", `/order/coupon`, 'POST', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`${key}-coupons`] });
        },
    });
};


export const usePaymentWithMollie = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customMutationRequest("SECURITY", `/payment/mollie`, 'POST', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`mollie-payment`] });
        },
    });
};

// export const useMollieConfirmPayment = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (data :any) => {
//             return customMutationRequest("SECURITY", `/payment/mollie`, 'PATCH', data).then((res:any) => res)
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: [`payment-mollie`] });
//         },
//     });
// };

export const useMollieConfirmPayment = (id: any) => {
    return useQuery({
        queryKey: [`payment-mollie`, id],
        queryFn: async () => {
            const res: any = await fetcher('SECURITY', `/payment/mollie/${id}`);
            return res;
        },
        enabled: !!id,
    });
};
