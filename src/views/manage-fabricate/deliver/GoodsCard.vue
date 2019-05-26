<template>
  <div class="goods-card">
    <div class="card-item">
      <span class="card-label">商品名称：</span>
      <span class="card-value">{{ goodsInfo.goods_name }}</span>
    </div>
    <div class="card-item">
      <span class="card-label">商品类型：</span>
      <span class="card-value">{{ goodsInfo.type_str }}</span>
    </div>
    <div class="card-item">
      <span class="card-label">材质：</span>
      <span class="card-value">{{ goodsInfo.raw_material }}</span>
    </div>
    <div class="card-item">
      <span class="card-label">型号：</span>
      <span class="card-value">{{ goodsInfo.model_txt }}</span>
    </div>
    <div class="card-item">
      <span class="card-label">颜色：</span>
      <span class="card-value">{{ goodsInfo.color }}</span>
    </div>
    <div class="card-item">
      <span class="card-label">数量：</span>
      <span class="card-value">{{ goodsInfo.num }}</span>
    </div>
    <div class="card-img">
      <img class="goods-img" :src="goodsInfo.goods_img_url" alt>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsInfo: {
      type: Object,
      default: () => {
        return {
          goods_id: '', // 商品编号(ID)
          goods_name: '', // 商品名称
          type: '', // 商品种类(1:diy, 2:标品, 3:礼品)
          num: 0, // 商品数量
          price: 0.0, // 商品单价(元)
          raw_material: '', // 材质（直接使用文本，如："玻璃"、"硅胶"...）
          brand: '', // 品牌
          brand_txt: '', // 品牌（brand对应的文本）
          model: '', // 型号
          model_txt: '', // 型号（model对应的文本）
          color: '', // 颜色分类("红色"、"绿色"...)
          goods_img: '' // 商品图片
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-card{
  margin-bottom: 20px;
}
.card-item {
  margin-bottom: 20px;
  .card-label {
    font-size: 14px;
    font-weight: bold;
    color: #666;
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  .card-value {
    font-size: 14px;
    color: #333;
  }
}

.goods-img{
  display: inline-block;
    width: 225px;
    height: 298px;
}
</style>

