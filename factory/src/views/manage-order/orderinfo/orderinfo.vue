<template>
  <div class="app-container">
    <div class="order-info-wrapper">
      <div class="order-title-wrapper">
        <div class="order-title-left">
          <div class="order-status-wrapper">
            <div class="order-status">订单信息</div>
          </div>
        </div>
        <div class="btn-group-wrapper">
          <el-button
            class="btn-bd-primary"
            @click="openChangeAddressDialog"
          >修改收货人信息</el-button>
          <el-button class="btn-bd-primary" @click="oprAdjustFeeDialog"> 调整订单金额 </el-button>
          <el-button class="btn-bd-primary" @click="handlerGoBackClick"> 返回 </el-button>
        </div>
      </div>
      <!-- 基本信息 -->
      <div class="info-wrapper baseinfo-wrapper">
        <div class="baseinfo-title-wrapper">
          <baseinfo-title color="#F348A1" text="基本信息" />
        </div>
        <div class="info-content-wrapper">
          <table-baseinfo
            :baseinfo-list="baseinfoList"
            @imgupload-success="handleBaseInfoimgUpload"
            @imgdelete="handleBaseInfoimgdel"
          />
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
      <!-- <div class="info-wrapper order-track-info-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#333333" text="操作历史信息" />
      </div>
      <div class="info-content-wrapper">
        <table-order-track :order-track="orderTrack" />
      </div>
      </div>-->
    </div>
    <div v-loading="tableLoading" class="audit-wrapper" element-loading-text="拼命加载中">
      <div class="audit-title">审单处理</div>
      <div class="audit-form-wrapper">
        <el-form ref="auditForm" :model="auditForm" label-width="107px" :rules="auditFormRules">
          <el-form-item label="结论：" prop="pass">
            <el-radio
              v-model="auditForm.pass"
              :disabled="order_status === ORDER_STATUS.DELIVERY_WAIT"
              :label="1"
            >通过</el-radio>
            <el-radio v-model="auditForm.pass" :label="0"> 不通过 </el-radio>
          </el-form-item>
          <el-form-item label="原因：" prop="remark">
            <el-input
              v-model="auditForm.remark"
              :rows="4"
              type="textarea"
              placeholder="请输入内容"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="audit-opr">
        <el-button class="btn-bd-primary" @click="handlerGoBackClick"> 取消 </el-button>
        <el-button type="primary" @click="handlerAuditOprClick"> 提交 </el-button>
        <el-button
          class="btn-bd-primary"
          @click="handlerAuditOprAndNextClick"
        >提交并审核下一单</el-button>
      </div>
    </div>

    <!-- 调整订单金额 -->
    <dialog-adjust-order-fee
      ref="adjustFeeDialog"
      :order-id="order_id"
      @on-success="handlerAdjustFeeSuc"
    />
    <!-- @close="handlerAdjustFeeClose" -->
    <!-- 调整地址 -->
    <dialog-change-address
      ref="changeAddress"
      :order-id="order_id"
      @on-success="handlerChangeAddrerss"
    />
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import TableBaseinfo from '../components/TableBaseinfo'
import TableGoodsinfo from '../components/TableGoodsinfo'
import TableConsignee from '../components/TableConsigneeinfo'
import TableOrderFeeinfo from '../components/TableOrderFeeinfo'
import DialogAdjustOrderFee from '../components/DialogAdjustOrderFee'
import DialogChangeAddress from '../components/DialogChangeAddress'
// import TableOrderTrack from '../components/TableOrderTrack'
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
    DialogAdjustOrderFee,
    DialogChangeAddress
    // TableOrderTrack
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
          freight_fee: '', // 其他费用  other_fee
          discount_fee: '', // 订单总金额 order_fee
          attach_fee: '' // 实付金额 actual_fee
        }
      ],

      // 操作历史
      orderTrack: [],

      ORDER_STATUS,

      auditForm: {
        pass: '', // 结论(1:审核通过, 0:不通过)
        remark: '' // 原因(不通过时说明原因)
      },
      auditFormRules: {
        pass: { required: true, message: '请选择审单处理', trigger: 'change' }
      },

      tableLoading: false,

      remark_img_list: [] // 附图名称
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

      this.remark_img_list = info.remark_img_list || []

      // 商品信息
      this.goodsList = info.goods_list.map((goods) => {
        goods.desc_str = `${goods.raw_material}_${goods.brand_txt}_${goods.model_txt}_${goods.color}_${goods.goods_id}`
        goods.type_str = GOODS_TYPE.toString(goods.type)
        goods.total_price = goods.num * goods.price
        goods.goods_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&width=64&height=64&type=7&img_name=${goods.goods_img}`
        goods.goods_img_url_preview = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=7&to=jpg&img_name=${goods.goods_img}`
        goods.warehouse_name = (goods.delivery_info || {}).warehouse_name || '-'
        goods.delivery_number = (goods.delivery_info || {}).delivery_number || '-'

        const left = goods.left || {}
        const right = goods.right || {}
        const top = goods.top || {}
        const bottom = goods.bottom || {}
        if (left.preview_img) {
          goods.left_goods_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&width=64&height=64&type=7&img_name=${left.preview_img}`
          goods.left_goods_img_url_preview = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=7&to=jpg&img_name=${left.preview_img}`
        }
        if (right.preview_img) {
          goods.right_goods_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&width=64&height=64&type=7&img_name=${right.preview_img}`
          goods.right_goods_img_url_preview = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=7&to=jpg&img_name=${right.preview_img}`
        }
        if (top.preview_img) {
          goods.top_goods_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&width=64&height=64&type=7&img_name=${top.preview_img}`
          goods.top_goods_img_url_preview = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=7&to=jpg&img_name=${top.preview_img}`
        }
        if (bottom.preview_img) {
          goods.bottom_goods_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&width=64&height=64&type=7&img_name=${bottom.preview_img}`
          goods.bottom_goods_img_url_preview = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=7&to=jpg&img_name=${bottom.preview_img}`
        }

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
      this.orderFeeList[0].side_print_fee = info.side_print_fee
        ? `¥ ${info.side_print_fee.toFixed(2)}`
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
        // track.order_status_str = ORDER_STATUS.toString(track.order_status)
        track.order_status_str = track.order_status_txt
        track.opr_time_str = moment(track.opr_time * 1000).format('YYYY-MM-DD HH:mm:ss')
        return track
      })
    },
    handlerGoBackClick() {
      this.$router.go(-1)
    },
    handlerAuditOprClick() {
      this.$refs.auditForm.validate((valid) => {
        if (valid) {
          this.auditOpr()
        }
      })
    },
    async auditOpr() {
      const data = {
        opr: 'order_audit',
        order_id: this.order_id, // 订单id
        pass: this.auditForm.pass, // 结论(1:审核通过, 0:不通过)
        remark: this.auditForm.remark // 原因(不通过时说明原因)
      }

      console.log('订单审核 req=>', data)
      const resp = await orderSave(data)
      console.log('订单审核 res=>', resp)

      if (resp.ret !== 0) return

      this.$notify({
        title: '成功',
        message: '提交成功',
        type: 'success',
        duration: 2000
      })
      this.$router.go(-1)
    },
    handlerAuditOprAndNextClick() {
      this.$refs.auditForm.validate((valid) => {
        if (valid) {
          this.auditOprAndNext()
        }
      })
    },
    async auditOprAndNext() {
      // 审核订单
      const dataAudit = {
        opr: 'order_audit',
        order_id: this.order_id, // 订单id
        pass: this.auditForm.pass, // 结论(1:审核通过, 0:不通过)
        remark: this.auditForm.remark // 原因(不通过时说明原因)
      }

      this.tableLoading = true
      const respAudit = await orderSave(dataAudit)
      console.log('订单审核 res=>', respAudit)
      if (respAudit.ret !== 0) return

      // 取还没有审核的订单
      const dataList = {
        opr: 'get_audit_order_list',
        page_no: 1,
        order_status: ORDER_STATUS.AUDIT_WAIT
      }

      const respList = await orderGet(dataList)
      console.log('订单列表 res=>', respList)
      if (respAudit.ret !== 0) return

      const list = respList.data.list || []

      if (list.length === 0) {
        this.$notify({
          title: '警告',
          message: '已经没有需要审核的订单了',
          type: 'warning'
        })
        this.$router.go(-1)
        this.tableLoading = false
        return
      }

      const nextOrderid = list[0].order_id

      this.order_id = nextOrderid
      this.$router.replace({
        path: '/manage-order/orderinfo',
        query: {
          orderid: nextOrderid
        }
      })
      this.tableLoading = false
      this.getOrderinfo()
    },

    oprAdjustFeeDialog() {
      this.$refs.adjustFeeDialog.show()
    },
    openChangeAddressDialog() {
      this.$refs.changeAddress.show()
    },
    // handlerAdjustFeeClose() {},
    handlerAdjustFeeSuc() {
      this.getOrderinfo()
    },
    handlerChangeAddrerss() {
      this.getOrderinfo()
    },

    handleBaseInfoimgUpload(imgname) {
      this.remark_img_list.push(imgname)
      this.saveRemarkImg(this.remark_img_list)
    },
    handleBaseInfoimgdel(i) {
      this.remark_img_list.splice(i, 1)
      this.saveRemarkImg(this.remark_img_list)
    },
    async saveRemarkImg(remarkList) {
      const data = {
        opr: 'save_order_remark_img',
        order_id: this.order_id,
        remark_img_list: remarkList
      }

      const resp = await orderSave(data)
      if (resp.ret !== 0) return

      this.$notify({
        title: '成功',
        message: '操作成功',
        type: 'success'
      })
      this.getOrderinfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.order-info-wrapper {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  margin-bottom: 14px;
}
.audit-wrapper {
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
.audit-wrapper {
  .audit-title {
    height: 55px;
    line-height: 55px;
    padding: 0 20px;
    color: #6666;
    font-size: 16px;
    border-bottom: 1px solid #e6e6e6;
  }
  .el-textarea {
    width: 65%;
  }
  .audit-opr {
    padding: 24px 0;
    border-top: 1px solid #e6e6e6;
    text-align: center;
    .el-button + .el-button {
      margin-left: 40px;
    }
  }
}
</style>
