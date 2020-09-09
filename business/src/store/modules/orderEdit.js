import _ from 'lodash'

const state = {
  isEdit: false, // 订单是否在编辑
  editOrderId: '', // 编辑的订单

  // 收货人信息
  consigneeFrom: {
    person: '', // 收货人名
    phone: '', // 手机号码
    address: '', // 收货地址
    province: '', // 省
    city: '', // 市
    area: '', // 区县
    street: '', // 街道
    company_name: '',
    remark: '', // 留言
    telephone: '', // 固定电话
    order_id_3rd: '', // 第三平台订单号
    tshop_id: '' // 下单店铺
  },

  // 礼品列表
  attachList: [],

  // 商品列表
  goodsList: []
}

const getters = {}

const mutations = {
  // 更新是否订单在编辑
  updateIsOrderEdit(state, payload) {
    state.isEdit = payload
  },

  updateEditOrderId(state, payload) {
    state.editOrderId = payload
  },

  updateconsigneeFrom(state, payload) {
    _.assign(state.consigneeFrom, payload)
  },

  updateAttachlist(state, payload) {
    state.attachList = _.cloneDeep(payload)
  },

  updateGoodsList(state, payload) {
    state.goodsList = _.cloneDeep(payload)
  },

  goodsListPush(state, payload) {
    state.goodsList.push(payload)
  },

  // payload {goodsId:"", goods:{}}
  goodsListChange(state, payload) {
    let i = -1

    state.goodsList.forEach((goods, index) => {
      if (goods.goods_id === payload.goodsId) {
        i = index
      }
    })

    if (i >= 0) {
      state.goodsList.splice(i, 1, payload.goods)
    }
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
