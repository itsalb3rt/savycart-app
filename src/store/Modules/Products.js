import httpClient from '@/api/HttpClient'

export default {
    namespaced: true,
    state: {
        products: [],
        brands: []
    },
    getters: {
        getAll(state) {
            return state.products;
        },
        getBrands(state){
            return state.brands;
        }
    },
    actions: {
        getAll({ commit }) {
            return httpClient.get(`/products/products`)
        },
        getAllBrands({commit}){
            return httpClient.get(`/products/brands`)
        },
        get({ commit }, payload) {
            return httpClient.get(`/products/products/${payload.id}`)
        },
        getPurchaseHistory({commit}, payload){
            return httpClient.get(`/products/products/${payload.id}?include_purchases=true`)
        },
        create({ commit }, payload) {
            return httpClient.post(`/products/products`, payload)
        },
        update({ commit }, payload) {
            return httpClient.patch(`/products/products/${payload.id}`,payload.data)
        },
        delete({ commit }, payload) {
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
        },
        SET_BRANDS(state,payload){
            state.brands = payload;
        }
    }
}
