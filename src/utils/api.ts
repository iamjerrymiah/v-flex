import { AxiosInstance } from 'axios';
import { API_URL } from '../constants/constants';
import openAxios from './axios-setup';
import { parseResError } from './utils';

export const SECHTTP = openAxios(API_URL);

type ResourceType = 'SECURITY'; // add to this
const getHttpResource = (resourceType: ResourceType ) => {
    let HTTP:
        | AxiosInstance
        | ((arg0: {
        method: 'POST' | 'GET' | 'PUT' | 'DELETE';
        url: string;
        data?: {} | undefined;
        headers?: { 'Content-Type': string } | undefined;
    }) => Promise<any>);

    switch (resourceType) {
        case 'SECURITY':
            HTTP = SECHTTP;
            break;
        default:
            HTTP = SECHTTP;
    }
    return HTTP;
}


export const fetcher = async (resourceType: string, url: string) => {

    const HTTP = getHttpResource(<"SECURITY">resourceType);

    return new Promise((resolve, reject) => {
        HTTP({
            method: 'GET',
            url: url,
        }).then((res: any) => {
            return resolve(res.data);
        })
        .catch((err: any) => {
            const error = parseResError(err);
            return reject(error);
        });
    });
};


export const customMutationRequest = async (
    resourceType: ResourceType,
    url: string,
    method: 'POST' | 'PUT' ,
    arg?: {},
    headers?: {},
) => {

    const HTTP = getHttpResource(resourceType);
    const customHeaders = { 'Content-Type': 'application/json', ...headers };
    return new Promise((resolve, reject) => {
        HTTP({
            method: method,
            url: url,
            data: arg,
            headers: customHeaders,
        })
            .then((res: any) => {
                return resolve(res.data);
            })
            .catch((err: any) => {
                const error = parseResError(err);
                return reject(error);
            });
    });
};


export const customFormdataMutationRequest = async (
    resourceType: ResourceType,
    url: string,
    method: 'POST' | 'PUT' ,
    arg: {},
    headers?: {},
) => {

    let formData = new FormData();
    for (const [key, value] of Object.entries(arg)) {
        if (
            (value !== '' &&
                value !== 'null' &&
                value !== 'undefined' &&
                value !== null &&
            value !== undefined)
        ) {
            formData.append(`${key}`, value);
        }
    }

    const HTTP = getHttpResource(resourceType);

    const customHeaders = { ...headers, "Content-Type": "multipart/form-data"};
    return new Promise((resolve, reject) => {
        HTTP({
            method: method,
            url: url,
            data: formData,
            headers: customHeaders,
        })
        .then((res: any) => {
            return resolve(res.data);
        })
        .catch((err: any) => {
            const error = parseResError(err);
            return reject(error);
        })
    });
}


export const deleteRequest = async (resourceType: ResourceType, url: string) => {
    const HTTP = getHttpResource(resourceType);
    const headers = {"Content-Type": "application/json"};
    return new Promise((resolve, reject) => {
        HTTP({
            method: 'DELETE',
            url: url,
            headers: headers,
        }).then((res: any) => {
            return resolve(res.data);
        })
        .catch((err: any) => {
            const error = parseResError(err);
            return reject(error);
        });
    });
};
