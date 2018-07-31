import * as types from '../types';
const state = {
    isLogIn: false,
}

const actions = {
    changeIsLogInStatus: ({ commit }, status) => {
        commit(types.CHANGELOGINSTATUES, status);
    }
}

const getters = {
    getLogInStatus: state => state.isLogIn
}

const mutations = {
    [types.CHANGELOGINSTATUES](state, status) {
        state.isLogIn = status
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}