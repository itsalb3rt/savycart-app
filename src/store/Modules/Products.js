import httpClient from '@/api/HttpClient'

export default {
    namespaced: true,
    state:{
        products: []
    },
    getters:{
        getProducts(state){
            return state.products;
        }
    },
    actions: {
        getAll({ commit }) {
            return httpClient.get(`/products/products`)
        },
        get({ commit }, payload) {
            return httpClient.get(`/products/products/${payload.id}`)
        },
        create({commit}, payload){
            return httpClient.post(`/products/products`, payload)
        },
        delete({commit}, payload){
            return httpClient.delete(`/products/products/${payload.id}`)
        }
    },
    mutations: {
        SET(state, payload) {
            state.products = payload;
        },
        ADD(state, payload) {
            state.products.push(payload);
        },
        REMOVE(state, index) {
            state.products.splice(index, 1);
        }
    }
}
