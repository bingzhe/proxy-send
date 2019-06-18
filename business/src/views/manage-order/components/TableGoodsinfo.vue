<template>
  <div>
    <el-table class="info-table-change" border :data="goodsList">
      <el-table-column prop="goods_img" label="商品照片" min-width="140" align="center">
        <template slot-scope="scope">
          <img
            class="goods-img-preview"
            :src="scope.row.goods_img_url"
            @click="handlePictureCardPreview(scope.row.goods_img_url_preview)"
          >
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" label="商品名称" min-width="160" align="center" />
      <el-table-column prop="type_str" label="商品类型" min-width="80" align="center" />
      <el-table-column prop="desc_str" label="材质_品牌_型号_边框_商品编号" min-width="320" align="center" />
      <el-table-column prop="color" label="颜色分类" min-width="80" align="center" />
      <el-table-column prop="num" label="数量" min-width="80" align="center" />
      <el-table-column prop="total_price" label="小计" min-width="80" align="center">
        <template slot-scope="scope">
          <span>¥ {{ scope.row.total_price }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="preview-dialog" :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    goodsList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.info-table-change {
  /deep/ td {
    padding: 4px 0;
    .goods-img-preview {
      height: 64px;
      width: 64px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
}
</style>

