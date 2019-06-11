<template>
  <el-table
    class="info-table-change"
    border
    :data="baseinfoList"
    :span-method="arraySpanMethod"
    :cell-style="cellCusStyle"
  >
    <el-table-column prop="order_id" label="商品编号" min-width="100" align="center" />
    <el-table-column prop="company_name" label="物流公司" min-width="100" align="center" />
    <el-table-column prop="business_name" label="商户名称" min-width="100" align="center" />
    <el-table-column prop="business_phone" label="商户电话" min-width="100" align="center" />
    <el-table-column prop="delivery_number" label="物流单号" min-width="100" align="center" />
    <el-table-column prop="order_time" label="下单时间" min-width="100" align="center" />
  </el-table>
</template>

<script>
export default {
  props: {
    baseinfoList: {
      type: Array,
      required: true
    }
  },

  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1 || rowIndex === 2) {
        if (columnIndex === 1) {
          return [1, 5]
        } else if (columnIndex !== 0 && columnIndex !== 1) {
          return [0, 0]
        }
      }
    },
    cellCusStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1 || rowIndex === 2) {
        if (columnIndex === 0) {
          return 'background: #EEF2F5;color: #333333;font-weight: bold;'
        } else {
          return 'text-align:left;'
        }
      }
    }
  }
}
</script>

