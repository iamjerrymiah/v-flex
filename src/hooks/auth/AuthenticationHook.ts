import { QueryObserver, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AuthStateEnum } from "../../utils/types";
import { customMutationRequest, deleteRequest, fetcher, SECHTTP } from "../../utils/api";
import { storeToken } from "../../constants/constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const key = 'auth';

export interface AuthState {
    isAuthenticated: boolean;
    authToken: string | null | undefined;
    userId: string | null | undefined;
    authState: AuthStateEnum;
    user: any | null | undefined | object;
    isLoading: boolean;
    networkFailure: boolean;
};


export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (credentials:any) => {
            queryClient.setQueryData<any>([key], (prevAuth: any) => prevAuth ? {...prevAuth, isLoading: true} : { isLoading: true});

            return customMutationRequest("SECURITY", `/user/login`, 'POST', credentials).then((res:any) => {
                localStorage.setItem('userId', res?.data?.user?._id);
                localStorage.setItem(storeToken, res?.data?.token);
                [SECHTTP].forEach(instance => {
                    instance.defaults.headers.common['Authorization'] = `Bearer ${res?.data?.token}`;
                });
                return res;
            })
        },
        onSuccess: (data) => {
            const auth: AuthState = {
                isAuthenticated: true,
                authToken: data?.data?.token,
                userId: data?.data?.user?._id,
                authState: AuthStateEnum.Authenticated,
                user: {...data?.data?.user, fullName: `${data?.data?.user?.firstName} ${data?.data?.user?.lastName}`},
                isLoading: false,
                networkFailure: false,
            };
            queryClient.setQueryData<AuthState>([key], (prevAuth) => prevAuth ? {...prevAuth, ...auth} : auth);

        },onError: () => {
            localStorage.removeItem('userId');
            localStorage.removeItem(storeToken);
            [SECHTTP].forEach(instance => {
                instance.defaults.headers.common['Authorization'] = '';
            });
            const auth: Partial<AuthState> = {
                isAuthenticated: false,
                authToken: null,
                userId: null,
                authState: AuthStateEnum.Unauthenticated,
                user: null,
            };
            queryClient.setQueryData<AuthState>([key], (prevAuth) => prevAuth ? {...prevAuth, ...auth} : auth as AuthState);
        }
    });
};


export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (credentials:any) => {
            queryClient.setQueryData<any>([key], (prevAuth: any) => prevAuth ? {...prevAuth, isLoading: true} : { isLoading: true});

            return customMutationRequest("SECURITY", `/user`, 'POST', credentials).then((res:any) => {
                localStorage.setItem('userId', res?.data?.user?._id);
                localStorage.setItem(storeToken, res?.data?.token);
                [SECHTTP].forEach(instance => {
                    instance.defaults.headers.common['Authorization'] = `Bearer ${res?.data?.token}`;
                });
                return res;
            })
        },
        onSuccess: (data) => {
            const auth: AuthState = {
                isAuthenticated: true,
                authToken: data?.data?.token,
                userId: data?.data?.user?._id,
                authState: AuthStateEnum.Authenticated,
                user: {...data?.data?.user, fullName: `${data?.data?.user?.firstName} ${data?.data?.user?.lastName}`},
                isLoading: false,
                networkFailure: false,
            };
            queryClient.setQueryData<AuthState>([key], (prevAuth) => prevAuth ? {...prevAuth, ...auth} : auth);

        },onError: () => {
            localStorage.removeItem('userId');
            localStorage.removeItem(storeToken);
            [SECHTTP].forEach(instance => {
                instance.defaults.headers.common['Authorization'] = '';
            });
            const auth: Partial<AuthState> = {
                isAuthenticated: false,
                authToken: null,
                userId: null,
                authState: AuthStateEnum.Unauthenticated,
                user: null,
            };
            queryClient.setQueryData<AuthState>([key], (prevAuth) => prevAuth ? {...prevAuth, ...auth} : auth as AuthState);
        }
    });
};

export const useGetAuthState = () => {

    const queryClient = useQueryClient();
    const [auth, setAuth] = useState<AuthState>(() => {
        return queryClient.getQueryData<AuthState>([key]) ?? {
            isAuthenticated: false,
            authToken: null,
            userId: null,
            authState: AuthStateEnum.Unauthenticated,
            user: null,
            isLoading: false,
            networkFailure: false,
        };
    });

    useEffect(() => {
        const observer = new QueryObserver<AuthState>(queryClient, { queryKey: [key] });

        const unsubscribe = observer.subscribe(result => {
            if (result.data) setAuth(result.data);
        });

        return () => {
            unsubscribe();
        };
    }, [queryClient]);

    return auth;
}



export const useGetAuthUser = (execute: boolean = false) => {
    const queryClient = useQueryClient();
    return useQuery<any, Error>({
        queryKey: [key, 'user'],
        queryFn: async () => {
            queryClient.setQueryData<any>([key], (prevAuth: any) => prevAuth ? {...prevAuth, isLoading: true} : { isLoading: true});
            const res: any = await fetcher('SECURITY', '/user');
            const user: any = {
                ...res,
                fullName: `${res?.data?.firstName} ${res?.data?.lastName}`
            };

            // Update the auth state with the new user data
            queryClient.setQueryData([key, 'user'], user?.data);

            // Update the main auth state
            queryClient.setQueryData<any>([key], (oldData:any) => ({
                ...oldData,
                user: user?.data,
                authToken: localStorage.getItem(storeToken),
                isAuthenticated: true,
                authState: AuthStateEnum.Authenticated,
                userId: user?.data?._id,
                isLoading: false,
            }));

            return user;
        },
        retry: false,
        enabled: execute,
    });
};


export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => {
            return deleteRequest("SECURITY", `/logout`).then((res:any) => {

                localStorage.removeItem('userId')
                localStorage.removeItem(storeToken)
                [SECHTTP].forEach(instance => {
                    instance.defaults.headers.common['Authorization'] = ``;
                });
                return res;
            })
        },
        onSuccess: () => {

            localStorage.removeItem('userId')
            localStorage.removeItem(storeToken)

            [SECHTTP].forEach(instance => {
                instance.defaults.headers.common['Authorization'] = '';
            });

            const auth: Partial<AuthState> = {
                isAuthenticated: false,
                authToken: null,
                userId: null,
                authState: AuthStateEnum.Unauthenticated,
                user: null,
            };
            queryClient.setQueryData<AuthState>([key], (prevAuth) => prevAuth ? {...prevAuth, ...auth} : auth as AuthState);

        },onError: () => {

            localStorage.removeItem('userId')
            localStorage.removeItem(storeToken)

            [SECHTTP].forEach(instance => {
                instance.defaults.headers.common['Authorization'] = '';
            });

            const auth: Partial<AuthState> = {
                isAuthenticated: false,
                authToken: null,
                userId: null,
                authState: AuthStateEnum.Unauthenticated,
                user: null,
            };
            queryClient.setQueryData<AuthState>([key], (prevAuth) => prevAuth ? {...prevAuth, ...auth} : auth as AuthState);

        }
    });
};


export const useVerifyEmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data :any) => {
            return customMutationRequest("SECURITY", `/user/email`, 'POST', data).then((res:any) => res)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key, 'verify-email'] });
        },
    });
};





























// "data": {
//     "user": {
//         "_id": "67c31818e7f6a1ffa33043b9",
//         "salutation": "mr",
//         "firstName": "john",
//         "lastName": "doe",
//         "email": "nwfrgodwin@gmail.com",
//         "phoneNumber": "909009909",
//         "password": "$2b$10$qlFf.ZBRu0XeOoeZXv.LveKLlmqMKQ8cxd9OQH4w20zoqHlilpd0y",
//         "status": "activated",
//         "emailVerified": true,
//         "country": "Nigeria",
//         "verificationCode": 551215,
//         "codeExpDate": "2025-03-02T15:23:31.967Z",
//         "role": "user",
//         "resetToken": "",
//         "addresses": [],
//         "createdAt": "2025-03-01T14:22:16.938Z",
//         "updatedAt": "2025-03-01T14:24:32.039Z",
//         "__v": 0
//     },