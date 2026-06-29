import axios from 'axios'
import { getToken } from './auth'

const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
})

client.interceptors.request.use((config)=> {
    const token = getToken();

    if(token)
        config.headers.Authorization = `Bearer ${token}`

    return config
})

export default client;