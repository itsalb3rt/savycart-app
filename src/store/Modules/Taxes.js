import httpClient from '@/api/HttpClient'

export default {
    namespaced: true,
    state:{
        tax: {
            quatity:1
        }
    },
    getters:{
        getAll(state){
            return  state.tax.quatity
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
            state.tax.quatity = payload;
        }
    }
}
