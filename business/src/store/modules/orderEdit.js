import _ from 'lodash'

const state = {
  isEdit: false, // 订单是否在编辑
  editOrderId: '', // 编辑的订单
  editDiyGoodsId: '', // 直接编辑diy商品的id
  editIndexId: '', // 订单中的商品id

  // 收货人信息
  consigneeFrom: {
    person: '', // 收货人名
    phone: '', // 手机号码
    address: '', // 收货地址
    province: '', // 省
    city: '', // 市
    area: '', // 区县
    street: '', // 街道
    // company_name: '',
    remark: '', // 留言
    telephone: '', // 固定电话
    order_id_3rd: '', // 第三平台订单号
    tshop_id: '', // 下单店铺

    delivery_company_name: '', // 物流公司
    warehouse_id: '', // 仓库ID
    warehouse_name: '' // 仓库名称
  },

  remark_img_list: [], // 附图列表

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

  updateEditDiyGoodsId(state, payload) {
    state.editDiyGoodsId = payload
  },

  updateEditIndexId(state, payload) {
    state.editIndexId = payload
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

  updateRemarkImgList(state, payload) {
    state.remark_img_list = _.cloneDeep(payload)
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
  },
  editGoods(state, payload) {
    const index = state.goodsList.findIndex((item) => item.index_id === state.editIndexId)

    console.log('goodsList index_id', index)

    state.goodsList[index].goods_id = payload.goods_id
    state.goodsList[index].ori_user_img = payload.ori_user_img
    state.goodsList[index].preview_img = payload.preview_img
    state.goodsList[index].prune_img = payload.prune_img
    state.goodsList[index].num = payload.num
    state.goodsList[index].goodsSumPrice = payload.goodsSumPrice
    state.goodsList[index].goods_img_url = payload.goods_img_url
    state.goodsList[index].color = payload.color
    state.goodsList[index].goods_info_str = payload.goods_info_str
    state.goodsList[index].left = payload.left
    state.goodsList[index].right = payload.right
    state.goodsList[index].top = payload.top
    state.goodsList[index].bottom = payload.bottom
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
