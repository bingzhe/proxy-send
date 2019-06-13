<template>
  <el-table class="info-table-change" border :data="orderTrack">
    <el-table-column prop="opr_person" label="操作者" min-width="100" align="center" />
    <el-table-column prop="opr_time" label="操作时间" min-width="100" align="center" />
    <el-table-column prop="order_status_txt" label="订单状态" min-width="100" align="center" />
    <el-table-column prop="opr_step" label="操作" min-width="100" align="center" />
    <el-table-column prop="remark " label="备注" min-width="400" align="center" />
  </el-table>
</template>

<script>
export default {
  props: {
    orderTrack: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

