import axios from 'axios'
import { baseURLCred } from '@/store/constant'

const apiClientCred = axios.create({
    baseURL: `${baseURLCred}/api`,
    headers: {
        'Content-type': 'application/json',
        'x-request-from': 'internal'
    }
})

apiClientCred.interceptors.request.use(function (config) {
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    if (username && password) {
        config.auth = {
            username,
            password
        }
    }

    return config
})

export default apiClientCred
