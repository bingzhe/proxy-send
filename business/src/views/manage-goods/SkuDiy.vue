<template>
  <div class="app-container">
    <div class="title-wrapper">
      <baseinfo-title color="#FB7474" text="新增订单" />
    </div>

    <div class="goodsinfo-wrapper">
      <sku-baseinfo :goods-info="goodsInfo" />

      <el-row>
        <el-col :span="7">
          <div class="opr-item clearfix">
            <div class="opr-lable">订购数量</div>
            <div class="opr-value">
              <el-input-number v-model="num" controls-position="right" :min="1" />
            </div>
            <div class="opr-suffix">件</div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="opr-item clearfix pic-source">
            <div class="opr-lable">图片来源</div>
            <div class="opr-value">
              <el-radio v-model="picSource" label="1">备选项</el-radio>
              <el-radio v-model="picSource" label="2">备选项</el-radio>
            </div>
          </div>
        </el-col>
      </el-row>

      <material-list />

      <div class="button-group-wrapper">
        <el-button>取消</el-button>
        <el-button type="primary">下一步:提交订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import SkuBaseinfo from './components/SkuBaseinfo'
import MaterialList from './components/MaterialList'

export default {
  components: {
    BaseinfoTitle,
    SkuBaseinfo,
    MaterialList
  },

  data() {
    return {
      token: window.Store.GetGlobalData('token'),

      goodsInfo: {
        goods_id: '',        // 商品编号(ID)（空时为新建）
        goods_name: '',      // 商品名称
        price: '',           // 商品价格（元）
        raw_material: '',    // 材质（直接使用文本，如："玻璃"、"硅胶"...）
        brand: '',           // 品牌
        model: '',           // 型号
        remark: ''           // 备注
      },

      num: 1,                // 商品数量
      picSource: 1            // 1.本地 2.图库
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  min-width: 1080px;
}
.title-wrapper {
  height: 54px;
  line-height: 54px;
  padding: 0 90px;
  box-shadow: 0px 1px 6px 0px rgba(37, 132, 249, 0.08);
}
.goodsinfo-wrapper {
  padding: 0 140px;
  min-height: 550px;
}
.opr-item {
  margin-top: 24px;
  .opr-lable {
    padding-right: 15px;
    float: left;
    color: #6d7585;
    font-size: 14px;
    width: 75px;
    text-align: right;
    line-height: 38px;
  }
  .opr-value {
    float: left;
    color: #49505e;
    font-size: 14px;
  }

  .opr-suffix {
    float: left;
    color: #49505e;
    font-size: 14px;
    line-height: 38px;
    padding-left: 14px;
  }
}
.opr-item.pic-source {
  .opr-value {
    line-height: 38px;
  }
}
.button-group-wrapper {
  text-align: center;
  padding: 15px 0;
  box-shadow: 0px -1px 6px 0px rgba(37, 132, 249, 0.08);
  margin-top: 37px;
}
</style>
