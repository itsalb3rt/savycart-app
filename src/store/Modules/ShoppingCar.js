
export default {
    namespaced: true,
    state: {
        shoppingCar: []
    },
    getters: {
        getAll(state) {
            const shoppingCard = JSON.parse(window.localStorage.getItem('shoppingCard'));
            return (shoppingCard === null) ? state.shoppingCard : shoppingCard;
        }
    },
    mutations: {
        SET(state, payload) {
            state.shoppingCard = payload;
            window.localStorage.setItem('shoppingCard', JSON.stringify(state.shoppingCar))
        },
        ADD(state, payload){
            
            state.shoppingCar.push(payload);
            window.localStorage.setItem('shoppingCard', JSON.stringify(state.shoppingCar))
        },
        REMOVE(state, payload){
            /**
             * payload is the array index
             */
            state.shoppingCar.splice(payload,1);
            window.localStorage.setItem('shoppingCard', JSON.stringify(state.shoppingCar))
        }
    }
}
