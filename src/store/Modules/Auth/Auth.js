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
        register({
            commit
        }, payload) {
            return httpClient.post(`/auth/register`, payload)
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
