import axios from 'axios';
import Cookies from "js-cookie"

const instance = axios.create({
    baseURL: process.env.VUE_APP_SERVER,
    timeout: 5000,
    headers: {
        'Cache-Control': 'no-cache',
        "accept": 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
});

instance.interceptors.request.use(function (config) {

    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (err) {
    return Promise.reject(err);
});

export default instance