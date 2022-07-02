import axios from 'axios'

const httpClient = axios.create({
    baseURL: (process.env.NODE_ENV === 'production') ? process.env.VUE_APP_API_PRO : process.env.VUE_APP_API_DEV,
    headers: {
        'Content-Type': 'application/json'
    }
})

const getAuthToken = () => localStorage.getItem('token')

const authInterceptor = (config) => {
    config.headers['Authorization'] = getAuthToken()
    return config
}

httpClient.interceptors.request.use(authInterceptor)

export default httpClient