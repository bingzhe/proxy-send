<template>
  <div class="empty-shopcart">
    <div class="empty-pic">
      <img src="@/assets/images/empty-shopcart.png">
    </div>
    <div class="empty-tip">
      <span>你的购物车还是空的～～</span>
    </div>
    <div>
      <el-button type="primary" plain>前往选购</el-button>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.empty-shopcart {
  text-align: center;
  .empty-pic {
    padding-top: 120px;
    img {
      width: 280px;
      height: 252px;
    }
  }
  .empty-tip {
    margin: 24px 0 31px;
    font-size: 14px;
    color: #8e9cac;
  }

  .el-button {
    font-size: 18px;
    width: 120px;
  }
}
</style>
