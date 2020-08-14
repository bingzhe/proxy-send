<template>
  <div class="app-container">
    <div class="title-wrapper">
      <baseinfo-title color="#FB7474" text="编辑商品" />
    </div>
    <div class="goodsinfo-wrapper">
      <sku-baseinfo :goods-info="goodsInfo" />
      <!-- 订购数量： -->
      <div class="opr-item clearfix">
        <div class="opr-lable">订购数量</div>
        <div class="opr-value">
          <el-input-number v-model="num" controls-position="right" :min="1" :max="maxInventory" />
        </div>
        <div class="opr-suffix">件</div>
      </div>

      <!-- 颜色分类： -->
      <div class="opr-item clearfix">
        <div class="opr-lable">颜色分类</div>
        <div class="opr-value pic-list-wrapper clearfix">
          <div
            v-for="(item, index) in opt_color_list"
            :key="index"
            class="pic-item"
            :class="{'active': curPic === index}"
          >
            <div class="pic-wrapper" @click="handlerPicItemClick(item, index)">
              <img :src="item.color_img_url" />
            </div>
            <div class="color_name">{{ item.color_name }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="button-group-wrapper">
      <el-button @click="handlerCancelClick">取消</el-button>
      <el-button type="primary" @click="handlerAddCartClick">下一步:提交订单</el-button>
    </div>
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import SkuBaseinfo from './components/SkuBaseinfo'
import { goodsGet, buycartSave } from '@/api/api'
import { mapState } from 'vuex'

export default {
  components: {
    BaseinfoTitle,
    SkuBaseinfo
  },

  data() {
    return {
      token: window.Store.GetGlobalData('token'),

      goodsInfo: {
        goods_id: '', // 商品编号(ID)（空时为新建）
        goods_name: '', // 商品名称
        price: '', // 商品价格（元）
        raw_material: '', // 材质（直接使用文本，如："玻璃"、"硅胶"...）
        brand: '', // 品牌
        model: '', // 型号
        remark: '' // 备注
      },

      num: 1, // 商品数量
      maxInventory: 9999, // 计数器最大数量
      curPic: 0, // 底图颜色index
      // 底图颜色
      opt_color_list: [
        // {
        //   color_img: '',
        //   color_img_url: '',
        //   color_name: '',
        //   inventory: 10       // 库存
        // }
      ]
    }
  },
  computed: {
    ...mapState({
      buycart_id: (state) => state.user.buycart_id
    })
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

      this.opt_color_list = (info.opt_color_list || []).map((item) => {
        item.color_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&width=120&height=180&type=7&img_name=${item.color_img}`
        return item
      })

      this.maxInventory = ((this.opt_color_list || [])[this.curPic] || {}).inventory
    },
    handlerPicItemClick(item, i) {
      this.maxInventory = item.inventory
      this.curPic = i
    },
    handlerCancelClick() {
      this.$router.go(-1)
    },
    async handlerAddCartClick() {
      const data = {
        opr: 'put_to_buycart_standard',
        goods_id: this.goodsInfo.goods_id, // 商品编号(ID)
        num: this.num, // 订购数量
        color: this.opt_color_list[this.curPic].color_name // 颜色分类("红色"、"绿色"...)
      }

      if (this.buycart_id) {
        data.buycart_id = this.buycart_id
      }

      console.log('标品加入购物车', data)
      const resp = await buycartSave(data)
      console.log('标品加入购物车', resp)

      if (resp.ret !== 0) return

      /**
       * 更新页面全局数据
       */
      this.$store.dispatch('user/getUserInfo')
      this.$router.push('/manage-goods/shopcart')
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

  // .baseinfo-wrapper {
  //   padding: 30px 0 10px;
  //   border-bottom: 1px solid #eff4f9;

  //   .baseinfo {
  //     margin-bottom: 20px;
  //     .base-label {
  //       display: inline-block;
  //       width: 75px;
  //       text-align: right;
  //       color: #6d7585;
  //       font-size: 14px;
  //     }
  //     .base-value {
  //       color: #49505e;
  //       font-size: 14px;

  //       &.price {
  //         font-size: 16px;
  //         color: #fd7474;
  //       }
  //     }
  //   }
  // }

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
          border: 2px solid #fd7474;
        }
        .color_name {
          color: #fd7474;
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
