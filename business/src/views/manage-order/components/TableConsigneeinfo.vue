<template>
  <el-table class="info-table-change" border :data="consigneeinfo">
    <el-table-column prop="person" label="收货人" min-width="100" align="center" />
    <el-table-column prop="phone" label="手机号码" min-width="100" align="center" />
    <el-table-column prop="telephone" label="固定电话" min-width="100" align="center" />
    <el-table-column prop="order_id_3rd" label="第三方平台订单" min-width="100" align="center" />
    <el-table-column prop="address" label="收货地址" min-width="200" align="center" />
  </el-table>
</template>

<script>
export default {
  props: {
    consigneeinfo: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

