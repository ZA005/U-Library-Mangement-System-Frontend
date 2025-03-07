import axios, { AxiosInstance } from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createApiClient = (basePath: string): AxiosInstance => {
    const apiClient = axios.create({
        baseURL: `${API_BASE_URL}/${basePath}`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Add an interceptor to include the token in every request
    apiClient.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    // Add a response interceptor to handle global errors
    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Handle known API errors
                    const status = error.response.status;
                    const data = error.response.data;

                    let errorMessage = `Error ${status}: ${data.message || JSON.stringify(data)}`;

                    if (status === 400) errorMessage = `Bad Request: ${data.message}`;
                    if (status === 401) errorMessage = `Unauthorized: ${data.message}`;
                    if (status === 403) errorMessage = `Forbidden: ${data.message}`;
                    if (status === 404) errorMessage = `Not Found: ${data.message}`;
                    if (status >= 500) errorMessage = `Server Error: ${data.message}`;

                    return Promise.reject(new Error(errorMessage));
                } else if (error.request) {
                    // No response from server
                    return Promise.reject(new Error('No response from server. Please try again later.'));
                } else {
                    // Something else happened
                    return Promise.reject(new Error(error.message));
                }
            } else {
                return Promise.reject(new Error('An unexpected error occurred.'));
            }
        }
    );

    return apiClient;
};
