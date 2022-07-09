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

// Add a response interceptor
httpClient.interceptors.response.use(response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
}, function (error) {
    if (error.response.status === 401) {
        window.localStorage.removeItem('token')
        location.reload()
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
})

export default httpClient