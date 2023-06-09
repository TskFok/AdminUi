import axios from 'axios'

const SendRequest = axios.create({
    baseURL: import.meta.env.VITE_BASIC_API,
    timeout: 12000,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

export default SendRequest