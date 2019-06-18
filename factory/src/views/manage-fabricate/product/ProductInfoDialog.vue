<template>
  <sl-dialog
    ref="productInfoDialog"
    width="900px"
    top="12vh"
    :show-footer="false"
    title="生产单详情"
    @close="handlerProductInfoClose"
  >
    <div class="product-wrapper clearfix">
      <div class="info-wrapper">
        <div class="info-item">
          <span class="item-label">订单编号：</span>
          <span class="item-value">{{ productInfo.order_id }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">下单时间：</span>
          <span class="item-value">{{ productInfo.create_time_str }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">商品名称：</span>
          <span class="item-value">{{ productInfo.goods_name }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">型号：</span>
          <span class="item-value">{{ productInfo.model_name }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">品牌：</span>
          <span class="item-value">{{ productInfo.brand_name }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">材质：</span>
          <span class="item-value">{{ productInfo.raw_material }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">数量：</span>
          <span class="item-value">{{ productInfo.num }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">状态：</span>
          <span class="item-value">{{ productInfo.status_txt }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">下载时间：</span>
          <span class="item-value">{{ productInfo.create_time_str }}</span>
        </div>
      </div>
      <div class="pic-wrapper">
        <img class="preview-pic" :src="productInfo.preview_img_url">
      </div>
    </div>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'

export default {
  components: {
    SlDialog
  },

  props: {
    productInfo: {
      type: Object,
      required: true
    }
  },

  methods: {
    show() {
      this.$refs.productInfoDialog.show()
    },
    handlerProductInfoClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.info-wrapper {
  float: left;
}
.pic-wrapper {
  float: right;
  margin-right: 60px;
  width: 300px;
  height: 390px;
  .preview-pic {
    width: 300px;
    height: 390px;
  }
}
.info-item {
  margin-bottom: 20px;
  font-size: 14px;

  .item-label {
    display: inline-block;
    width: 130px;
    color: #666;
    text-align: right;
  }
  .item-value {
    color: #333;
  }
}
</style>

