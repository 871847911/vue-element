// 存放各个模块公共的状态
import * as types from '../types';

const state = {

    isSelectStoreVisible: true, // 控制选择店面的弹窗
    storeInfo: {  // 门店的信息，
    },
    title: '技师管理', // 顶部导航的alias

    storeList: [],
    loginInfo: {},
    isLogin: false, // 是否登陆成功
    menuIndex: 0, // 菜单栏的菜单index,控制色块显示
    headMenuIndex: 0,
}

const getters = {
    getStoreInfo: state => state.storeInfo,
    getTitle: state => state.title,
    getStoreList: state => state.storeList,
    getLoginInfo: state => state.loginInfo,
    getIsLogin: state => state.isLogin,
    getMenuIndex: state => state.menuIndex,
    getHeadMenuIndex: state => state.headMenuIndex,
}

const actions = {
    changeSelectStoreVisible: ({ commit }, status) => {
        commit(types.CHANGESELECTSTOREDIALOG, status);
        localStorage.setItem('isSelectStoreVisible', JSON.stringify(status))
    },
    changeStoreInfo: ({ commit }, params) => {
        commit(types.CHANGESTOREINFO, params);
    },
    changeTitle: ({ commit }, params) => {
        commit(types.CHANGETITLE, params)
    },
    changeStoreList: ({ commit }, params) => {
        commit(types.CHANGESTORELIST, params)
    },
    changeLoginInfo: ({ commit }, params) => {
        commit(types.CHANGELOGININFO, params)
    },
    changeIsLogin: ({ commit }, params) => {
        commit(types.CHANGEISLOGIN, params)
    },
    changeMenuIndex: ({ commit }, params) => {
        commit(types.CHANGEMENUINDEX, params)
        localStorage.setItem('menuIndex', params);
    },
    changeHeadMenuIndex: ({ commit }, params) => {
        commit(types.CHANGEHEADMENUINDEX, params)
        sessionStorage.setItem('headMenuIndex', params);
    }
}


const mutations = {
    [types.CHANGESELECTSTOREDIALOG](state, status) {
        state.isSelectStoreVisible = status
    },
    [types.CHANGESTOREINFO](state, params) {
        state.storeInfo = params
    },
    [types.CHANGETITLE](state, params) {
        state.title = params
    },
    [types.CHANGESTORELIST](state, params) {
        state.storeList = params
    },
    [types.CHANGELOGININFO](state, params) {
        state.loginInfo = params
    },
    [types.CHANGEISLOGIN](state, params) {
        state.isLogin = params
    },
    [types.CHANGEMENUINDEX](state, params) {
        state.menuIndex = params
    },
    [types.CHANGEHEADMENUINDEX](state, params) {
        state.headMenuIndex = params
    }
}


export default {
    state,
    getters,
    actions,
    mutations
}
