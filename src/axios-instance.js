import axios from 'axios';

const instance = axios.create({
    baseURL: '/api',
    timeout: 90000
});

export default instance;