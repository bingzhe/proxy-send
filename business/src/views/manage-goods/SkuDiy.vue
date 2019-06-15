<template>
  <div class="app-container">
    <div class="title-wrapper">
      <baseinfo-title color="#FB7474" text="新增订单" />
    </div>

    <div class="goodsinfo-wrapper">
      <sku-baseinfo :goods-info="goodsInfo" />

      <el-row class="select-goodsnum-wrapper">
        <el-col :span="10">
          <div class="opr-item clearfix">
            <div class="opr-lable">订购数量</div>
            <div class="opr-value">
              <el-input-number
                v-model="num"
                controls-position="right"
                :min="1"
                :max="maxInventory"
              />
            </div>
            <div class="opr-suffix">件</div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="opr-item clearfix pic-source">
            <div class="opr-lable">图片来源</div>
            <div class="opr-value">
              <el-radio-group v-model="picSource">
                <el-radio :label="1">本地图片</el-radio>
                <el-radio :label="2">图库来源</el-radio>
              </el-radio-group>
            </div>
          </div>
        </el-col>
      </el-row>

      <div v-if="picSource === 1" class="upload-img-wrapper opr-item clearfix">
        <div class="opr-lable">选择图片</div>
        <div class="opr-value">
          <el-input v-model="ori_user_img" placeholder="请选择DIY图片" />
        </div>
        <sl-upload class="outline-uploader" :type="4" @on-success="handlerUploadSuc">
          <el-button type="primary">选择</el-button>
        </sl-upload>
      </div>
      <div v-if="picSource === 1" class="color-diy-wrapper clearfix">
        <div class="pic-list-wrapper">
          <div class="pic-list-title">选择边框颜色</div>
          <div
            v-for="(item, index) in opt_color_list"
            :key="index"
            class="pic-item"
            :class="{'active': curPic === index}"
            @click="handlerPicItemClick(item, index)"
          >
            <el-button>{{ item.color_name }}</el-button>
          </div>
        </div>
        <div class="diy-content-wrapper">
          <!-- 操作的图片 -->
          <img :src="ori_user_img_url" alt>
          <!-- 底图 -->
          <img :src="color_img_url" alt>
          <img src alt>
        </div>
      </div>

      <material-list v-if="picSource === 2" @on-select="selectMaterialPic" />
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
import MaterialList from './components/MaterialList'
import { goodsGet, buycartSave } from '@/api/api'
import { mapState } from 'vuex'
import SlUpload from '@/components/upload/index'

export default {
  components: {
    BaseinfoTitle,
    SkuBaseinfo,
    MaterialList,
    SlUpload
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
      maxInventory: 9999,     // 计数器最大数量

      ori_user_img: '',      // 用户上传的未经处理的原图
      ori_user_img_url: '',
      color_img_url: '',      // 底图
      picSource: 1,           // 1.本地 2.图库

      // 底图颜色
      curPic: 0,              // 底图颜色index
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
      buycart_id: state => state.user.buycart_id
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

      this.opt_color_list = (info.opt_color_list || []).map(item => {
        item.color_img_url = `${
          process.env.VUE_APP_BASEURL
        }/img_get.php?token=${this.token}&opr=get_img&type=1&img_name=${
          item.color_img
        }`
        return item
      })

      this.maxInventory = ((this.opt_color_list || [])[this.curPic] || {}).inventory
    },
    handlerUploadSuc({ img_name }) {
      this.ori_user_img = img_name
      this.ori_user_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${
        this.token
      }&opr=get_img&type=4&img_name=${this.ori_user_img}`
    },
    handlerPicItemClick(item, i) {
      this.maxInventory = item.inventory
      this.color_img_url = item.color_img_url
      this.curPic = i
    },
    async handlerAddCartClick() {
      if (!this.ori_user_img) {
        this.$message.error('DIY照片不能为空，请先上传')
        return
      }

      const data = {
        opr: 'put_to_buycart_diy',
        goods_id: this.goodsInfo.goods_id,                          // 商品编号(ID)
        num: this.num,                                              // 订购数量
        color: this.opt_color_list[this.curPic].color_name,         // 颜色分类("红色"、"绿色"...)
        preview_img: '123',                                          // 经过设计器修整后的用户图（且和轮廓图合并后的图）（预览图）
        prune_img: '123',                                             // 经过设计器修整后的用户图（已缩放、旋转，但不包含轮廓）
        ori_user_img: this.ori_user_img                                // 用户上传的未经处理的原图
      }

      if (this.buycart_id) {
        data.buycart_id = this.buycart_id
      }

      console.log('diy加入购物车', data)
      const resp = await buycartSave(data)
      console.log('diy加入购物车', resp)

      if (resp.ret !== 0) return

      /**
       * 更新页面全局数据
       */
      this.$store.dispatch('user/getUserInfo')
      this.$router.push('/manage-goods/shopcart')
    },
    handlerCancelClick() {
      this.$router.go(-1)
    },
    selectMaterialPic(img) {
      this.ori_user_img = img.material_img
      this.ori_user_img_url = img.material_img_url
      this.picSource = 1
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
.select-goodsnum-wrapper {
  margin-bottom: 24px;
}

.upload-img-wrapper {
  margin-bottom: 24px;
  .opr-value {
    width: 520px;
    margin-right: 14px;
  }
  .outline-uploader {
    float: left;
  }
  .el-button {
    padding: 11px 20px;
  }
}

.color-diy-wrapper {
  min-height: 465px;
  box-shadow: 0px 0px 6px 0px rgba(37, 132, 249, 0.15);
  border-radius: 2px;
  padding-left: 170px;
  position: relative;
}
.pic-list-wrapper {
  text-align: center;
  width: 170px;
  border-right: 1px solid #eff4f9;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  .pic-list-title {
    color: #6d7585;
    margin: 20px 0;
    font-size: 14px;
  }
  .pic-item {
    margin-bottom: 16px;
    .el-button {
      height: 38px;
      width: 90px;
      padding: 11px;
    }

    &.active {
      .el-button {
        background: rgba(222, 239, 254, 1);
        border: 1px solid rgba(37, 132, 249, 1);
        color: rgba(37, 132, 249, 1);
      }
    }
  }
}
.diy-content-wrapper {
  width: 765px;
}
</style>
