<template>
  <div class="app-container">
    <div class="shopcart-wrapper">
      <div class="goods-wrapper">
        <div class="baseinfo-title-wrapper clearfix">
          <baseinfo-title class="select-shop-title" color="#FB7474" text="已选商品" />
          <el-button class="continue-shop" type="primary" plain @click="goGoodsList">继续选购</el-button>
        </div>
        <div class="select-goods-table-wrapper">
          <el-table ref="selectGoodsTable" class="select-goods-table" border :data="goodsList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column prop="goods_img" align="center" label="图片" min-width="50">
              <template slot-scope="scope">
                <img class="table-img" :src="scope.row.goods_img_url" />
              </template>
            </el-table-column>
            <el-table-column prop="type_str" label="商品类型" min-width="50" />
            <el-table-column prop="goods_info_str" label="材质_品牌_型号_边框_商品编号" width="300" />
            <el-table-column prop="num" label="数量" width="150">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.num" :min="1" size="small" @change="getPrice" />
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" min-width="50" />
            <el-table-column prop="goodsSumPrice" label="小计" min-width="50" />
            <el-table-column prop="opr" label="操作" width="85" align="center">
              <template slot-scope="scope">
                <el-button v-if="ORDER_STATUS.REPLENISH_WAIT === order_status" type="text" @click="handleGoodsEditClick(scope.row)">编辑</el-button>
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
          <div v-for="item in attachList" :key="item.goods_id" class="gifs-item">
            <span class="gifs-label">{{ item.goods_name }}</span>
            <el-input-number v-model="item.num" controls-position="right" :min="0" @change="getPrice" />
            <span class="gifs-price">（&yen; {{ item.price }}）</span>
          </div>
        </div>
      </div>
      <div class="consignee-wrapper">
        <div class="baseinfo-title-wrapper">
          <baseinfo-title color="#FBBD74" text="配送信息" />
        </div>
        <div class="consignee-form-wrapper">
          <el-form ref="consigneeFrom" :model="consigneeFrom" :rules="consigeneeFromRules" :inline="true" label-width="80px">
            <!-- <el-form-item label="物流选择" prop="company_name" label-width="130px">
              <el-select v-model="consigneeFrom.company_name" placeholder="请选择" @change="getPrice">
                <el-option
                  v-for="(item,index) in delivery_list"
                  :key="index"
                  :label="item.delivery_str"
                  :value="item.name"
                />
              </el-select>
            </el-form-item> -->
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
              <el-input v-model.trim="consigneeFrom.city" v-trim="consigneeFrom.city" placeholder="请输入" />
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
              <el-button class="split-btn" type="primary" @click="autoSplit">自动拆解</el-button>
            </el-form-item>
            <br />
            <el-form-item label="留言" prop="remark" label-width="130px">
              <el-input v-model.trim="consigneeFrom.remark" type="textarea" placeholder="请输入" maxlength="150" show-word-limit />
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
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import { orderGet, orderSave } from '@/api/api'
import { mapState } from 'vuex'
import { ORDER_STATUS } from '@/config/cfg'

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
    BaseinfoTitle
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

      multipleSelection: [],

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
        order_id_3rd: '' // 第三平台订单号
      },
      consigeneeFromRules: {
        person: [{ required: true, message: '请输入收件人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
        city: [{ required: true, message: '请输入市区', trigger: 'blur' }],
        // area: [{ required: true, message: '请输入区县', trigger: 'blur' }],
        // street: [{ required: true, message: '请输入街道/镇', trigger: 'blur' }],
        company_name: [{ required: true, message: '请选择快递公司', trigger: 'change' }]
      },

      goods_fee: 0.0, // 商品合计费用
      discount_fee: 0.0, // 折扣金额
      actual_fee: 0.0 // 实付金额
    }
  },
  computed: {
    ...mapState({
      delivery_list: (state) => state.user.delivery_list
    }),
    total() {
      let total = 0
      this.goodsList.forEach((goods) => {
        total += goods.num
      })
      return total
    }
  },
  watch: {
    goodsList: {
      handler: function () {
        this.goodsList.forEach((item) => {
          item.goodsSumPrice = item.num * item.price
        })
      },
      deep: true
    }
  },
  mounted() {
    this.order_id = this.$route.params.order_id
    if (this.order_id) {
      this.getOrderinfo()

      // 选中所有商品
      setTimeout(() => {
        this.$refs.selectGoodsTable.toggleAllSelection()
      }, 500)
    }
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
      console.log('订单详情 res=>', resp)

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
      this.consigneeFrom.company_name = ''
      this.consigneeFrom.remark = info.remark || ''
      this.consigneeFrom.telephone = consignee_info.telephone
      this.consigneeFrom.order_id_3rd = consignee_info.order_id_3rd

      this.goods_fee = info.goods_fee
      this.discount_fee = info.discount_fee
      this.actual_fee = info.actual_fee

      // <<<<<<<<<<<<<<<<<<<<<<
      this.order_status = info.order_status
      // this.order_status = 8
    },
    autoSplit() {
      const reg = /.+?(省|市|自治区|自治州|县|区|街道)/g
      const res = this.consigneeFrom.address.match(reg) || []

      this.consigneeFrom.province = res[0] || ''
      this.consigneeFrom.city = res[1] || ''
      this.consigneeFrom.area = res[2] || ''
      this.consigneeFrom.street = res[3] || ''
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
        delivery_company_name: this.consigneeFrom.company_name
      }

      // console.log('计算订单费用 req=>', data)
      const resp = await orderGet(data)
      // console.log('计算订单费用 res=>', resp)

      // <<<<<<<<<<<<<<<<<<<<<<<<<<
      // if (resp.ret !== 0) return

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
     * 淘宝过来的订单需要编辑
     */
    handleGoodsEditClick(row) {
      this.$router.push({
        path: '/manage-goods/goodslist',
        query: {
          source: 'tborder'
        }
      })
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
          index_id: goods.index_id,
          color: goods.color,
          num: goods.num
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
        delivery_company_name: this.consigneeFrom.company_name,
        remark: this.consigneeFrom.remark
      }

      console.log('购物车下单 req=>', data)
      const resp = await orderSave(data)
      console.log('购物车下单 req=>', resp)

      if (resp.ret !== 0) return

      this.$slnotify({ message: '下单成功' })

      //  更新页面全局数据
      this.$store.dispatch('user/getUserInfo')
      setTimeout(() => {
        // this.goGoodsList()
        this.$router.go(-1)
      }, 2000)
    },
    goGoodsList() {
      if (this.order_status === ORDER_STATUS.REPLENISH_WAIT) {
        this.$router.push({
          path: '/manage-goods/goodslist',
          query: {
            source: 'tborder'
          }
        })
      } else {
        this.$router.push('/manage-goods/goodslist')
      }
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
</style>
