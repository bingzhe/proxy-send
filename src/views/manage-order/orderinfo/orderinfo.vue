<template>
  <div>
    <!-- 基本信息 -->
    <div class="baseinfo-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#F348A1" text="基本信息" />
      </div>
    </div>
    <!-- 商品信息 -->
    <div class="goodsinfo-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#F37948" text="商品信息" />
      </div>
    </div>
    <!-- 收货人信息 -->
    <div class="baseinfo-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#F3C148" text="收货人信息" />
      </div>
    </div>
    <!-- 费用信息 -->
    <div class="baseinfo-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#4880F3" text="费用信息" />
      </div>
    </div>
    <!-- 操作历史信息 -->
    <div class="baseinfo-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#333333" text="操作历史信息" />
      </div>
    </div>
  </div>
</template>

<script>
import { orderGet } from '@/api/api'
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'

export default {
  components: {
    BaseinfoTitle
  },

  data() {
    return {
      order_id: ''
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
    }
  }

}
</script>

