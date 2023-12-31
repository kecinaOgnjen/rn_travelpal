import axios from 'axios';

const authAxios  = axios.create({
    baseURL: "http://192.168.10.109:5000/auth",
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
});

const userSettingsAxios = axios.create({
    baseURL: "http://192.168.10.109:5000/userSettings",
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
});

const destinationsAxios = axios.create({
    baseURL: "http://192.168.10.109:5000/destinations",
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
});

export { authAxios, userSettingsAxios, destinationsAxios };
