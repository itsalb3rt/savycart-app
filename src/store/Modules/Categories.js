import httpClient from '@/api/HttpClient'

export default {
    namespaced: true,
    state:{
        categories: []
    },
    getters:{
        getAll(state){
            return state.categories;
        }
    },
    actions: {
        getAll({ commit }) {
            return httpClient.get(`/categories/categories`)
        },
        create({commit}, payload){
            return httpClient.post(`/categories/categories`, payload)
        },
        delete({commit},payload){
            return httpClient.post(`/categories/categories/${payload.id}`)
        }
    },
    mutations:{
        SET(state,payload){
            state.categories = payload;
        },
        ADD(state,payload){
            state.categories.push(payload);
        },
        REMOVE(state,index){
            state.categories.splice(index, 1);
        }
    }
}
