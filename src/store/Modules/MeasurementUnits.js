import httpClient from '@/api/HttpClient'

export default {
    namespaced: true,
    state:{
        measurementUnits: []
    },
    getters:{
        getAll(state){
            return state.measurementUnits
        }
    },
    actions: {
        getAll({ commit }) {
            return httpClient.get(`/measurementUnits/measurementUnits`)
        },
        create({commit}, payload){
            return httpClient.post(`/measurementUnits/measurementUnits`, payload)
        },
        delete({commit},payload){
            return httpClient.delete(`/measurementUnits/measurementUnits/${payload.id}`)
        }
    },
    mutations:{
        SET(state,payload){
            state.measurementUnits = payload;
        },
        ADD(state,payload){
            state.measurementUnits.push(payload);
        },
        REMOVE(state,index){
            state.measurementUnits.splice(index, 1);
        }
    }
}
