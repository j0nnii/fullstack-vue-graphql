import Vue from 'vue'
import Vuex from 'vuex'

import { defaultClient as apolloClient } from './main';

import { GET_POSTS } from './queries';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    }
  },
  actions: {
    getPosts: async function({ commit }) {
      commit('setLoading', true);
      const apolloResult = await apolloClient
        .query({
          query: GET_POSTS
        });
      const { data, err } = apolloResult;
      if (data) {
        commit('setPosts', data.getPosts);
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
    loading: state => state.loading
  }
})
