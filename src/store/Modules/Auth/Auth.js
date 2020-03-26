import httpClient from '@/api/HttpClient'

export default {
    namespaced: true,
    state:{
        isLogged: false,
        user: {}
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
        },
        user({commit},payload){
            return httpClient.get(`/users/users/${payload.id}`)
        },
        updateUser({commit},payload){
            return httpClient.patch(`/users/users/${payload.id}`,payload.data)
        }
    },
    getters:{
        getIsLogged(state){
            return state.isLogged;
        },
        getUser(state){
            return state.user;
        }
    },
    mutations:{
        SET_LOGGED(state,value){
            state.isLogged = value;
        },
        SET_USER(state,payload){
            state.user = payload;
        }
    }
}
