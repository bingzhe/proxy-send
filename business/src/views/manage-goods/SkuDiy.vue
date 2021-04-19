<template>
  <div class="app-container">
    <div class="title-wrapper">
      <baseinfo-title color="#FB7474" text="新增订单" />
    </div>

    <div v-loading="loading" class="goodsinfo-wrapper" :element-loading-text="loadingTipText">
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
              <el-radio-group v-model="picSource" @change="handlerPicSourceChange">
                <el-radio :label="1">本地图片</el-radio>
                <el-radio :label="2">图库来源</el-radio>
              </el-radio-group>
            </div>
          </div>
        </el-col>
      </el-row>

      <div v-show="picSource === 1" class="upload-img-wrapper opr-item clearfix">
        <div class="opr-lable">选择图片</div>
        <div class="opr-value">
          <el-input v-model="ori_user_img" placeholder="请选择DIY图片" />
        </div>
        <sl-upload
          class="outline-uploader"
          :type="4"
          :get-file="true"
          @get-file="handlerGetUploadFile"
        >
          <el-button type="primary">选择</el-button>
        </sl-upload>
      </div>

      <div v-show="picSource === 1 || !showPicList" class="color-diy-wrapper clearfix">
        <div class="pic-list-wrapper">
          <div class="pic-list-title">选择边框颜色</div>
          <div
            v-for="(item, index) in opt_color_list"
            :key="index"
            class="pic-item"
            :class="{ active: curPic === index }"
            @click="handlerPicItemClick(item, index)"
          >
            <el-button>{{ item.color_name }}</el-button>
          </div>
        </div>
        <div class="diy-content-wrapper">
          <div class="diy-designer-wrapper">
            <!-- <DiyDesigner
              ref="diyDesigner"
              :height="picHeight"
              :width="picWidth"
              :radius="picRadius"
              @preview-success="handlerPreviewSuc"
            /> -->
            <DesignerControl ref="designerControl" />
          </div>
          <div class="button-group">
            <el-button
              v-if="picSource === 2"
              type="text"
              @click="showPicList = true"
            >返回图库</el-button>
            <br />
            <el-button
              :disabled="!ori_user_img"
              type="text"
              @click="handlerPreviewClick"
            >预览</el-button>
          </div>
        </div>
      </div>

      <material-list v-if="picSource === 2 && showPicList" @on-select="selectMaterialPic" />
    </div>
    <div class="button-group-wrapper">
      <el-button @click="handlerCancelClick">取消</el-button>
      <el-button type="primary" @click="handlerAddCartClick">下一步:提交订单</el-button>
    </div>

    <el-dialog
      class="preview-dialog preview-pic-wrapper"
      :visible.sync="dialogVisible"
      title="预览图"
    >
      <!-- <div class="preview-img-wrapper"> -->
      <!-- <div class="img-wrapper">
          <div>打印图</div>
          <img :src="dialogPruneUrl" alt>
      </div>-->
      <div class="img-wrapper">
        <img :src="dialogImageUrl" alt />
      </div>
      <!-- </div> -->
    </el-dialog>
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import SkuBaseinfo from './components/SkuBaseinfo'
import MaterialList from './components/MaterialList'
import { goodsGet, buycartSave } from '@/api/api'
import { mapState } from 'vuex'
import SlUpload from '@/components/upload/index'
import DiyDesigner from './PictureDesigner'
import DesignerControl from './designer/DesignerControl'
import Http from '@/config/encsubmit'

export default {
  components: {
    BaseinfoTitle,
    SkuBaseinfo,
    MaterialList,
    SlUpload,
    DiyDesigner,
    DesignerControl
  },

  data() {
    return {
      token: window.Store.GetGlobalData('token'),
      url: process.env.VUE_APP_BASEURL + '/img_save.php',

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

      ori_user_img: '', // 用户上传的未经处理的原图
      prune_img: '', // 经过设计器修整后的用户图（已缩放、旋转，但不包含轮廓）
      preview_img: '', // 经过设计器修整后的用户图（且和轮廓图合并后的图）（预览图）

      ori_user_img_url: '',
      outline_img_url: '', // 轮廓
      color_img_url: '', // 底图
      preview_img_url: '',
      prune_img_rul: '',

      picSource: 1, // 1.本地 2.图库
      showPicList: false, // 是否显示图库
      // 底图颜色
      curPic: 0, // 底图颜色index
      opt_color_list: [
        // {
        //   color_img: '',
        //   color_img_url: '',
        //   color_name: '',
        //   inventory: 10       // 库存
        // }
      ],

      // diy裁剪尺寸
      picHeight: 0,
      picWidth: 0,
      picRadius: 0,

      // 图片预览
      dialogPruneUrl: '', // 打印
      dialogImageUrl: '', // 预览
      dialogVisible: false,
      isShowDialog: true, // 是否显示预览

      loading: false,
      loadingTipText: '正在合成',

      // 图片base64数据
      ori_user_img_data: '',
      prune_img_data: '',
      preview_img_data: '',

      opt_color: {} // 选择的底图轮廓图组
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

      this.picHeight = (info.img_print_param || {}).height
      this.picWidth = (info.img_print_param || {}).width
      this.picRadius = (info.img_print_param || {}).radius_adjius

      this.opt_color_list = (info.opt_color_list || []).map((item, index) => {
        item.color_img_url = this.getImgUrl(item.color_img, 7)
        item.outline_img_url = this.getImgUrl(item.outline_img, 3)

        item.back = {}
        item.back.color_img = item.color_img
        item.back.outline_img = item.outline_img
        item.back.color_img_url = this.getImgUrl(item.color_img, 7)
        item.back.outline_img_url = this.getImgUrl(item.outline_img, 3)
        item.left.color_img_url = this.getImgUrl(item.left.color_img, 7)
        item.left.outline_img_url = this.getImgUrl(item.left.outline_img, 3)
        item.right.color_img_url = this.getImgUrl(item.right.color_img, 7)
        item.right.outline_img_url = this.getImgUrl(item.right.outline_img, 3)
        item.top.color_img_url = this.getImgUrl(item.top.color_img, 7)
        item.top.outline_img_url = this.getImgUrl(item.top.outline_img, 3)
        item.bottom.color_img_url = this.getImgUrl(item.bottom.color_img, 7)
        item.bottom.outline_img_url = this.getImgUrl(item.bottom.outline_img, 3)

        if (this.curPic === index) {
          this.color_img_url = item.color_img_url
          this.outline_img_url = item.outline_img_url
          this.opt_color = item
        }

        return item
      })

      // this.outline_img_url = `${
      //   process.env.VUE_APP_BASEURL
      // }/img_get.php?token=${this.token}&opr=get_img&type=1&img_name=${
      //   info.outline_img
      // }`

      this.maxInventory = ((this.opt_color_list || [])[this.curPic] || {}).inventory

      this.$nextTick(async () => {
        this.$refs.designerControl.updateData(info)
        // this.$refs.diyDesigner.init()

        // /**
        //  * 默认选中第一张地图
        //  */
        // // console.log(this.outline_img_url)
        // await this.$refs.diyDesigner.addOutline(this.outline_img_url)
        // await this.$refs.diyDesigner.addColorImg(this.color_img_url)
      })
    },
    handlerGetUploadFile({ file }) {
      // this.loading = true
      // this.loadingTipText = '正在加载'

      this.ori_user_img = file.name

      const _this = this
      const fr = new FileReader()

      fr.onload = function () {
        _this.ori_user_img_data = fr.result

        // <<<<<<<<<<<<<<<<<<
        // _this.$refs.diyDesigner.addOriginImg(fr.result)
        // _this.$refs.diyDesigner.addOriginImg(require('@/assets/images/origin.jpg'))

        // _this.loading = false
      }

      fr.readAsDataURL(file)
    },
    async handlerPicItemClick(item, i) {
      this.maxInventory = item.inventory
      this.color_img_url = item.color_img_url
      this.outline_img_url = item.outline_img_url
      this.curPic = i

      // <<<<<<<<<<<<<<<<<<
      // this.$refs.diyDesigner.removeOriginImg()

      // await this.$refs.diyDesigner.addOutline(this.outline_img_url)
      // await this.$refs.diyDesigner.addColorImg(this.color_img_url)

      // await this.$refs.diyDesigner.addColorImg(require('@/assets/images/color.png'))
      // await this.$refs.diyDesigner.addOutline(require('@/assets/images/outline.png'))

      // this.$refs.diyDesigner.addOriginImgAgain()
      // this.$refs.diyDesigner.renderAll()
    },
    async handlerAddCartClick() {
      if (!this.ori_user_img) {
        this.$message.error('DIY照片不能为空，请先上传')
        return
      }

      this.loading = true
      this.loadingTipText = '正在提交'

      if (!this.preview_img) {
        this.isShowDialog = false
        await this.$refs.diyDesigner.preview()
      }

      /**
       * 本地选择的图片需要先上传
       */
      if (this.picSource === 1) {
        this.ori_user_img = await this.imgUpload(this.ori_user_img_data, 4)
      }
      this.preview_img = await this.imgUpload(this.preview_img_data, 5)
      this.prune_img = await this.imgUpload(this.prune_img_data, 6)

      const data = {
        opr: 'put_to_buycart_diy',
        goods_id: this.goodsInfo.goods_id, // 商品编号(ID)
        num: this.num, // 订购数量
        color: this.opt_color_list[this.curPic].color_name, // 颜色分类("红色"、"绿色"...)
        preview_img: this.preview_img, // 经过设计器修整后的用户图（且和轮廓图合并后的图）（预览图）
        prune_img: this.prune_img, // 经过设计器修整后的用户图（已缩放、旋转，但不包含轮廓）
        ori_user_img: this.ori_user_img // 用户上传的未经处理的原图
      }

      if (this.buycart_id) {
        data.buycart_id = this.buycart_id
      }

      console.log('diy加入购物车', data)
      const resp = await buycartSave(data)
      console.log('diy加入购物车', resp)
      this.loading = false
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
    handlerPicSourceChange() {
      if (this.picSource === 2) {
        this.showPicList = true
      }
      // this.$refs.diyDesigner.removeOriginImg()
      this.ori_user_img = ''
      this.ori_user_img_data = ''
      // this.outline_img_url = ''
    },
    selectMaterialPic(item) {
      this.ori_user_img = item.material_img
      this.ori_user_img_url = item.material_img_url_ori
      this.showPicList = false
      // this.$refs.diyDesigner.addOriginImg(this.ori_user_img_url)
      this.$refs.designerControl.addAllOriginImg(item)
    },
    async handlerPreviewClick() {
      this.loading = true
      this.loadingTipText = '正在合成'
      await this.$refs.diyDesigner.preview()
      this.loading = false
    },
    handlerPreviewSuc({ preview_img_data, prune_img_data }) {
      this.preview_img_data = preview_img_data
      this.prune_img_data = prune_img_data
      this.dialogImageUrl = this.preview_img_data

      if (this.isShowDialog) {
        this.dialogVisible = true
      }
    },
    base64ToFile(urlData) {
      var arr = urlData.split(',')
      var mime = arr[0].match(/:(.*?);/)[1] || 'image/png'
      // 去掉url的头，并转化为byte
      var bytes = window.atob(arr[1])
      // 处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length)
      // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
      var ia = new Uint8Array(ab)

      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }

      // return new Blob([ab], {
      //   type: mime
      // })
      return new File([ab], 'preview.png', {
        type: mime
      })
    },
    imgUpload(fileData, type) {
      return new Promise((resolve, reject) => {
        const file = this.base64ToFile(fileData)

        const data = {
          opr: 'save_img_file',
          type: type,
          imgfile: file
        }

        Http.EncSubmit(this.url, data, (resp) => {
          if (resp.ret !== 0) {
            reject(resp)
            return this.$message.error(resp.msg)
          }
          resolve(resp.data.img_name)
        })
      })
    },
    getImgUrl(img_name, type = 1) {
      return `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=${type}&img_name=${img_name}`
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
  min-width: 950px;
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
  position: relative;
  .diy-designer-wrapper {
    margin: 20px 0 20px 0;
  }
  .button-group {
    position: absolute;
    width: 90px;
    top: 0;
    right: 0;
  }
}
// /deep/ .preview-dialog {
//   .el-dialog__header {
//     // background: rgba(176, 204, 177, 0.51);
//   }
//   .el-dialog__body {
//     text-align: center;
//     max-height: 80vh;
//     // background: rgba(176, 204, 177, 0.51);

//     .preview-img-wrapper {
//       display: flex;
//       justify-content: center;
//       .img-wrapper {
//         width: 60%;
//         img {
//           width: 100%;
//           border: 1px solid #ccc;
//         }
//       }
//     }
//   }
// }
/deep/ .preview-pic-wrapper {
  .el-dialog__body {
    max-height: 80vh;
    text-align: center;
    padding: 0;
    img {
      max-height: 70vh;
      max-width: 70vh;
    }
  }
}
@media only screen and (max-width: 1450px) {
  .goodsinfo-wrapper {
    padding: 0 50px;
  }
}
</style>
