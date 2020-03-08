import httpClient from '@/api/HttpClient'

export default {
    namespaced: true,
    actions: {
        login({
            commit
        }, payload) {
            return httpClient.post(`/auth/login`, payload)
        },
        register({
            commit
        }, payload) {
            return httpClient.post(`/auth/register`, payload)
        }
    }
}
