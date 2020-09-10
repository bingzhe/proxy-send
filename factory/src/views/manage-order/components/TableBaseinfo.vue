<template>
  <div>
    <el-table
      class="info-table-change"
      border
      :data="baseinfoList"
      :span-method="arraySpanMethod"
      :cell-style="cellCusStyle"
    >
      <el-table-column prop="order_id" label="订单编号" min-width="100" align="center" />
      <el-table-column prop="company_name" label="物流公司" min-width="100" align="center">
        <template slot-scope="scope">
          <div v-if="[0,1,2].includes(scope.$index)">{{ scope.row.company_name }}</div>
          <div v-else>
            <div class="remark-img-list">
              <img
                v-for="(img, i) in scope.row.company_name"
                :key="i"
                :src="img"
                @click="handleRemarkImgClick(img)"
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="business_name" label="商户名称" min-width="100" align="center" />
      <el-table-column prop="business_phone" label="商户电话" min-width="100" align="center" />
      <el-table-column prop="delivery_number" label="物流单号" min-width="100" align="center" />
      <el-table-column prop="order_time" label="下单时间" min-width="100" align="center" />
    </el-table>
    <el-dialog class="preview-pic-wrapper" :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    baseinfoList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 图片预览
      dialogImageUrl: '',
      dialogVisible: false
    }
  },

  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
        if (columnIndex === 1) {
          return [1, 5]
        } else if (columnIndex !== 0 && columnIndex !== 1) {
          return [0, 0]
        }
      }
    },
    cellCusStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
        if (columnIndex === 0) {
          return 'background: #eff0f1;color: #333333;font-weight: bold;'
        } else {
          return 'text-align:left;'
        }
      }
    },
    handleRemarkImgClick(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.remark-img-list {
  img {
    border: 1px solid #eaeaea;
    height: 100px;
    width: 80px;
    margin-right: 10px;
    cursor: pointer;
  }
}
/deep/ .preview-pic-wrapper {
  .el-dialog__body {
    max-height: 80vh;
    text-align: center;
    padding: 0;
    img {
      max-height: 80vh;
      max-width: 70vh;
    }
  }
}
</style>
