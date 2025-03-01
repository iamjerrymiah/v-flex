interface BaseModel {
    id?: number | string;
    [key: string]: any;
}

export interface AuthState {
    isLoading: boolean;
    authState: AuthStateEnum;
    user: User | null;
    isAuthenticated: boolean;
    networkFailure: boolean;
}

export enum AuthStateEnum { 
    Authenticated = 'authenticated', 
    Unauthenticated = 'unauthenticated', 
    Pending = 'pending', 
    Processing = 'processing',
};


export interface Credentials {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface User extends BaseModel {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    isDeleted: boolean;
    fullName?: string;
}