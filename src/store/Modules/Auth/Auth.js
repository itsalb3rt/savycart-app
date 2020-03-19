import httpClient from '@/api/HttpClient'

export default {
    namespaced: true,
    state:{
        isLogged: false,
    },
    actions: {
        login({
            commit
        }, payload) {
            return httpClient.post(`/auth/login`, payload)
        },
        checkIsUserExists({commit},payload){
            return httpClient.get(`/auth/users/${payload.userName}`)
        },
        checkIsEmailExists({commit},payload){
            return httpClient.post(`/auth/emails`,payload)
        },
        register({
            commit
        }, payload) {
            return httpClient.post(`/auth/register`, payload)
        },
        recoveryAccount({
            commit
        }, payload) {
            return httpClient.post(`/auth/recovery`, payload)
        },
        passwordReset({
            commit
        }, payload) {
            return httpClient.post(`/auth/resetPassword`, payload)
        }
    },
    getters:{
        getIsLogged(state){
            return state.isLogged;
        }
    },
    mutations:{
        SET_LOGGED(state,value){
            state.isLogged = value;
        }
    }
}
