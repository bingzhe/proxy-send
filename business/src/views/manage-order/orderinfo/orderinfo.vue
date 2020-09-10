<template>
  <div class="app-container">
    <div class="order-title-wrapper">
      <div class="order-title-left">
        <div v-if="order_status === ORDER_STATUS.AUDIT_FAIL" class="error-icon">
          <img src="@/assets/images/error-tip.png" />
        </div>
        <div class="order-status-wrapper">
          <div class="order-status">当前订单状态：{{ ORDER_STATUS.toString(order_status) }}</div>
          <div
            v-if="order_status === ORDER_STATUS.AUDIT_FAIL"
            class="order-status-reason"
          >{{ status_remark }}</div>
        </div>
      </div>
      <div class="btn-group-wrapper">
        <el-button
          v-if="order_status === ORDER_STATUS.AUDIT_WAIT"
          class="btn-bd-primary"
          @click="openUndoDialogTip"
        >撤销订单</el-button>
        <el-button
          v-if="order_status === ORDER_STATUS.AUDIT_FAIL"
          class="btn-bd-primary"
          @click="handlerEditBtnClick"
        >编辑订单</el-button>
        <el-button
          v-if="order_status === ORDER_STATUS.AUDIT_FAIL|| order_status === ORDER_STATUS.REVOCAT"
          class="btn-bd-primary"
          @click="openDeleteDialogTip"
        >删除订单</el-button>
        <el-button v-if="order_status === ORDER_STATUS.DELIVERY_SUC" class="btn-bd-primary">物流追踪</el-button>
        <el-button class="btn-bd-primary" @click="handlerGoBackClick">返回</el-button>
      </div>
    </div>
    <!-- 基本信息 -->
    <div class="info-wrapper baseinfo-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#FB7474" text="基本信息" />
      </div>
      <div class="info-content-wrapper">
        <table-baseinfo :baseinfo-list="baseinfoList" />
      </div>
    </div>
    <!-- 商品信息 -->
    <div class="info-wrapper goodsinfo-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#74CDFB" text="商品信息" />
      </div>
      <div class="info-content-wrapper">
        <table-goodsinfo :goods-list="goodsList" />
      </div>
    </div>
    <!-- 收货人信息 -->
    <div class="info-wrapper consigneeinfo-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#747AFB" text="收货人信息" />
      </div>
      <div class="info-content-wrapper">
        <table-consignee :consigneeinfo="consigneeinfo" />
      </div>
    </div>
    <!-- 费用信息 -->
    <div class="info-wrapper feeinfo-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#FB74F3" text="费用信息" />
      </div>
      <div class="info-content-wrapper">
        <table-order-feeinfo :order-fee-list="orderFeeList" />
      </div>
    </div>
    <!-- 操作历史信息 -->
    <div class="info-wrapper order-track-info-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#74FBDA" text="操作历史信息" />
      </div>
      <div class="info-content-wrapper">
        <table-order-track :order-track="orderTrack" />
      </div>
    </div>

    <!-- 撤销提示弹窗 -->
    <dialog-tip
      ref="undoDialogTip"
      type="undo"
      cancel-text="不撤销"
      confirm-text="撤销"
      title="撤销订单"
      tip-text="订单撤销不能还原，确定要撤销？"
      @confirm="undoOrderOpr"
    />

    <!-- 删除提示弹窗 -->
    <dialog-tip
      ref="deleteDialogTip"
      type="delete"
      cancel-text="不删除"
      confirm-text="删除"
      title="删除订单"
      tip-text="确定要删除订单吗？"
      @confirm="deleteOrderOpr"
    />
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import TableBaseinfo from '../components/TableBaseinfo'
import TableGoodsinfo from '../components/TableGoodsinfo'
import TableConsignee from '../components/TableConsigneeinfo'
import TableOrderFeeinfo from '../components/TableOrderFeeinfo'
import TableOrderTrack from '../components/TableOrderTrack'
import DialogTip from '@/components/Dialog/DialogTip'
import moment from 'moment'
import { GOODS_TYPE, ORDER_STATUS } from '@/config/cfg'
import { orderGet, orderSave } from '@/api/api'

export default {
  components: {
    BaseinfoTitle,
    TableBaseinfo,
    TableGoodsinfo,
    TableConsignee,
    TableOrderFeeinfo,
    TableOrderTrack,
    DialogTip
  },

  data() {
    return {
      token: window.Store.GetGlobalData('token'),

      order_id: '',
      order_status: '',
      status_remark: '', // 订单状态原因，审核不通过等
      // 基本信息
      baseinfoList: [
        {
          order_id: '', // 商品编号
          company_name: '', // 物流公司
          business_name: '', // 商户名称
          business_phone: '', // 商户电话
          delivery_number: '', // 物流单号
          order_time: '' // 下单时间
        },
        { order_id: '配送礼品', company_name: '' }, // 配送礼品
        { order_id: '订单留言', company_name: '' }, // 订单留言
        { order_id: '附图', company_name: [] } // 附图
      ],

      // 商品信息
      goodsList: [],

      // 收货人信息
      consigneeinfo: [
        {
          person: '',
          phone: '',
          address: '',
          telephone: '',
          order_id_3rd: ''
        }
      ],

      // 费用信息
      orderFeeList: [
        {
          goods_fee: '', // 商品合计费用
          freight_fee: '', // 运费
          discount_fee: '', // 折扣金额
          attach_fee: '' // 配送礼品费用
        },
        {
          goods_fee: '调整费用',
          freight_fee: '退款金额',
          discount_fee: '订单总金额',
          attach_fee: '实付金额'
        },
        {
          goods_fee: '', // 调整费用 adjust_fee
          freight_fee: '', // 其他费用  refund_fee
          discount_fee: '', // 订单总金额 order_fee
          attach_fee: '' // 实付金额 actual_fee
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

      // info.remark_img_list = [
      //   '004900648cddfd09dbeae6d13f1503cd.jpg',
      //   '004900648cddfd09dbeae6d13f1503cd.jpg'
      // ]

      // 基本信息
      this.baseinfoList[0].order_id = info.order_id
      this.baseinfoList[0].company_name = (info.delivery_info || {}).company_name || '-'
      this.baseinfoList[0].business_name = info.business_name || '-'
      this.baseinfoList[0].business_phone = info.business_phone || '-'
      this.baseinfoList[0].tshop_name = info.tshop_name || '-'
      this.baseinfoList[0].delivery_number = (info.delivery_info || {}).delivery_number || '-'
      this.baseinfoList[0].order_time = moment(info.order_time * 1000).format('YYYY-MM-DD HH:mm:ss')
      this.baseinfoList[1].company_name = (info.attach_list || [])
        .map((attach) => {
          const attach_str = `${attach.goods_name}（${attach.num}）`
          return attach_str
        })
        .join('，')
      this.baseinfoList[2].company_name = info.remark
      this.baseinfoList[3].company_name = (info.remark_img_list || []).map((img) => {
        return `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=8&img_name=${img}&vxversion=v2`
      })

      // 商品信息
      this.goodsList = info.goods_list.map((goods) => {
        goods.desc_str = `${goods.raw_material}_${goods.brand_txt}_${goods.model_txt}_${goods.color}_${goods.goods_id}`
        goods.type_str = GOODS_TYPE.toString(goods.type)
        goods.total_price = goods.num * goods.price
        goods.goods_img_url = goods.goods_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&width=64&height=64&type=7&img_name=${goods.goods_img}`
        goods.goods_img_url_preview = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=7&to=jpg&img_name=${goods.goods_img}`
        return goods
      })

      // 收货人信息
      this.consigneeinfo[0].person = info.consignee_info.person
      this.consigneeinfo[0].phone = info.consignee_info.phone
      this.consigneeinfo[0].address = info.consignee_info.address
      this.consigneeinfo[0].telephone = info.consignee_info.telephone
      this.consigneeinfo[0].order_id_3rd = info.consignee_info.order_id_3rd

      // 费用信息
      this.orderFeeList[0].goods_fee = info.goods_fee ? `¥ ${info.goods_fee.toFixed(2)}` : '¥ 0.00'
      this.orderFeeList[0].freight_fee = info.freight_fee
        ? `¥ ${info.freight_fee.toFixed(2)}`
        : '¥ 0.00'
      this.orderFeeList[0].discount_fee = info.discount_fee
        ? `- ¥ ${info.discount_fee.toFixed(2)}`
        : '¥ 0.00'
      this.orderFeeList[0].attach_fee = info.attach_fee
        ? `¥ ${info.attach_fee.toFixed(2)}`
        : '¥ 0.00'
      this.orderFeeList[2].goods_fee = info.adjust_fee
        ? `¥ ${info.adjust_fee.toFixed(2)}`
        : '¥ 0.00'
      this.orderFeeList[2].freight_fee = info.refund_fee
        ? `¥ ${info.refund_fee.toFixed(2)}`
        : '¥ 0.00'
      this.orderFeeList[2].discount_fee = info.order_fee
        ? `¥ ${info.order_fee.toFixed(2)}`
        : '¥ 0.00'
      this.orderFeeList[2].attach_fee = info.actual_fee
        ? `¥ ${info.actual_fee.toFixed(2)}`
        : '¥ 0.00'

      // 操作历史信息
      this.orderTrack = (info.order_track || []).map((track) => {
        track.order_status_str = ORDER_STATUS.toString(track.order_status)
        track.opr_time_str = moment(track.opr_time * 1000).format('YYYY-MM-DD HH:mm:ss')
        return track
      })
    },
    handlerGoBackClick() {
      this.$router.go(-1)
    },
    // 撤销弹窗
    openUndoDialogTip() {
      this.$refs.undoDialogTip.show()
    },
    async undoOrderOpr() {
      const data = {
        opr: 'cancel_order',
        order_id: this.order_id
      }

      const resp = await orderSave(data)
      if (resp.ret !== 0) return
      this.$refs.undoDialogTip.hide()
      this.$slnotify({ message: '撤销成功' })
      this.getOrderinfo()
    },

    // 删除订单
    openDeleteDialogTip(id) {
      this.$refs.deleteDialogTip.show()
    },
    async deleteOrderOpr() {
      const data = {
        opr: 'delete_order',
        order_id: this.order_id
      }

      const resp = await orderSave(data)
      if (resp.ret !== 0) return
      this.$refs.deleteDialogTip.hide()
      this.$slnotify({ message: '删除成功' })
      this.$router.go(-1)
    },
    handlerEditBtnClick() {
      this.$router.push({ path: `/manage-order/tborderedit/${this.order_id}` })
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
    background: #eef2f5;
  }
  /deep/ th.is-leaf,
  /deep/ td {
    border-bottom: 1px solid #eef2f5;
  }

  /deep/ &.el-table--border th,
  /deep/ &.el-table--border td {
    border-right: 1px solid #eef2f5;
  }
}
</style>

