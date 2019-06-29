import localForage from 'localforage';

const store = localForage.createInstance({
  name: 'app',
});

const mapStateForCache = (state) => {
  return {
    'user': state.user,
    initialized: state.initialized,
    isLoged:(state.isLoged == false || state.isLoged == [] )?false : true,
    measurement_units:state.measurement_units,
    itbis:state.itbis,
    categories:state.categories,
    currencies:state.currencies,
    products:state.products
  }
};

export const setState = (state) => {
  const cachedState = mapStateForCache(state);
  return store.setItem('state', cachedState);
};

export const getState = () => store.getItem('state');

export const deleteState = () => store.removeItem('state');