
export default {
    namespaced: true,
    state: {
        shoppingCar: []
    },
    getters: {
        getAll(state) {
            return state.shoppingCar;
        }
    },
    mutations: {
        SET(state, payload) {
            state.shoppingCar = payload;
        },
        ADD(state, payload){            
            state.shoppingCar.push(payload);
        },
        REMOVE(state, payload){
            /**
             * payload is the array index
             */
            state.shoppingCar.splice(payload,1);
        }
    }
}
