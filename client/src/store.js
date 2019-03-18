import Vue from 'vue'
import Vuex from 'vuex'
import router from './router';

import { defaultClient as apolloClient } from './main';

import { GET_POSTS, GET_CURRENT_USER, SIGNIN_USER } from './queries';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false
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
    }
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
      } catch(err) {
        console.error(err);
      }
      commit('setLoading', false);
    },
    getPosts: async function({ commit }) {
      commit('setLoading', true);
      try {
        const apolloResult = await apolloClient
          .query({
            query: GET_POSTS
          });
        const { data } = apolloResult;
        if (data) {
          commit('setPosts', data.getPosts);
        }
      } catch(err) {
        console.error(err);
      }
      commit('setLoading', false);
    },
    signinUser: async function({ commit }, payload) {

      commit('setLoading', true);
      try {
        const apolloResult = await apolloClient
          .mutate({
            mutation: SIGNIN_USER,
            variables: payload
          });
        const { data } = apolloResult;
        if (data) {
          localStorage.setItem('token', data.signinUser.token);
          router.go();
        }
      } catch(err) {
        console.error(err);
      }
      commit('setLoading', false);
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
    user: state => state.user
  }
})
