import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import operationMC from './modules/operationManageC' // 抽离单独模块的状态

// import state from './state'
Vue.use(Vuex)

export default new Vuex.Store({
    // state,
    modules: {
        user,
        common, // 共同状态
        operationMC,

    }

})