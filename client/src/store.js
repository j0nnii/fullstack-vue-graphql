import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';

import { defaultClient as apolloClient } from './main';

import {
  ADD_POST,
  GET_POSTS,
  GET_USER_POSTS,
  GET_CURRENT_USER,
  SIGNIN_USER,
  SIGNUP_USER,
  SEARCH_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS
} from './queries';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    searchResults: [],
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    clearSearchResults: state => (state.searchResults = []),
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
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit('setUserPosts', data.getUserPosts);
          //console.log(data.getUserPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          //console.log(data.searchPosts);
          commit('setSearchResults', data.searchPosts);
        })
        .catch(err => console.error(err));
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
          },
          // rerun specified queries after performing mutation to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2
              }
            }
          ]
        });
        const { data } = apolloResult;
        if (data) {
          console.log(data.addPost);
        }
      } catch (err) {
        console.error(err);
      }
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.updateUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];
          commit('setUserPosts', userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];
          commit('setUserPosts', userPosts);
        })
        .catch(err => {
          console.error(err);
        });
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
    userPosts: state => state.userPosts,
    searchResults: state => state.searchResults,
    loading: state => state.loading,
    userFavorites: state => state.user && state.user.favorites,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError
  }
});
