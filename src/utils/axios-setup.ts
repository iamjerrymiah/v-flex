import axios from "axios";
import { storeToken } from "../constants/constants";
import { AuthStateEnum } from "./types";
import { queryClient } from "../providers/QueryClientProvider";

function openAxios(baseURL: string) {
    const instance = axios.create({
        baseURL,
        headers: {
            common: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
        },
    })


    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem(storeToken);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {

                localStorage.removeItem(storeToken);
                localStorage.removeItem("v_userId");

                const auth = {
                    isAuthenticated: false,
                    authToken: null,
                    v_userId: null,
                    authState: AuthStateEnum.Unauthenticated,
                    user: null,
                    isLoading: false,
                    networkFailure: false,
                }
                queryClient.setQueryData(['auth'],
                    (prevAuth: object | undefined) => prevAuth ? {...prevAuth, ...auth} : auth
                )
            }
            return Promise.reject(error);
        }
    );
    return instance
};

export default openAxios