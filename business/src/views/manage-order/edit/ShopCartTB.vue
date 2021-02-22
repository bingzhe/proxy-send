<template>
  <div class="app-container">
    <div class="shopcart-wrapper">
      <div class="goods-wrapper">
        <div class="baseinfo-title-wrapper clearfix">
          <baseinfo-title class="select-shop-title" color="#FB7474" text="已选商品" />
        </div>
        <div class="select-goods-table-wrapper">
          <el-table ref="selectGoodsTable" class="select-goods-table" height="480" border :data="goodsList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column prop="goods_img" align="center" label="图片" width="100">
              <template slot-scope="scope">
                <el-image class="table-img" :src="scope.row.goods_img_url">
                  <div slot="error" class="image-slot">暂无图片</div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="type_str" align="center" label="商品类型" width="100" />
            <el-table-column prop="goods_info_str" align="center" label="材质_品牌_型号_边框_商品编号" min-width="100" />
            <el-table-column prop="num" label="数量" align="center" width="150">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.num" :min="1" size="small" @change="getPrice" />
              </template>
            </el-table-column>
            <el-table-column prop="price" align="center" label="单价" width="100" />
            <el-table-column prop="goodsSumPrice" align="center" label="小计" width="120" />
            <el-table-column prop="opr" label="操作" min-width="50" align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.type === GOODS_TYPE.DIY" type="text" @click="handleGoodsEditClick(scope)">编辑</el-button>
                <el-button class="del-btn" type="text" @click="delShopcart(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="gifs-wrapper">
        <div class="baseinfo-title-wrapper">
          <baseinfo-title color="#74BAFB" text="配送礼品" />
        </div>
        <div class="gifs-form-wrapper clearfix">
          <div v-for="(item, index) in attachList" :key="index" class="gifs-item">
            <span class="gifs-label">{{ item.goods_name }}</span>
            <el-input-number v-model="item.num" controls-position="right" :min="0" @change="getPrice" />
            <span class="gifs-price">（&yen; {{ item.price }}）</span>
          </div>
        </div>
      </div>
      <div class="goodslist-wrapper">
        <div class="baseinfo-title-wrapper">
          <baseinfo-title color="#FB7474" text="商品列表" />
        </div>
        <div>
          <ShopcartGoodslist @goodslist-norm-select-suc="handleNormalSelect" @goodslist-diy-select-suc="handleDiySelect" />
        </div>
      </div>
      <div class="consignee-wrapper">
        <div class="baseinfo-title-wrapper">
          <baseinfo-title color="#FBBD74" text="配送信息" />
        </div>
        <div class="consignee-form-wrapper">
          <el-form ref="consigneeFrom" :model="consigneeFrom" :rules="consigeneeFromRules" :inline="true" label-width="80px">
            <el-form-item label="仓库" prop="warehouse_id" label-width="130px">
              <el-select v-model="consigneeFrom.warehouse_id" placeholder="请选择" filterable @change="handleWarehouseChange">
                <el-option v-for="(item, index) in warehouseList" :key="index" :label="item.warehouse_name" :value="item.warehouse_id" />
              </el-select>
            </el-form-item>
            <el-form-item label="物流" prop="delivery_company_name" label-width="110px">
              <el-select v-model="consigneeFrom.delivery_company_name" placeholder="请选择" filterable @change="getPrice">
                <el-option v-for="(item, index) in deliveryCompanyList" :key="index" :label="item.company_name" :value="item.company_name" />
              </el-select>
            </el-form-item>
            <el-form-item label="下单店铺" prop="tshop_id" label-width="130px">
              <el-select v-model="consigneeFrom.tshop_id" class="full-width" placeholder="请选择" @change="getPrice">
                <el-option v-for="(item, index) in tshopList" :key="index" :label="item.tshop_name" :value="item.tshop_id" />
              </el-select>
            </el-form-item>
            <br />
            <el-form-item label="收件人" prop="person" label-width="130px">
              <el-input v-model.trim="consigneeFrom.person" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="联系电话" prop="phone" label-width="110px">
              <el-input v-model.trim="consigneeFrom.phone" placeholder="请输入" />
            </el-form-item>
            <br />
            <el-form-item label="第三方平台订单号" prop="order_id_3rd" label-width="130px">
              <el-input v-model.trim="consigneeFrom.order_id_3rd" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="固定电话" prop="telephone" label-width="110px">
              <el-input v-model.trim="consigneeFrom.telephone" placeholder="请输入" />
            </el-form-item>
            <br />
            <el-form-item label="省/直辖市" prop="province" label-width="130px">
              <el-input v-model.trim="consigneeFrom.province" v-trim="consigneeFrom.province" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="市" prop="city" label-width="110px">
              <el-input v-model.trim="consigneeFrom.city" v-trim="consigneeFrom.city" placeholder="请输入" @change="getPrice" />
            </el-form-item>
            <br />
            <el-form-item label="区/县" prop="area" label-width="130px">
              <el-input v-model.trim="consigneeFrom.area" v-trim="consigneeFrom.area" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="乡/镇/街道" prop="street" label-width="110px">
              <el-input v-model.trim="consigneeFrom.street" v-trim="consigneeFrom.street" placeholder="请输入" />
            </el-form-item>
            <br />
            <el-form-item class="address" label="收货人详细地址" prop="address" label-width="130px">
              <el-input v-model.trim="consigneeFrom.address" v-trim="consigneeFrom.address" type="textarea" placeholder="请输入" />
              <div class="gray-tip">* 自动拆解不正确时请手工填写以下信息</div>
              <el-button :disabled="!consigneeFrom.address" class="split-btn" type="primary" @click="autoSplit">自动拆解</el-button>
            </el-form-item>
            <br />
            <el-form-item label="留言" prop="remark" label-width="130px">
              <el-input v-model.trim="consigneeFrom.remark" type="textarea" placeholder="请输入" maxlength="150" show-word-limit />
            </el-form-item>
            <el-form-item label="附图" prop="remark_img_list" label-width="130px">
              <div class="remark-img-wrapper">
                <div v-for="(item, index) in remarkImgPreviewList" :key="index" class="remark-img-item">
                  <img :src="item" @click="handleRemarkImgClick(item)" />
                  <i class="el-icon-error" @click="handleRemarkImgRemoveClick(index)"></i>
                </div>
              </div>
              <sl-upload class="outline-uploader" :type="8" @on-success="handleUploadSuccess">
                <i class="el-icon-plus avatar-uploader-icon" />
              </sl-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="order-price-calc">
        <span>已选择</span>
        <span class="goods-total">{{ total }}</span>
        <span>件商品，总计：¥{{ goods_fee }} 元，优惠：¥{{ discount_fee }} 元，实付：</span>
        <span class="actual-fee">¥{{ actual_fee }}</span>
        <el-button type="primary" @click="handlerSaveOrderClick">下单</el-button>
      </div>
    </div>

    <el-dialog class="preview-pic-wrapper" :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" alt />
    </el-dialog>

    <DialogDesigner ref="dialogDesinger" :designerGoods="designerGoods" @diy-edit-suc="handleDiyEditSuc" @dialog-designer-close="handleDesignerClose" />
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import SlUpload from '@/components/upload/index'
import { orderGet, orderSave, tshopGet, warehouseGet } from '@/api/api'
import { mapState } from 'vuex'
import { ORDER_STATUS } from '@/config/cfg'
import DialogDesigner from '../../manage-goods/shopcart/DialogDesigner'
import ShopcartGoodslist from './ShopcartGoodslist'

export const GOODS_TYPE = {
  DIY: 1,
  NORM: 2,
  GIFT: 3,

  code: {
    1: 'DIY',
    2: '标品',
    3: '礼品'
  },

  toString: function (code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}

export default {
  components: {
    BaseinfoTitle,
    SlUpload,
    DialogDesigner,
    ShopcartGoodslist
  },
  data() {
    return {
      token: window.Store.GetGlobalData('token'),

      order_id: '',
      /**
       * 审核未通过，淘宝过来的订单通过状态进行区别
       */
      order_status: '',
      ORDER_STATUS,

      goodsList: [],
      attachList: [],
      //   收货人信息
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
        tshop_id: '', // 下单店铺

        delivery_company_name: '', // 物流公司
        warehouse_id: '', // 仓库ID
        warehouse_name: '' // 仓库名称
      },
      remark_img_list: [],
      multipleSelection: [],

      consigeneeFromRules: {
        person: [{ required: true, message: '请输入收件人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
        city: [{ required: true, message: '请输入市区', trigger: 'blur' }],
        // area: [{ required: true, message: '请输入区县', trigger: 'blur' }],
        // street: [{ required: true, message: '请输入街道/镇', trigger: 'blur' }],
        company_name: [{ required: true, message: '请选择快递公司', trigger: 'change' }]
        // warehouse_id: [{ required: true, message: '请选择仓库', trigger: 'blur' }],
        // delivery_company_name: [{ required: true, message: '请选择物流', trigger: 'blur' }]
      },

      goods_fee: 0.0, // 商品合计费用
      discount_fee: 0.0, // 折扣金额
      actual_fee: 0.0, // 实付金额

      tshopList: [],

      // 图片预览
      dialogImageUrl: '',
      dialogVisible: false,

      GOODS_TYPE,

      warehouseList: [], // 店铺下仓库列表
      deliveryCompanyList: [], // 仓库下可以发货物流公司的列表

      designerGoods: {}, // 设计器正在处理的商品
      shopCartGoodsIndex: 0 // 购物车商品下标
    }
  },
  computed: {
    ...mapState({
      delivery_list: (state) => state.user.delivery_list,
      business_info: (state) => state.user.business_info
    }),
    total() {
      let total = 0
      this.goodsList.forEach((goods) => {
        total += goods.num
      })
      return total
    },
    business_id() {
      return (this.business_info || {}).business_id
    },
    remarkImgPreviewList() {
      return this.remark_img_list.map((img) => {
        return `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=8&img_name=${img}`
      })
    }
  },
  watch: {
    goodsList: {
      handler: function (val) {
        this.goodsList.forEach((item) => {
          item.goodsSumPrice = item.num * item.price
        })
      },
      deep: true
    }
  },
  async mounted() {
    this.order_id = this.$route.params.order_id
    if (this.order_id) {
      await this.getOrderinfo()

      // 选中所有商品
      setTimeout(() => {
        this.$refs.selectGoodsTable.toggleAllSelection()
      }, 500)
    }
    this.getTshopList()
    this.getWarehouseMenu()

    window.addEventListener('beforeunload', this.handleBeforeunload, false)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeunload, false)
  },
  methods: {
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.getPrice()
    },
    async getOrderinfo() {
      const data = {
        opr: 'get_order_info',
        order_id: this.order_id
      }

      // console.log('订单详情 req=>', data)
      const resp = await orderGet(data)
      // console.log('订单详情 res=>', resp)

      if (resp.ret !== 0) return

      const info = resp.data.info
      const consignee_info = info.consignee_info || {}
      this.attachList = info.attach_list || []

      this.goodsList = (info.goods_list || []).map((item) => {
        item.goods_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&width=35&height=70&type=7&img_name=${item.goods_img}`

        item.type_str = GOODS_TYPE.toString(item.type)
        item.goods_info_str = `${item.raw_material}_${item.brand_txt}_${item.model_txt}_${item.color}_${item.goods_id}`
        item.goodsSumPrice = item.num * item.price

        return item
      })

      this.consigneeFrom.person = consignee_info.person
      this.consigneeFrom.phone = consignee_info.phone
      this.consigneeFrom.address = consignee_info.address || ''
      this.consigneeFrom.province = consignee_info.province
      this.consigneeFrom.city = consignee_info.city
      this.consigneeFrom.area = consignee_info.area
      this.consigneeFrom.street = consignee_info.street
      // this.consigneeFrom.company_name = (info.delivery_info || {}).company_name

      this.consigneeFrom.delivery_company_name = (info.delivery_info || {}).company_name
      this.consigneeFrom.warehouse_id = (info.delivery_info || {}).warehouse_id

      this.consigneeFrom.company_name = ''
      this.consigneeFrom.remark = info.remark || ''
      this.consigneeFrom.telephone = consignee_info.telephone
      this.consigneeFrom.order_id_3rd = consignee_info.order_id_3rd

      this.consigneeFrom.tshop_id = info.tshop_id
      this.remark_img_list = info.remark_img_list || []

      this.goods_fee = info.goods_fee
      this.discount_fee = info.discount_fee
      this.actual_fee = info.actual_fee

      this.order_status = info.order_status

      this.consigneeFrom.warehouse_id = info.warehouse_id
      this.consigneeFrom.delivery_company_name = info.delivery_company_name
    },
    async autoSplit() {
      const data = {
        opr: 'order_address_parse',
        address: this.consigneeFrom.address // 订单详细地址
      }

      const resp = await orderGet(data)
      if (resp.ret !== 0) return

      const info = resp.data || {}
      this.consigneeFrom.address = info.address
      this.consigneeFrom.province = info.province
      this.consigneeFrom.city = info.city
      this.consigneeFrom.area = info.area
      this.consigneeFrom.street = info.street
      if (!this.consigneeFrom.person) {
        this.consigneeFrom.person = info.person
      }
      if (!this.consigneeFrom.telephone) {
        this.consigneeFrom.telephone = info.telephone
      }
    },
    async getPrice() {
      // 只计算选中的 multipleSelection
      const goods_list = this.multipleSelection.map((goods) => {
        return {
          goods_id: goods.goods_id,
          color: goods.color,
          num: goods.num,
          index_id: goods.index_id
        }
      })

      const attach_list = this.attachList.map((attach) => {
        return {
          goods_id: attach.goods_id,
          num: attach.num
        }
      })

      const data = {
        opr: 'cal_order_fee',
        goods_list: goods_list,
        attach_list: attach_list,
        delivery_company_name: this.consigneeFrom.delivery_company_name,
        warehouse_id: this.consigneeFrom.warehouse_id,
        warehouse_name: this.consigneeFrom.warehouse_name,
        tshop_id: this.consigneeFrom.tshop_id, // 淘宝店id（即当前订单的来源，一般是从旺店通同步过来的订单，如果是直接从商户端下单，则为空）
        order_id: this.order_id, // 订单id [可为空]
        consignee_city: this.consigneeFrom.city // 订单收货城市 [必填]
      }

      console.log('计算订单费用 req=>', data)
      const resp = await orderGet(data)
      // console.log('计算订单费用 res=>', resp)

      // <<<<<<<<<<<<<<<<<<<<<<<<<<
      if (resp.ret !== 0) return

      const feeInfo = resp.data || {}
      this.goods_fee = feeInfo.goods_fee
      this.discount_fee = feeInfo.discount_fee
      this.actual_fee = feeInfo.actual_fee
    },
    delShopcart(index) {
      /**
       * 目前删除只是前段页面删除，
       */
      const row = this.goodsList[index]
      if (this.multipleSelection.indexOf(row) >= 0) {
        this.$refs.selectGoodsTable.toggleRowSelection(row)
      }
      this.goodsList.splice(index, 1)
    },
    /**
     * 订单中商品编辑淘宝订单直接补在后面
     *
     * ---- 2020.9.27
     * 编辑商品直接进diy商品页面,goodsList后面
     *
     * ---- 2021.2.21
     * 编辑商品修改为在当前页面编辑
     * TODO
     */
    handleGoodsEditClick(scope) {
      console.log(scope)
      this.designerGoods = scope.row
      this.shopCartGoodsIndex = scope.$index
      this.$refs.dialogDesinger.show()
    },
    handlerSaveOrderClick() {
      if (this.multipleSelection.length === 0) {
        this.$slnotify({ message: '您还没有选择任何商品' })
      }
      this.$refs.consigneeFrom.validate((valid) => {
        if (valid && this.multipleSelection.length !== 0) {
          this.saveOrderOpr()
        }
      })
    },
    async saveOrderOpr() {
      const goods_list = this.multipleSelection.map((goods) => {
        return {
          goods_id: goods.goods_id,
          index_id: goods.index_id || '',
          color: goods.color,
          num: goods.num,
          preview_img: goods.preview_img || '', // 经过设计器修整后的用户图（且和轮廓图合并后的图）（预览图）
          prune_img: goods.prune_img || '', // 经过设计器修整后的用户图（已缩放、旋转，但不包含轮廓）
          ori_user_img: goods.ori_user_img || '' // 用户上传的未经处理的原图
        }
      })

      const attach_list = this.attachList.map((attach) => {
        return {
          goods_id: attach.goods_id,
          num: attach.num
        }
      })

      const consignee_info = {
        person: this.consigneeFrom.person, // 收货人名
        phone: this.consigneeFrom.phone, // 手机号码
        telephone: this.consigneeFrom.telephone, // 固定电话
        province: this.consigneeFrom.province, // 省
        city: this.consigneeFrom.city, // 市
        area: this.consigneeFrom.area, // 区县
        street: this.consigneeFrom.street,
        address: this.consigneeFrom.address,
        order_id_3rd: this.consigneeFrom.order_id_3rd
      }
      // consignee_info.address = `${consignee_info.province}${consignee_info.city}${consignee_info.area}${consignee_info.street}`

      const data = {
        opr: 'save_order', // 由后把购物车中商品转为订单
        order_id: this.order_id,
        goods_list,
        attach_list,
        consignee_info,
        delivery_company_name: this.consigneeFrom.delivery_company_name,
        warehouse_id: this.consigneeFrom.warehouse_id,
        warehouse_name: this.consigneeFrom.warehouse_name,
        remark: this.consigneeFrom.remark,
        tshop_id: this.consigneeFrom.tshop_id,
        remark_img_list: this.remark_img_list
      }

      console.log('购物车下单 req=>', data)
      const resp = await orderSave(data)
      console.log('购物车下单 req=>', resp)

      if (resp.ret !== 0) return

      this.$slnotify({ message: '下单成功' })

      //  更新页面全局数据
      this.$store.dispatch('user/getUserInfo')

      setTimeout(() => {
        // this.$router.go(-1)
        this.$router.push('/manage-order/list')
      }, 2000)
    },
    async getTshopList() {
      const data = {
        opr: 'get_tshop_list',
        business_id: this.business_id // 商户账户ID
      }

      const resp = await tshopGet(data)
      console.log('商户淘宝店铺列表 res=>', resp)
      if (resp.ret !== 0) return

      this.tshopList = resp.data.list || []
    },
    handleRemarkImgClick(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    handleRemarkImgRemoveClick(i) {
      this.remark_img_list.splice(i, 1)
    },
    handleUploadSuccess({ img_name }) {
      this.remark_img_list.push(img_name)
    },
    handleBeforeunload(e) {
      if (e) {
        e.returnValue = '关闭提示'
      }
      return '关闭提示'
    },
    async getWarehouseMenu() {
      const data = {
        opr: 'get_warehouse_menu',
        business_id: this.business_id // 商户ID
      }

      console.log('商户仓库列表 req=>', data)
      const resp = await warehouseGet(data)
      console.log('商户仓库列表 res=>', resp)

      if (resp.ret !== 0) return
      this.warehouseList = resp.data.list || []

      if (this.consigneeFrom.warehouse_id) {
        this.warehouseList.forEach((item) => {
          if (item.warehouse_id === this.consigneeFrom.warehouse_id) {
            this.consigneeFrom.warehouse_name = item.warehouse_name
            this.deliveryCompanyList = item.delivery_company_list || []
          }
        })
      }
    },
    handleWarehouseChange(warehouse_id) {
      this.consigneeFrom.delivery_company_name = ''
      this.warehouseList.forEach((item) => {
        if (item.warehouse_id === warehouse_id) {
          this.consigneeFrom.warehouse_name = item.warehouse_name
          this.deliveryCompanyList = item.delivery_company_list || []
        }
      })
      this.getPrice()
    },
    handleDesignerClose() {
      this.designerGoods = {}
      this.shopCartGoodsIndex = 0
    },
    handleDiyEditSuc(updateData) {
      const i = this.shopCartGoodsIndex

      console.log('编辑更新的数据', updateData)
      this.goodsList[i].ori_user_img = updateData.ori_user_img
      this.goodsList[i].preview_img = updateData.preview_img
      this.goodsList[i].prune_img = updateData.prune_img
      this.goodsList[i].color = updateData.color
      this.goodsList[i].goods_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&width=35&height=70&type=7&img_name=${updateData.preview_img}`

      // /**
      //  * 后台更新一下
      //  */
      // this.getPriceSave()
    },
    handleNormalSelect(row) {
      console.log('normal选购', row)
      const img = (row.opt_color_list[0] || {}).color_img

      row.num = 1
      row.goods_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&width=35&height=70&type=7&img_name=${img}`
      row.type_str = GOODS_TYPE.toString(row.type)
      row.goods_info_str = `${row.raw_material}_${row.brand_txt}_${row.model_txt}_${row.color}_${row.goods_id}`
      row.goodsSumPrice = row.num * row.price
      // 前端页面假更新
      this.goodsList.push(row)
    },
    handleDiySelect(row) {
      console.log('diy选购', row)
      row.num = 1
      // row.goods_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&width=35&height=70&type=7&img_name=${img}`
      row.type_str = GOODS_TYPE.toString(row.type)
      row.goods_info_str = `${row.raw_material}_${row.brand_txt}_${row.model_txt}_${row.color}_${row.goods_id}`
      row.goodsSumPrice = row.num * row.price
      // 前端页面假更新
      this.goodsList.push(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  min-height: 700px;
  // min-width: 1090px;
  overflow: auto;
}
.baseinfo-title-wrapper {
  padding: 24px 140px 24px 90px;
}
.select-shop-title {
  float: left;
  line-height: 34px;
}
.el-button.continue-shop {
  font-size: 16px;
  float: right;
  padding: 8px 12px;
}

.select-goods-table-wrapper {
  margin: 0 140px;
  .table-img {
    height: 70px;
    width: 35px;
  }
  /deep/ .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
}
.gifs-form-wrapper {
  margin: 0 140px;
  overflow-y: auto;
  max-height: 114px;

  .gifs-item {
    float: left;
    margin-bottom: 20px;

    .gifs-label {
      display: inline-block;
      min-width: 100px;
      text-align: right;
      vertical-align: middle;
      font-size: 14px;
      color: #606266;
      line-height: 38px;
      padding: 0 8px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    .gifs-price {
      font-size: 14px;
      color: #606266;
    }
  }
  .el-input-number {
    width: 130px;
  }
}

.select-goods-table-wrapper {
  /deep/ .select-goods-table {
    .del-btn {
      color: #fd7474;
    }
    td {
      padding: 4px 0;
    }
    thead {
      tr {
        background: rgba(245, 248, 251, 1);
        th {
          background: none;
        }
      }
    }
    &.el-table--border th,
    &.el-table--border td {
      border-right: none;
    }
    .el-table__header-wrapper {
      box-shadow: 0px 2px 6px 0px rgba(37, 132, 249, 0.1);
    }
    .el-input--small .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
    .el-input-number--small .el-input-number__increase,
    .el-input-number--small .el-input-number__decrease {
      background-color: #2584f9;
      color: #fff;
      border-color: #2584f9;
    }
    .el-input-number--small .el-input-number__decrease {
      border-radius: 2px 0 0 2px;
    }
    .el-input-number--small .el-input-number__increase {
      border-radius: 0 2px 2px 0;
    }
  }
}

.consignee-form-wrapper {
  max-width: 950px;
  padding-left: 80px;

  .el-input {
    width: 300px;
  }
  .el-select {
    width: 300px;
  }
  .el-textarea {
    width: 725px;
  }
  .full-width.el-select {
    width: 725px;
  }
  .el-form-item.address {
    position: relative;
    margin-bottom: 40px;
    /deep/ .el-form-item__label {
      line-height: 24px;
    }
    .split-btn {
      position: absolute;
      right: -108px;
      bottom: 0;
      font-weight: bold;
      background: #70aefa;
      padding: 11px 20px;
      border-color: #70aefa;
    }
    .gray-tip {
      position: absolute;
      font-size: 12px;
      bottom: -35px;
      color: #999999;
    }
  }
}
.order-price-calc {
  padding: 0 160px 0 0;
  height: 68px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px -1px 6px 0px rgba(37, 132, 249, 0.08);
  text-align: right;
  line-height: 68px;
  color: #49505e;
  font-size: 16px;
  .goods-total {
    font-size: 18px;
    color: #fd7474;
  }
  .actual-fee {
    font-size: 20px;
    color: #fd7474;
  }
  .el-button {
    margin-left: 125px;
  }
}
.remark-img-wrapper {
  display: inline-block;
  .remark-img-item {
    position: relative;
    border: 1px solid #eaeaea;
    display: inline-block;
    width: 82px;
    height: 102px;
    margin-right: 10px;

    &:hover {
      .el-icon-error {
        opacity: 1;
      }
    }

    img {
      cursor: pointer;
      width: 80px;
      height: 100px;
    }
    .el-icon-error {
      position: absolute;
      right: -7px;
      top: -8px;
      color: #b9aeae;
      font-size: 20px;
      opacity: 0;
      cursor: pointer;
    }
  }
}
/deep/ .outline-uploader {
  display: inline-block;
  .el-upload {
    border: 1px dashed #e6e6e6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #2584f9;
  }
  .avatar-uploader-icon {
    font-size: 30px;
    color: #2584f9;
    width: 80px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .upload-preview {
    width: 117px;
    height: 140px;
    display: block;
  }
}
/deep/ .preview-pic-wrapper {
  .el-dialog__body {
    max-height: 80vh;
    text-align: center;
    padding: 0;
    img {
      max-height: 80vh;
      max-width: 70vh;
    }
  }
}

/deep/ .select-goods-table {
  max-height: 480px !important;
  height: auto !important;
  .el-table__body-wrapper {
    max-height: 430px !important;
    height: auto !important;
  }
}
</style>
