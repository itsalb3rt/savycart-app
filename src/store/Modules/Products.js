import httpClient from '@/api/HttpClient'

export default {
    namespaced: true,
    state: {
        products: []
    },
    getters: {
        getAll(state) {
            const localProducts = JSON.parse(window.localStorage.getItem('products'));
            return (localProducts === null) ? state.products: localProducts;
        }
    },
    actions: {
        getAll({ commit }) {
            return httpClient.get(`/products/products`)
        },
        get({ commit }, payload) {
            return httpClient.get(`/products/products/${payload.id}`)
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
            window.localStorage.setItem('products', JSON.stringify(state.products))
        },
        ADD(state, payload) {
            state.products.push(payload);
            window.localStorage.setItem('products', JSON.stringify(state.products))
        },
        REMOVE(state, index) {
            state.products.splice(index, 1);
            window.localStorage.setItem('products', JSON.stringify(state.products))
        }
    }
}
