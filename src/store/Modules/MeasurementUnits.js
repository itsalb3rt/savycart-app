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
            return httpClient.get(`/measurementunits/measurementunits`)
        },
        create({commit}, payload){
            return httpClient.post(`/measurementunits/measurementunits`, payload)
        },
        delete({commit},payload){
            return httpClient.delete(`/measurementunits/measurementunits/${payload.id}`)
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
