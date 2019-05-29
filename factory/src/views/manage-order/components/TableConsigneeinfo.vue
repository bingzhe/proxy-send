<template>
  <el-table class="info-table-change" border :data="consigneeinfo">
    <el-table-column prop="person" label="收货人" width="200" align="center" />
    <el-table-column prop="phone" label="手机号码" width="200" align="center" />
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

