import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
    baseURL, // Sử dụng baseURL từ biến môi trường
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Thêm token nếu có
        const token = localStorage.getItem('token'); // Hoặc cách khác để lấy token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

const Api = {
    get: (url, params) => axiosInstance.get(url, { params }),
    post: (url, data) => axiosInstance.post(url, data),
    put: (url, data) => axiosInstance.put(url, data),
    delete: (url) => axiosInstance.delete(url),
};

export default Api;
