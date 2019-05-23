<template>
  <div class="app-container">
    <div class="order-title-wrapper">
      <div class="order-title-left">
        <div v-if="order_status === ORDER_STATUS.AUDIT_FAIL" class="error-icon">
          <img src="@/assets/images/error-tip.png">
        </div>
        <div class="order-status-wrapper">
          <div class="order-status">当前订单状态：{{ ORDER_STATUS.toString(order_status) }}</div>
          <div
            v-if="order_status === ORDER_STATUS.AUDIT_FAIL"
            class="order-status-reason"
          >{{ status_remark }}</div>
        </div>
      </div>
      <el-button class="btn-bd-primary" @click="handlerGoBackClick">返回</el-button>
    </div>
    <!-- 基本信息 -->
    <div class="info-wrapper baseinfo-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#F348A1" text="基本信息" />
      </div>
      <div class="info-content-wrapper">
        <table-baseinfo :baseinfo-list="baseinfoList" />
      </div>
    </div>
    <!-- 商品信息 -->
    <div class="info-wrapper goodsinfo-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#F37948" text="商品信息" />
      </div>
      <div class="info-content-wrapper">
        <table-goodsinfo :goods-list="goodsList" />
      </div>
    </div>
    <!-- 收货人信息 -->
    <div class="info-wrapper consigneeinfo-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#F3C148" text="收货人信息" />
      </div>
      <div class="info-content-wrapper">
        <table-consignee :consigneeinfo="consigneeinfo" />
      </div>
    </div>
    <!-- 费用信息 -->
    <div class="info-wrapper feeinfo-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#4880F3" text="费用信息" />
      </div>
      <div class="info-content-wrapper">
        <table-order-feeinfo :order-fee-list="orderFeeList" />
      </div>
    </div>
    <!-- 操作历史信息 -->
    <div class="info-wrapper order-track-info-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#333333" text="操作历史信息" />
      </div>
      <div class="info-content-wrapper">
        <table-order-track :order-track="orderTrack" />
      </div>
    </div>
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import TableBaseinfo from '../components/TableBaseinfo'
import TableGoodsinfo from '../components/TableGoodsinfo'
import TableConsignee from '../components/TableConsigneeinfo'
import TableOrderFeeinfo from '../components/TableOrderFeeinfo'
import TableOrderTrack from '../components/TableOrderTrack'
import moment from 'moment'
import { GOODS_TYPE, ORDER_STATUS } from '@/config/cfg'
import { orderGet } from '@/api/api'

export default {
  components: {
    BaseinfoTitle,
    TableBaseinfo,
    TableGoodsinfo,
    TableConsignee,
    TableOrderFeeinfo,
    TableOrderTrack
  },

  data() {
    return {
      order_id: '',
      order_status: '',
      status_remark: '', // 订单状态原因，审核不通过等
      // 基本信息
      baseinfoList: [
        {
          order_id: '',            // 商品编号
          company_name: '',        // 物流公司
          business_name: '',       // 商户名称
          business_phone: '',      // 商户电话
          delivery_number: '',     // 物流单号
          order_time: ''           // 下单时间
        },
        { order_id: '配送礼品', company_name: '22' },  // 配送礼品
        { order_id: '订单留言', company_name: '22' }   // 订单留言
      ],

      // 商品信息
      goodsList: [],

      // 收货人信息
      consigneeinfo: [{
        person: '',
        phone: '',
        address: ''
      }],

      // 费用信息
      orderFeeList: [
        {
          goods_fee: '',           // 商品合计费用
          freight_fee: '',         // 运费
          discount_fee: '',        // 折扣金额
          attach_fee: ''           // 配送礼品费用
        },
        { goods_fee: '调整费用', freight_fee: '其他费用', discount_fee: '订单总金额', attach_fee: '实付金额' },
        {
          goods_fee: '',           // 调整费用 adjust_fee
          freight_fee: '',         // 其他费用  other_fee
          discount_fee: '',        // 订单总金额 order_fee
          attach_fee: ''           // 实付金额 actual_fee
        }
      ],

      // 操作历史
      orderTrack: [],

      ORDER_STATUS
    }
  },
  created() {
    if (this.$route.query.orderid) {
      this.order_id = this.$route.query.orderid
    }
  },
  mounted() {
    this.getOrderinfo()
  },
  methods: {
    async getOrderinfo() {
      const data = {
        opr: 'get_order_info',
        order_id: this.order_id
      }

      console.log('订单详情 req=>', data)
      const resp = await orderGet(data)
      console.log('订单详情 res=>', resp)

      if (resp.ret !== 0) return

      const info = resp.data.info

      this.order_status = info.order_status
      this.status_remark = info.status_remark

      // 基本信息
      this.baseinfoList[0].order_id = info.order_id
      this.baseinfoList[0].company_name = (info.delivery_info || {}).company_name || '-'
      this.baseinfoList[0].business_name = info.business_name || '-'
      this.baseinfoList[0].business_phone = info.business_phone || '-'
      this.baseinfoList[0].delivery_number = info.delivery_number || '-'
      this.baseinfoList[0].order_time = moment(info.order_time * 1000).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      // <<<<<<<<<<<<<<<<<<<
      this.baseinfoList[1].company_name = '配送礼品'
      this.baseinfoList[2].company_name = info.remark

      // 商品信息
      this.goodsList = info.goods_list.map(goods => {
        // 少边框   <<<<<<<<<<<<<
        goods.desc_str = `${goods.raw_material}_${goods.brand_txt}_${goods.model_txt}_${goods.goods_id}`
        goods.type_str = GOODS_TYPE.toString(goods.type)
        goods.total_price = goods.num * goods.price
        goods.goods_img_url = `http://platform.jzzwlcm.com/php/img_get.php?img=1&imgname=${goods.goods_img}`
        return goods
      })

      // 收货人信息
      this.consigneeinfo[0].person = info.consignee_info.person
      this.consigneeinfo[0].phone = info.consignee_info.phone
      this.consigneeinfo[0].address = info.consignee_info.address

      // 费用信息
      this.orderFeeList[0].goods_fee = info.goods_fee ? `¥ ${info.goods_fee.toFixed(2)}` : '¥ 0.00'
      this.orderFeeList[0].freight_fee = info.freight_fee ? `¥ ${info.freight_fee.toFixed(2)}` : '¥ 0.00'
      this.orderFeeList[0].discount_fee = info.discount_fee ? `- ¥ ${info.discount_fee.toFixed(2)}` : '¥ 0.00'
      this.orderFeeList[0].attach_fee = info.attach_fee ? `¥ ${info.attach_fee.toFixed(2)}` : '¥ 0.00'
      this.orderFeeList[2].goods_fee = info.adjust_fee ? `¥ ${info.adjust_fee.toFixed(2)}` : '¥ 0.00'
      this.orderFeeList[2].freight_fee = info.other_fee ? `¥ ${info.other_fee.toFixed(2)}` : '¥ 0.00'
      this.orderFeeList[2].discount_fee = info.discount_fee ? `¥ ${info.discount_fee.toFixed(2)}` : '¥ 0.00'
      this.orderFeeList[2].attach_fee = info.attach_fee ? `¥ ${info.attach_fee.toFixed(2)}` : '¥ 0.00'

      // 操作历史信息
      this.orderTrack = (this.order_track || []).map(track => {
        track.order_status_str = ORDER_STATUS.toString(track.order_status)
        track.opr_time_str = moment(track.opr_time * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        return track
      })
    },
    handlerGoBackClick() {
      this.$router.go(-1)
    }
  }

}
</script>

<style  lang="scss" scoped>
.app-container {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
}
.order-title-wrapper {
  height: 84px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;

  .order-title-left {
    display: flex;

    .error-icon {
      height: 38px;
      width: 38px;
      margin-right: 10px;
    }
    .order-status-wrapper {
      .order-status {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
      .order-status-reason {
        margin-top: 5px;
        font-size: 14px;
        color: #e33119;
      }
    }
  }
}
.info-wrapper {
  .baseinfo-title-wrapper {
    padding: 24px 30px;
  }
  .info-content-wrapper {
    padding: 0 30px 20px;
  }
}

// el-table
.el-table.info-table-change {
  /deep/ thead {
    color: #333333;
  }
  /deep/ th {
    background: #eff0f1;
  }
  /deep/ th.is-leaf,
  /deep/ td {
    border-bottom: 1px solid #e6e6e6;
  }

  /deep/ &.el-table--border th,
  /deep/ &.el-table--border td {
    border-right: 1px solid #e6e6e6;
  }
}
</style>

