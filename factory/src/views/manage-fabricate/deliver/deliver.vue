<template>
  <div class="app-container">
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true" :rules="searchFormRules">
        <el-form-item prop="order_id">
          <el-input
            ref="searchInput"
            v-model="searchForm.order_id"
            v-focus
            placeholder="请输入物流号或订单号"
            @keyup.enter.native="handlerSearchClick"
            @blur="handleBlurClick"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlerSearchClick">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-loading="loading" class="order-info-wrapper" element-loading-text="正在搜索">
      <div v-if="displayStatus === 3" class="base-info-wrapper">
        <div class="base-title">
          <baseinfo-title color="#F348A1" text="订单信息" />
        </div>
        <el-row class="base-info-content">
          <el-col
            v-for="(item,key) in orderInfo"
            :key="key"
            :span="key==='remark'||key==='consignee_address' ? 24: 6 "
            class="info-item"
          >
            <span class="info-label">{{ item.label }}：</span>
            <span class="info-value">{{ item.value }}</span>
          </el-col>
        </el-row>
      </div>
      <div class="goods-info-wrapper">
        <!-- 搜索前显示 -->
        <div v-if="displayStatus === 1" class="search-before-wraper">
          <img class="deliver-icon" src="@/assets/images/deliver.png">
          <div class="deliver-tip">请手工输入物流单号或使用扫描枪查找发货商品</div>
        </div>

        <!-- 没有找打订单号 -->
        <div v-if="displayStatus === 2" class="no-order-wrapper">
          <img class="no-order-icon" src="@/assets/images/deliver-no-search.png">
          <div class="no-order-tip">无效物流单，未找到关联订单</div>
        </div>

        <!-- 审核未通过 -->
        <div
          v-if="displayStatus === 3 && order_status === ORDER_STATUS.AUDIT_FAIL"
          class="invalid-order-wrapper"
        >
          <img class="invalid-order-icon" src="@/assets/images/invalid.png">
          <div class="invalid-order-tip">订单审核未通过</div>
        </div>

        <!-- 已作废-->
        <div
          v-if="displayStatus === 3 && order_status === ORDER_STATUS.REVOCAT"
          class="invalid-order-wrapper"
        >
          <img class="invalid-order-icon" src="@/assets/images/invalid.png">
          <div class="invalid-order-tip">该物流单已作废</div>
        </div>

        <div v-if="displayStatus === 3 && showGoodsList" class="goods-info-content">
          <div class="base-title clearfix">
            <baseinfo-title class="baseinfo-title" color="#F39448" text="商品" />
            <span class="attach-info">{{ attachInfoStr }}</span>
            <el-button
              :disabled="order_status !== ORDER_STATUS.DELIVERY_WAIT || !orderInfo.delivery_number.value"
              class="confirm-deliver btn-h-38"
              type="primary"
              @click="deliverGoods"
            >确认发货</el-button>
          </div>
          <el-row class="goods-list-wrapper">
            <el-col v-for="(goods,i) in goods_list" :key="i" :span="12" :lg="8" :xl="6">
              <goods-card :goods-info="goods" />
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import { orderGet, orderSave } from '@/api/api'
import { ORDER_STATUS, GOODS_TYPE } from '@/config/cfg'
import GoodsCard from './GoodsCard'

export default {
  components: {
    BaseinfoTitle,
    GoodsCard
  },
  data() {
    return {
      token: window.Store.GetGlobalData('token'),

      searchForm: {
        order_id: ''
      },
      preSearchVal: '',

      order_status: '',

      attachInfoStr: '',

      searchFormRules: {
        order_id: [
          // { required: true, message: '请输入物流号或订单号', trigger: 'blur' }
        ]
      },
      orderInfo: {
        delivery_number: { label: '物流号', value: '' },
        order_id: { label: '订单编号', value: '' },
        order_status: { label: '订单状态', value: '' },
        company_name: { label: '物流公司', value: '' },
        business_name: { label: '商户名称', value: '' },
        consignee_person: { label: '收货人', value: '' },
        consignee_phone: { label: '手机号码', value: '' },
        consignee_address: { label: '收获地址', value: '' },
        remark: { label: '留言', value: '' }
      },

      goods_list: [], // 商品列表
      loading: false,

      displayStatus: 1, // 1搜索前 2无订单 3订单存在
      ORDER_STATUS,

      cacheOrderId: '',

      timer: null,  // 计时器，监控输入框500ms如果没有变化执行查找
      isNoneOrder: false
    }
  },
  computed: {
    showGoodsList() {
      if (
        this.order_status === ORDER_STATUS.AUDIT_WAIT ||
        this.order_status === ORDER_STATUS.DELIVERY_WAIT ||
        this.order_status === ORDER_STATUS.DELIVERY_SUC ||
        this.order_status === ORDER_STATUS.REFUND ||
        this.order_status === ORDER_STATUS.COMPLETE
      ) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    'searchForm.order_id': function(val, oldVal) {
      this.isNoneOrder = false
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      if (!this.searchForm.order_id) {
        return
      }
      /**
       * 值等于上一次值的时候调接口
       */
      if (this.searchForm.order_id === this.preSearchVal) {
        if (!this.isNoneOrder) {
          this.handlerSearchClick()
        }
      }
      this.preSearchVal = this.searchForm.order_id
    }, 500)
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
  },
  methods: {
    handlerSearchClick() {
      this.$refs.searchForm.validate(valid => {
        if (valid) {
          this.getOrderinfo()
        }
      })
    },

    async getOrderinfo(type) {
      const data = {
        opr: 'get_order_info',
        query_value: this.searchForm.order_id
      }

      if (type && type === 'deliver') {
        data.query_value = this.cacheOrderId
      }

      this.loading = true

      console.log('订单详情 req=>', data)
      const resp = await orderGet(data)
      console.log('订单详情 res=>', resp)
      this.loading = false
      // 订单不存在
      if (resp.ret === -60340) {
        this.displayStatus = 2
        this.isNoneOrder = true
        this.$refs.searchInput.select()
      }

      if (resp.ret !== 0) return

      /**
     * 搜索成功，清空并获得焦点
     */
      this.cacheOrderId = this.searchForm.order_id
      this.searchForm.order_id = ''
      this.$refs.searchInput.focus()

      this.displayStatus = 3

      const info = resp.data.info
      const delivery_info = info.delivery_info || {}
      const consignee_info = info.consignee_info || {}

      this.order_status = info.order_status

      this.orderInfo.delivery_number.value = delivery_info.delivery_number
      this.orderInfo.order_id.value = info.order_id
      this.orderInfo.order_status.value = ORDER_STATUS.toString(
        info.order_status
      )
      this.orderInfo.company_name.value = delivery_info.company_name
      this.orderInfo.business_name.value = info.business_name
      this.orderInfo.consignee_person.value = consignee_info.person
      this.orderInfo.consignee_phone.value = consignee_info.phone
      this.orderInfo.consignee_address.value = consignee_info.address
      this.orderInfo.remark.value = info.remark

      this.goods_list = info.goods_list || []
      this.goods_list.forEach(goods => {
        goods.type_str = GOODS_TYPE.toString(goods.type)
        goods.des_str = `${goods.type_str}/${goods.raw_material}/${goods.brand_txt}/${goods.model_txt}/${goods.color}/${goods.num}`
        goods.goods_img_url = `${
          process.env.VUE_APP_BASEURL
        }/img_get.php?token=${this.token}&opr=get_img&width=225&height=280&type=1&img_name=${
          goods.goods_img
        }`
      })

      this.attachInfoStr = (info.attach_list || []).map(attach => {
        const attach_str = `${attach.goods_name}（${attach.num}）`
        return attach_str
      }).join('，')
    },

    async deliverGoods() {
      if (!this.orderInfo.delivery_number.value) {
        this.$message.error('该订单没有物流单号')
        return
      }

      const data = {
        opr: 'goods_sendout',
        order_id: this.orderInfo.order_id.value, // 订单id(编号)
        delivery_number: this.orderInfo.delivery_number.value // 物流单号（发货的单号）
      }

      console.log('订单发货 req=>', data)
      const resp = await orderSave(data)
      console.log('订单发货 ress=>', resp)

      if (resp.ret !== 0) return

      this.$notify({
        title: '成功',
        message: '发货提交成功',
        type: 'success',
        duration: 2000
      })
      this.getOrderinfo('deliver')
      /**
     * 发货成功，清空并获得焦点
     */
      this.searchForm.order_id = ''
      this.$refs.searchInput.focus()
    },

    handleBlurClick() {
      setTimeout(() => {
        this.$refs && this.$refs.searchInput && this.$refs.searchInput.focus()
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #ffffff;
  border-radius: 2px;
  padding: 24px 80px 35px;
}
.search-wrapper {
  text-align: center;
  margin-bottom: 5px;
  .el-input {
    width: 600px;
    margin-right: 20px;

    /deep/ .el-input__inner {
      text-align: center;
      height: 54px;
      line-height: 54px;
    }
  }
  .el-button {
    padding: 18px 38px;
    font-size: 16px;
  }
}

.order-info-wrapper {
  .base-info-wrapper {
    border: 1px solid #efefef;
    margin-bottom: 20px;

    .base-info-content {
      padding: 25px 50px 0;

      .info-item {
        margin-bottom: 18px;
      }

      .info-label {
        width: 70px;
        display: inline-block;
        font-size: 14px;
        color: #666;
        text-align: right;
      }
      .info-value {
        font-size: 14px;
        color: #333;
      }
    }
  }
  .goods-info-wrapper {
    position: relative;
    min-height: 520px;
    border: 1px solid #efefef;

    .search-before-wraper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      .deliver-icon {
        display: inline-block;
        margin-bottom: 30px;
        width: 160px;
        height: 149px;
      }
      .deliver-tip {
        font-size: 14px;
        color: #888;
      }
    }
    .no-order-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      .no-order-icon {
        display: inline-block;
        margin-bottom: 30px;
        width: 186px;
        height: 180px;
      }
      .no-order-tip {
        font-size: 14px;
        color: #888;
      }
    }

    .invalid-order-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      .invalid-order-icon {
        display: inline-block;
        margin-bottom: 30px;
        width: 186px;
        height: 166px;
      }
      .invalid-order-tip {
        font-size: 14px;
        color: #888;
      }
    }

    .goods-list-wrapper {
      padding: 20px 50px 0;
    }
  }
}

.base-title {
  height: 54px;
  line-height: 54px;
  background: #f9fafc;
  padding: 0 25px;
}
.confirm-deliver {
  float: right;
  margin-top: 8px;
}
.baseinfo-title {
  float: left;
}
.attach-info {
  font-size: 16px;
  margin-left: 14px;
  font-weight: bold;
  color: #f56c6c;
}
@media screen and (max-width: 1450px) {
  .order-info-wrapper {
    .goods-info-wrapper {
      min-height: 380px;
      border: 1px solid #efefef;
    }
  }
}
</style>

