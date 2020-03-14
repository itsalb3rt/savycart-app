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
        create({commit}, payload){
            return httpClient.post(`/products/products`, payload)
        }
    }
}
