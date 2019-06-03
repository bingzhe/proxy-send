<template>
  <div class="app-container">
    <div class="title-wraper">
      <baseinfo-title color="#FB7474" text="新增订单" />
    </div>
    <div class="goodsinfo-wrapper">
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

      <!-- 订购数量： -->
      <div class="opr-item clearfix">
        <div class="opr-lable">订购数量：</div>
        <div class="opr-value">
          <el-input-number v-model="num" controls-position="right" :min="1" />
        </div>
        <div class="opr-suffix">件</div>
      </div>

      <!-- 颜色分类： -->
      <div class="opr-item clearfix">
        <div class="opr-lable">颜色分类：</div>
        <div class="opr-value pic-list-wrapper clearfix">
          <div
            v-for="(item, index) in opt_color_list"
            :key="index"
            class="pic-item"
            :class="{'active': curPic === index}"
          >
            <div class="pic-wrapper" @click="handlerPicItemClick(index)">
              <img :src="item.color_img_url">
            </div>
            <div class="color_name">{{ item.color_name }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="button-group-wrapper">
      <el-button>取消</el-button>
      <el-button type="primary">下一步:提交订单</el-button>
    </div>
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import { goodsGet } from '@/api/api'

export default {
  components: {
    BaseinfoTitle
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
      num: 1,                 // 商品数量
      curPic: 0,              // 底图颜色index
      // 底图颜色
      opt_color_list: []
    }
  },
  mounted() {
    this.goodsInfo.goods_id = this.$route.params.goods_id
    this.getGoodsInfo()
  },
  methods: {
    async getGoodsInfo() {
      const data = {
        opr: 'get_goods_info',
        goods_id: this.goodsInfo.goods_id
      }

      const resp = await goodsGet(data)
      console.log('商品信息 res=>', resp)

      if (resp.ret !== 0) return

      const info = resp.data.info

      this.goodsInfo.goods_name = info.goods_name
      this.goodsInfo.raw_material = info.raw_material
      this.goodsInfo.brand = info.brand_name
      this.goodsInfo.model = info.model_name
      this.goodsInfo.price = info.price
      this.goodsInfo.remark = info.remark

      this.opt_color_list = (info.opt_color_list || []).map(item => {
        item.color_img_url = `${
          process.env.VUE_APP_BASEURL
        }/img_get.php?token=${this.token}&opr=get_img&type=1&img_name=${
          item.color_img
        }`
        return item
      })
    },
    handlerPicItemClick(i) {
      this.curPic = i
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
.title-wraper {
  height: 54px;
  line-height: 54px;
  padding: 0 90px;
  box-shadow: 0px 1px 6px 0px rgba(37, 132, 249, 0.08);
}
.goodsinfo-wrapper {
  padding: 0 140px;
  min-height: 550px;

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

  .opr-item {
    margin-top: 24px;
    .opr-lable {
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

  .pic-list-wrapper {
    .pic-item {
      margin-right: 20px;
      float: left;
      .pic-wrapper {
        width: 120px;
        height: 180px;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .color_name {
        font-size: 14px;
        text-align: center;
        color: #49505e;
        height: 38px;
        line-height: 38px;
      }
      &.active {
        .pic-wrapper {
          border: 1px solid #fd7474;
        }
      }
    }
  }
}

.button-group-wrapper {
  text-align: center;
  padding: 15px 0;
  box-shadow: 0px -1px 6px 0px rgba(37, 132, 249, 0.08);
}
</style>
