import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://192.168.10.109:5000/auth",
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
});

export default axiosInstance;
