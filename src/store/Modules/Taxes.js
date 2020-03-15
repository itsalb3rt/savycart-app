import httpClient from '@/api/HttpClient'

export default {
    namespaced: true,
    state:{
        tax: {}
    },
    getters:{
        getAll(state){
            return state.tax;
        }
    },
    actions: {
        getAll({ commit }) {
            return httpClient.get(`/taxes/taxes`)
        },
        update({commit}, payload){
            return httpClient.patch(`/taxes/taxes`, payload)
        }
    },
    mutations:{
        SET(state,payload){
            state.tax = payload;
        }
    }
}
