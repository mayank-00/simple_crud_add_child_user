import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: {},
    users: []
  },
  mutations: {
    setAccount: (state, accountData) => state.account = accountData,
    updateUsers: (state, users) => state.users = users
  },
  actions: {
    setAccountData({ commit }, accountData) {
      commit('setAccount', accountData)
    },
    updateUsersAction({ commit }, users) {
      commit('updateUsers', users)
    },
    deleteASingleUserAction({ commit, state }, id) {
      let users = state.users.filter(user => user.id != id)

      commit('updateUsers', users)
    },
    updateASingleUserAction({ commit, state }, user) {
      let nUsers = state.users.map(u => {
        if (u.id === user.id) {
          return user
        }

        return u
      })

      commit('updateUsers', nUsers)
    },
    resetStore({ commit }) {
      commit('setAccount', {})
      commit('updateUsers', [])
    }
  },
  modules: {
  },
  getters: {

  }
})
