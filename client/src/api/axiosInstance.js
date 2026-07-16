import axios from 'axios';

// Create a configured axios instance
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true, // Important for sending/receiving HttpOnly cookies
});

// Variable to hold the access token in memory
let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

// Request interceptor: attach the access token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401s and refresh tokens
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // Skip refresh logic if it's the login or refresh endpoint itself
            if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh-token')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call refresh-token endpoint. HttpOnly cookie is sent automatically because withCredentials = true
                const res = await axiosInstance.post('/auth/refresh-token');
                
                const newAccessToken = res.data.data.accessToken;
                setAccessToken(newAccessToken);
                
                processQueue(null, newAccessToken);
                
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Refresh token is invalid/expired. 
                // We could dispatch an event here to log the user out in the UI.
                setAccessToken(null);
                window.dispatchEvent(new Event("auth-expired"));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);
