<template>
  <el-table class="info-table-change" border :data="orderFeeList" :cell-style="cellCusStyle">
    <el-table-column prop="goods_fee" label="商品合计" min-width="100" align="center" />
    <el-table-column prop="freight_fee" label="运费" min-width="100" align="center" />
    <el-table-column prop="discount_fee" label="折扣金额" min-width="100" align="center" />
    <el-table-column prop="attach_fee" label="配送礼品费用" min-width="100" align="center" />
  </el-table>
</template>

<script>
export default {
  props: {
    orderFeeList: {
      type: Array,
      required: true
    }
  },
  methods: {
    cellCusStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1) {
        return 'background:#EEF2F5;color:#333333;font-weight:bold;'
      } else if (rowIndex === 2) {
        if (columnIndex === 2 || columnIndex === 3) {
          return 'color:#E33119 '
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

