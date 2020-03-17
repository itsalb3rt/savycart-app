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
            const tax = window.localStorage.getItem('tax');
            return (tax === null) ? state.tax.quatity : tax;
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
            window.localStorage.setItem('tax',payload)
        }
    }
}
