import * as types from '../types';

const state = {

    // isSelectStoreVisible: true, // 控制选择店面的弹窗
    // storeInfo: {  // 门店的信息，
    // },
    techInfo: {},// 技师信息
    serverInfo: {}, // 服务信息
}

const getters = {
    // getStoreInfo: state => state.storeInfo,
    getTechInfo: state => state.techInfo,
    getServerInfo: state => state.serverInfo,
}

const actions = {
    // changeSelectStoreVisible: ({ commit }, status) => {
    //     commit(types.CHANGESELECTSTOREDIALOG, status);
    //     localStorage.setItem('isSelectStoreVisible', JSON.stringify(status))
    // },
    // changeStoreInfo: ({ commit }, params) => {
    //     commit(types.CHANGESTOREINFO, params);
    // },
    changeTechInfo: ({ commit }, params) => {
        commit(types.CHANGETECHINFO, params)
    },
    changeServerInfo: ({ commit }, params) => {
        commit(types.CHANGESERVERINFO, params)
    }
}


const mutations = {
    // [types.CHANGESELECTSTOREDIALOG](state, status) {
    //     state.isSelectStoreVisible = status
    // },
    // [types.CHANGESTOREINFO](state, params) {
    //     state.storeInfo = params
    // },
    [types.CHANGETECHINFO](state, params) {
        state.techInfo = params
    },
    [types.CHANGESERVERINFO](state, params) {
        state.serverInfo = params
    }

}


export default {
    state,
    getters,
    actions,
    mutations
}
