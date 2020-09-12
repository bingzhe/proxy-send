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
              <div v-for="(img, i) in scope.row.company_name" :key="i" class="remark-img-item">
                <img :src="img" @click="handleRemarkImgClick(img)" />
                <i class="el-icon-error" @click="handleRemarkImgRemoveClick(i)"></i>
              </div>
            </div>
            <sl-upload class="outline-uploader" :type="8" @on-success="handleUploadSuccess">
              <i class="el-icon-plus avatar-uploader-icon" />
            </sl-upload>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="business_name" label="商户名称" min-width="100" align="center" />
      <el-table-column prop="business_phone" label="商户电话" min-width="100" align="center" />
      <el-table-column prop="tshop_name" label="下单店铺" min-width="100" align="center" />
      <el-table-column prop="delivery_number" label="物流单号" min-width="100" align="center" />
      <el-table-column prop="order_time" label="下单时间" min-width="100" align="center" />
    </el-table>
    <el-dialog class="preview-pic-wrapper" :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import SlUpload from '@/components/upload/index'

export default {
  components: {
    SlUpload
  },
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
          return [1, 6]
        } else if (columnIndex !== 0 && columnIndex !== 1) {
          return [0, 0]
        }
      }
    },
    cellCusStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
        if (columnIndex === 0) {
          return 'background: #EEF2F5;color: #333333;font-weight: bold;'
        } else {
          return 'text-align:left;'
        }
      }
    },
    handleRemarkImgClick(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    handleUploadSuccess({ img_name }) {
      this.$emit('imgupload-success', img_name)
    },
    handleRemarkImgRemoveClick() {
      console.log('del')
    }
  }
}
</script>

<style lang="scss" scoped>
.remark-img-list {
  display: inline-block;

  .remark-img-item {
    position: relative;
    border: 1px solid #eaeaea;
    display: inline-block;
    width: 82px;
    height: 102px;
    margin-right: 10px;

    &:hover {
      .el-icon-error {
        opacity: 1;
      }
    }

    img {
      cursor: pointer;
      width: 80px;
      height: 100px;
    }
    .el-icon-error {
      position: absolute;
      right: 0;
      top: 0;
      color: #b9aeae;
      font-size: 20px;
      opacity: 0;
      cursor: pointer;
    }
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
/deep/ .outline-uploader {
  display: inline-block;
  .el-upload {
    border: 1px dashed #e6e6e6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #2584f9;
  }
  .avatar-uploader-icon {
    font-size: 30px;
    color: #2584f9;
    width: 80px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .upload-preview {
    width: 117px;
    height: 140px;
    display: block;
  }
}
</style>
