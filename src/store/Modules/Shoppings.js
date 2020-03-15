import httpClient from '@/api/HttpClient'

export default {
    namespaced: true,
    state:{
        shoppings: []
    },
    getters:{
        getAll(state){
            return state.shoppings;
        }
    },
    actions: {
        getAll({ commit }) {
            return httpClient.get(`/shoppings/shoppings`)
        },
        get({ commit }, payload) {
            return httpClient.get(`/shoppings/shoppings/${payload.id}`)
        },
        create({commit}, payload){
            return httpClient.post(`/shoppings/shoppings`, payload)
        },
        delete({commit},payload){
            return httpClient.delete(`/shoppings/shoppings/${payload.id}`)
        }
    },
    mutations:{
        SET(state,payload){
            state.shoppings = payload;
        }
    }
}
