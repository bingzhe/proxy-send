<template>
  <div class="baseinfo-wrapper">
    <el-row>
      <el-col :span="7" class="baseinfo">
        <span class="base-label">商品编号：</span>
        <span class="base-value">{{ goodsInfo.goods_id }}</span>
      </el-col>
      <el-col :span="7" class="baseinfo">
        <span class="base-label">商品名称：</span>
        <span class="base-value">{{ goodsInfo.goods_name }}</span>
      </el-col>
      <el-col :span="7" class="baseinfo">
        <span class="base-label">材质：</span>
        <span class="base-value">{{ goodsInfo.raw_material }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7" class="baseinfo">
        <span class="base-label">品牌：</span>
        <span class="base-value">{{ goodsInfo.brand }}</span>
      </el-col>
      <el-col :span="7" class="baseinfo">
        <span class="base-label">型号：</span>
        <span class="base-value">{{ goodsInfo.model }}</span>
      </el-col>
      <el-col :span="7" class="baseinfo">
        <span class="base-label">单价：</span>
        <span class="base-value price">￥{{ goodsInfo.price }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="baseinfo">
        <span class="base-label">商品备注：</span>
        <span class="base-value">{{ goodsInfo.remark }}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    goodsInfo: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.baseinfo-wrapper {
  padding: 30px 0 10px;
  border-bottom: 1px solid #eff4f9;

  .baseinfo {
    margin-bottom: 20px;
    .base-label {
      display: inline-block;
      width: 75px;
      text-align: right;
      color: #6d7585;
      font-size: 14px;
    }
    .base-value {
      color: #49505e;
      font-size: 14px;

      &.price {
        font-size: 16px;
        color: #fd7474;
      }
    }
  }
}
</style>

