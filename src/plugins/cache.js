import { setState } from './storage';

const shouldSkipCache = (mutation) => {
  // Your business logic here
};

const plugin = (store) => {
  store.subscribe((mutation, state) => {
    if (!shouldSkipCache(mutation)) {
      setState(state).catch(err => console.warn('failed to cache state', err));
    }
  });
};

export default plugin;