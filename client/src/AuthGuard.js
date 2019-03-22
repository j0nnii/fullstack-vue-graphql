import store from './store';
export default (to, from, next) => {
  if(!store.getters.user) {
    store.watch(
      (state, getters) => getters.loading,
      (value) => {
        if(!value && store.getters.user) next();
        if(!value && !store.getters.user) next({path: '/signin'});
      }
    );
  } else {
    next();
  }
};
