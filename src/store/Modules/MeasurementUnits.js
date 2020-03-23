import httpClient from '@/api/HttpClient'

export default {
    namespaced: true,
    state:{
        measurementUnits: []
    },
    getters:{
        getAll(state){
            const localMeasurementsUnits = JSON.parse(window.localStorage.getItem('measurementUnits'));
            return (localMeasurementsUnits === null) ? state.measurementUnits : localMeasurementsUnits;
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
            window.localStorage.setItem('measurementUnits', JSON.stringify(state.measurementUnits))
        },
        ADD(state,payload){
            state.measurementUnits.push(payload);
            window.localStorage.setItem('measurementUnits', JSON.stringify(state.measurementUnits))
        },
        REMOVE(state,index){
            state.measurementUnits.splice(index, 1);
            window.localStorage.setItem('measurementUnits', JSON.stringify(state.measurementUnits))
        }
    }
}
