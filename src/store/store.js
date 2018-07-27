import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    deviceAddClose: false,
    deviceEditClose: false,
    deviceEditDelete: false,
    projectListGet: false
  },
  mutations: {
    closeDeviceAdd (state) {  // 新增设备
      state.deviceAddClose = true
    },
    openDeviceAdd (state) {
      state.deviceAddClose = false
    },
    closeDeviceEdit (state) { // 修改设备
      state.deviceEditClose = true
    },
    openDeviceEdit (state) {
      state.deviceEditClose = false
      state.deviceEditDelete = false
    },
    deleteDeviceEdit (state) { // 删除设备
      state.deviceEditDelete = true
    },
    projectGetList (state) { // 查询方案列表
      state.projectListGet = true
    },
    projectHomeToEdit (state) {
      state.projectListGet = false
    }
  },
  actions: {
    actionCloseDeviceAdd ({commit}) {
      commit('closeDeviceAdd')
    },
    actionOpenDeviceAdd ({commit}) {
      commit('openDeviceAdd')
    },
    actionCloseDeviceEdit ({commit}) {
      commit('closeDeviceEdit')
    },
    actionOpenDeviceEdit ({commit}) {
      commit('openDeviceEdit')
    },
    actionDeleteDeviceEdit ({commit}) {
      commit('deviceEditDelete')
    },
    actionProjectGetList ({commit}) {
      commit('projectGetList')
    },
    actionProjectHomeToEdit ({commit}) {
      commit('projectHomeToEdit')
    }
  }
})
export default store