export default {
  namespaced: true,
  state: {
    loading: true,
    showFlag: false, // 判断是否需要将表单数据用于展示
    basicFormData: {},
    otherFormData: {}
  },

  actions: {
  },

  mutations: {
    changeLoading (state) {
      state.loading = !state.loading
    },
    changeBasicFormData (state, basicFormData) {
      state.basicFormData = basicFormData
    },
    changeOtherFormData (state, otherFormData) {
      state.otherFormData = otherFormData
    },
    changeShowFlag (state) {
      state.showFlag = !state.showFlag
    }
  }
}
