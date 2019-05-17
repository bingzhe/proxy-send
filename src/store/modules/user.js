import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { loginGet } from '@/api/api'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  employee_id: '',
  userInfo: {},
  username: '',           // 用户名
  permmap: {},            // 权限 map
  vip_level_list: [],     // vip list
  employee_list: [],      // 员工 list
  role_list: []           // 角色列表
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  USER_SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
    state.username = userInfo.username
    state.permmap = userInfo.permmap
    state.vip_level_list = userInfo.vip_level_list
    state.employee_list = userInfo.employee_list
    state.role_list = userInfo.role_list
  }
}

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  // getInfo(state.token).then(response => {
  //   const { data } = response

  //   if (!data) {
  //     reject('Verification failed, please Login again.')
  //   }

  //   const { name, avatar } = data

  //   commit('SET_NAME', name)
  //   commit('SET_AVATAR', avatar)
  //   resolve(data)
  // }).catch(error => {
  //   reject(error)
  // })
  //   })
  // },

  // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       commit('SET_TOKEN', '')
  //       removeToken()
  //       resetRouter()
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  async getUserInfo({ commit }) {
    const data = {
      opr: 'get_home_data'
    }
    const resp = await loginGet(data)
    console.log('界面初始化数据 res=>', resp)
    if (resp.ret !== 0) return

    const userInfo = resp.data
    commit('USER_SET_USERINFO', userInfo)
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

