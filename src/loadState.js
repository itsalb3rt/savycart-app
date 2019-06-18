import store from './store';
import { getState } from './storage';

export default function () {
  if (store.initialized) {
    return Promise.resolve();
  }

  return getState()
    .then(state => store.commit('loadFromCache', state));
}