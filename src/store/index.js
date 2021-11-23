import Vue from 'vue'

import Vuex from 'vuex'
import { userStore } from './userStore'
import { memberStore } from './memberStore'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    userStore,
    memberStore
  }
})
