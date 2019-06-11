<template>
  <div class="app-container">
    <div class="shopcart-wrapper">
      <div class="goods-wrapper">
        <div class="baseinfo-title-wrapper">
          <baseinfo-title color="#FB7474" text="已选商品" />
        </div>
      </div>
      <div class="gifs-wrapper">
        <div class="baseinfo-title-wrapper">
          <baseinfo-title color="#74BAFB" text="配送礼品" />
        </div>
      </div>
      <div class="consignee-wrapper">
        <div class="baseinfo-title-wrapper">
          <baseinfo-title color="#FBBD74" text="配送信息" />
        </div>
      </div>
    </div>
    <div v-if="false" class="empty-shopcart">
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
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'

export default {
  components: {
    BaseinfoTitle
  },

  data() {
    return {
      goodsList: [

      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  min-height: 700px;
}
.baseinfo-title-wrapper {
  padding: 24px 30px;
}
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
