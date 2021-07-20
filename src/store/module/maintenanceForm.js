export default {
  namespaced: true,
  state: {
    loading: true,
  },

  actions: {
    //
  },

  mutations: {
    changeLoading (state) {
      state.loading = !state.loading
    },
  }
}
