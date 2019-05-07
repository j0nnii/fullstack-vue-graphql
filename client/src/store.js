import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';

import { defaultClient as apolloClient } from './main';

import {
  ADD_POST,
  GET_POSTS,
  GET_CURRENT_USER,
  SIGNIN_USER,
  SIGNUP_USER
} from './queries';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null)
  },
  actions: {
    getCurrentUser: async ({ commit }) => {
      commit('setLoading', true);
      try {
        const apolloResult = await apolloClient.query({
          query: GET_CURRENT_USER
        });
        const { data } = apolloResult;
        if (data) {
          commit('setUser', data.getCurrentUser);
          console.log(data.getCurrentUser);
        }
      } catch (err) {
        console.error(err);
      }
      commit('setLoading', false);
    },
    getPosts: async function({ commit }) {
      commit('setLoading', true);
      try {
        const apolloResult = await apolloClient.query({
          query: GET_POSTS
        });
        const { data } = apolloResult;
        if (data) {
          commit('setPosts', data.getPosts);
        }
      } catch (err) {
        console.error(err);
      }
      commit('setLoading', false);
    },
    addPost: async function({ commit }, payload) {
      try {
        const apolloResult = await apolloClient.mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            //console.log(cache, data);
            // read the query you want to update
            const data = cache.readQuery({ query: GET_POSTS });
            // create updated data
            data.getPosts.unshift(addPost);
            // write the updated query back to data
            console.log(cache, data);
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              _id: -1,
              ...payload
            }
          }
        });
        const { data } = apolloResult;
        if (data) {
          console.log(data.addPost);
        }
      } catch (err) {
        console.error(err);
      }
    },
    signinUser: async function({ commit }, payload) {
      commit('clearError');
      commit('setLoading', true);
      localStorage.setItem('token', '');
      try {
        const apolloResult = await apolloClient.mutate({
          mutation: SIGNIN_USER,
          variables: payload
        });
        const { data } = apolloResult;
        if (data) {
          localStorage.setItem('token', data.signinUser.token);
          router.go();
        }
      } catch (err) {
        commit('setError', err);
        //console.error(err);
      }
      commit('setLoading', false);
    },
    signupUser: async function({ commit }, payload) {
      commit('clearError');
      commit('setLoading', true);
      try {
        const apolloResult = await apolloClient.mutate({
          mutation: SIGNUP_USER,
          variables: payload
        });
        const { data } = apolloResult;
        if (data) {
          localStorage.setItem('token', data.signupUser.token);
          router.go();
        }
      } catch (err) {
        commit('setError', err);
        //console.error(err);
      }
      commit('setLoading', false);
    },
    signoutUser: async function({ commit }) {
      commit('clearUser');
      localStorage.setItem('token', '');
      await apolloClient.resetStore();
      router.push('/');
    }
    /*getPosts: async () => {
      apolloClient
        .query({
          query: gql`
            query {
              getPosts {
              _id
              title
              imageUrl
              description
              }
            }
          `
        }).then(({ data }) => {
          console.log(data.getPosts);
        })
        .catch(err => {
          console.error(err);
        });
    }*/
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading,
    userFavorites: state => state.user && state.user.favorites,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError
  }
});
