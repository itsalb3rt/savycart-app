
export default {
    namespaced: true,
    state: {
        shoppingCar: []
    },
    getters: {
        getAll(state) {
            const localShoppingCar = JSON.parse(window.localStorage.getItem('shoppingCar'));
            return (localShoppingCar === null) ? state.shoppingCar : localShoppingCar;
        }
    },
    mutations: {
        SET(state, payload) {
            state.shoppingCar = payload;
            window.localStorage.setItem('shoppingCar', JSON.stringify(state.shoppingCar));
        },
        ADD(state, payload){            
            state.shoppingCar.push(payload);
            window.localStorage.setItem('shoppingCar', JSON.stringify(state.shoppingCar));
        },
        REMOVE(state, payload){
            /**
             * payload is the array index
             */
            state.shoppingCar.splice(payload,1);
            window.localStorage.setItem('shoppingCar', JSON.stringify(state.shoppingCar));
        }
    }
}
