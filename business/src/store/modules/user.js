// import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { loginGet } from '@/api/api'
import { constantRoutes } from '@/router/index.js'

const state = {
  token: getToken(),
  name: '',
  avatar: '',

  employee_id: '',

  siteInfo: {},                          // 网站基本 信息
  username: '',                          // 用户名
  permmap: {},                           // 权限 map
  vip_level_list: [],                    // vip list
  employee_list: [],                     // 员工 list
  role_list: [],                         // 角色列表
  phone_brand_list: [],                  // 品牌 型号 list
  model_list: [],                        // 型号list
  raw_material_list: [],                 // 材质 list
  theme_list: [],                        // 图库主题分类
  delivery_order_status_list: [],        // 物流单状态列表
  production_order_status_list: [],      // 生产单状态列
  delivery_list: [],                     // 快递公司,

  business_id: '',                       // 商户id
  business_info: {},                     // 商户信息
  buycart_id: ''                         // 购物车id
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
  USER_SET_SITEINFO: (state, siteInfo) => {
    state.siteInfo = siteInfo
    // state.username = siteInfo.username
    state.employee_id = siteInfo.employee_id
    state.permmap = siteInfo.permmap || {}
    state.vip_level_list = siteInfo.vip_level_list || []
    state.employee_list = siteInfo.employee_list || []
    state.role_list = siteInfo.role_list || []
    state.phone_brand_list = siteInfo.phone_brand_list || []
    state.model_list = siteInfo.model_list || []
    state.raw_material_list = siteInfo.raw_material_list || []
    state.theme_list = siteInfo.theme_list || []
    state.delivery_order_status_list = siteInfo.delivery_order_status_list || []
    state.production_order_status_list = siteInfo.production_order_status_list || []

    state.business_info = siteInfo.business_info || {}
    state.username = state.business_info.username
    state.business_id = state.business_info.business_info
    state.buycart_id = siteInfo.buycart_id

    const delivery_list = (siteInfo.delivery_list || []).map(item => {
      item.delivery_str = item.price ? `${item.name}（邮费：${item.price}元）` : `${item.name}（邮费：包邮）`
      return item
    })

    state.delivery_list = delivery_list
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
    return new Promise((resolve, reject) => {
      const data = {
        opr: 'get_home_data'
      }
      loginGet(data).then(resp => {
        console.log('界面初始化数据 res=>', resp)
        if (resp.ret !== 0) {
          reject()
          return
        }

        const siteInfo = resp.data
        const phone_brand_list = siteInfo.phone_brand_list || []

        let model_list = []

        phone_brand_list.forEach(brand => {
          brand.model_list = brand.model_list || []
          model_list = [...model_list, ...brand.model_list]
        })

        siteInfo.model_list = model_list

        commit('USER_SET_SITEINFO', siteInfo)

        // 根据取到的权限 进行处理
        // access存在 并且 permap 中不存在  隐藏
        // access存在 并且 permap存在  并且 permap中check为0 隐藏

        // const permmap = siteInfo.permmap

        // constantRoutes.forEach(router => {
        //   if (router.children) {
        //     router.children.forEach(ch_router => {
        //       if (ch_router.access) {
        //         if (!permmap[ch_router.access]) {
        //           ch_router.hidden = true
        //         } else {
        //           if (!(permmap[ch_router.access].checked)) {
        //             ch_router.hidden = true
        //           } else {
        //             ch_router.hidden = false
        //           }
        //         }
        //       }
        //     })

        //     const hiddenList = router.children.map(ch_router => {
        //       return ch_router.hidden
        //     })

        //     const isAllHidden = hiddenList.every(item => {
        //       return item
        //     })

        //     if (isAllHidden) {
        //       router.hidden = true
        //     } else {
        //       router.hidden = false
        //     }
        //   }
        // })
        resolve()
      })
    })
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

