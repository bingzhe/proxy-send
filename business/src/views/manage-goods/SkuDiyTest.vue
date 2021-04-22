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
        <div>
          <div class="opr-lable">背部图片</div>
          <sl-upload
            class="outline-uploader"
            :type="4"
            :get-file="true"
            @get-file="handleGetuploadFile($event, 'back')"
          >
            <el-input v-model="back.ori_name" readonly placeholder="请选择DIY图片" />
          </sl-upload>
        </div>
        <div v-if="posList.indexOf('left') !== -1">
          <div class="opr-lable">左侧图片</div>
          <sl-upload
            class="outline-uploader"
            :type="4"
            :get-file="true"
            @get-file="handleGetuploadFile($event, 'left')"
          >
            <el-input v-model="left.ori_name" readonly placeholder="请选择DIY图片" />
          </sl-upload>
        </div>
        <div v-if="posList.indexOf('right') !== -1">
          <div class="opr-lable">右侧图片</div>
          <sl-upload
            class="outline-uploader"
            :type="4"
            :get-file="true"
            @get-file="handleGetuploadFile($event, 'right')"
          >
            <el-input v-model="right.ori_name" readonly placeholder="请选择DIY图片" />
          </sl-upload>
        </div>
        <div v-if="posList.indexOf('top') !== -1">
          <div class="opr-lable">顶部图片</div>
          <sl-upload
            class="outline-uploader"
            :type="4"
            :get-file="true"
            @get-file="handleGetuploadFile($event, 'top')"
          >
            <el-input v-model="top.ori_name" readonly placeholder="请选择DIY图片" />
          </sl-upload>
        </div>
        <div v-if="posList.indexOf('bottom') !== -1">
          <div class="opr-lable">底部图片</div>
          <sl-upload
            class="outline-uploader"
            :type="4"
            :get-file="true"
            @get-file="handleGetuploadFile($event, 'bottom')"
          >
            <el-input v-model="bottom.ori_name" readonly placeholder="请选择DIY图片" />
          </sl-upload>
        </div>
      </div>

      <div v-show="picSource === 1" class="color-diy-wrapper clearfix">
        <div class="pic-list-wrapper">
          <div class="pic-list-title">选择边框颜色</div>
          <div
            v-for="(item, index) in opt_color_list"
            :key="index"
            class="pic-item"
            :class="{ active: curPic === index }"
            @click="handlerPicItemClick(item, index)"
          >
            <el-button type="small">{{ item.color_name }}</el-button>
          </div>
        </div>
        <div class="diy-content-wrapper">
          <div class="diy-designer-wrapper">
            <DesignerControl ref="designerControl" :curPic="curPic" :posList="posList" />
          </div>
          <div class="button-group">
            <el-button type="text" @click="handlerPreviewClick">预览</el-button>
          </div>
        </div>
      </div>

      <material-list v-if="picSource === 2" @on-select="selectMaterialPic" />
    </div>
    <div class="button-group-wrapper">
      <el-button @click="handlerCancelClick">取消</el-button>
      <el-button type="primary" @click="handlerAddCartClick">下一步:提交订单</el-button>
    </div>

    <el-dialog
      class="preview-dialog preview-pic-wrapper"
      :visible.sync="dialogVisible"
      title="预览图"
      width="80vw"
      top="6vh"
      @close="handlePreviewDialogClose"
    >
      <div class="preview-img-wrapper">
        <div class="img-wrapper">
          <div class="pic-title">背部</div>
          <img :src="preview_img_data_back" alt />
        </div>
        <div v-if="preview_img_data_left" class="img-wrapper">
          <div class="pic-title">左侧</div>
          <img :src="preview_img_data_left" alt />
        </div>
        <div v-if="preview_img_data_right" class="img-wrapper">
          <div class="pic-title">右侧</div>
          <img :src="preview_img_data_right" alt />
        </div>
        <div v-if="preview_img_data_top" class="img-wrapper">
          <div class="pic-title">顶部</div>
          <img :src="preview_img_data_top" alt />
        </div>
        <div v-if="preview_img_data_bottom" class="img-wrapper">
          <div class="pic-title">底部</div>
          <img :src="preview_img_data_bottom" alt />
        </div>
      </div>
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
import DesignerControl from './designernew/DesignerControl'
import Http from '@/config/encsubmit'

export default {
  components: {
    BaseinfoTitle,
    SkuBaseinfo,
    MaterialList,
    SlUpload,
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

      picSource: 1, // 1.本地 2.图库

      curPic: 0, // 底图颜色index
      opt_color_list: [
        // {
        //   color_img: '',
        //   color_img_url: '',
        //   color_name: '',
        //   inventory: 10       // 库存
        // }
      ],

      posList: ['back'], // 设计器渲染的位置

      // 图片预览
      preview_img_data_back: '',
      preview_img_data_left: '',
      preview_img_data_right: '',
      preview_img_data_top: '',
      preview_img_data_bottom: '',

      dialogVisible: false,

      loading: false,
      loadingTipText: '正在合成',

      back: {
        ori_user_img_data: '', // 上传的图片数据
        ori_name: '', // 上传图片名称
        ori_user_img: '' // 图库选择的图片
      },

      left: {
        ori_user_img_data: '', // 上传的图片数据
        ori_name: '', // 上传图片名称
        ori_user_img: '' // 图库选择的图片
      },
      right: {
        ori_user_img_data: '',
        ori_name: '', // 上传图片名称
        ori_user_img: '' // 上传图片名称
      },
      top: {
        ori_user_img_data: '',
        ori_name: '', // 上传图片名称
        ori_user_img: '' // 上传图片名称
      },
      bottom: {
        ori_user_img_data: '',
        ori_name: '', // 上传图片名称
        ori_user_img: '' // 上传图片名称
      },

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

        return item
      })

      const printParam = {
        back: info.img_print_param,
        left: info.img_print_param_left,
        right: info.img_print_param_right,
        top: info.img_print_param_top,
        bottom: info.img_print_param_bottom
      }
      info.printParam = printParam

      if (printParam.left.width && printParam.left.height) {
        this.posList.push('left')
      }
      if (printParam.right.width && printParam.right.height) {
        this.posList.push('right')
      }
      if (printParam.top.width && printParam.top.height) {
        this.posList.push('top')
      }
      if (printParam.bottom.width && printParam.bottom.height) {
        this.posList.push('bottom')
      }

      this.maxInventory = ((this.opt_color_list || [])[this.curPic] || {}).inventory

      this.$nextTick(async () => {
        this.$refs.designerControl.updateData(info)
        // this.$refs.diyDesigner.init()
      })
    },
    handleGetuploadFile({ file }, type) {
      const _this = this
      const fr = new FileReader()

      fr.onload = function () {
        _this[type].ori_user_img_data = fr.result
        _this[type].ori_name = file.name

        _this.$refs.designerControl.addOriginImg(fr.result, type)
      }

      fr.readAsDataURL(file)
    },
    async handlerPicItemClick(item, i) {
      this.maxInventory = item.inventory
      this.curPic = i
    },
    async handlerAddCartClick() {
      if (!this.back.ori_user_img && !this.back.ori_user_img_data) {
        this.$message.error('背部DIY照片不能为空，请先上传或者选择')
        return
      }

      this.loading = true
      this.loadingTipText = '正在提交'

      const picObj = {
        back: {},
        left: {},
        right: {},
        top: {},
        bottom: {}
      }

      const previewRes = await this.$refs.designerControl.previewAll()
      const preview_img_data = previewRes.preview_img_data
      const prune_img_data = previewRes.prune_img_data
      console.log({ previewRes })

      const allPosList = ['back', 'left', 'right', 'top', 'bottom']
      for (const pos of allPosList) {
        if (preview_img_data[pos]) {
          picObj[pos].preview_img = await this.imgUpload(preview_img_data[pos], 5)
          picObj[pos].prune_img = await this.imgUpload(prune_img_data[pos], 6)
          picObj[pos].ori_user_img = this[pos].ori_user_img
        } else {
          picObj[pos].preview_img = ''
          picObj[pos].prune_img = ''
          picObj[pos].ori_user_img = ''
        }
      }

      /**
       * 本地选择的图片需要先上传
       */
      if (this.picSource === 1) {
        for (const pos of allPosList) {
          if (preview_img_data[pos]) {
            picObj[pos].ori_user_img = await this.imgUpload(this[pos].ori_user_img_data, 4)
          }
        }
      }

      const data = {
        opr: 'put_to_buycart_diy',
        goods_id: this.goodsInfo.goods_id, // 商品编号(ID)
        num: this.num, // 订购数量
        color: this.opt_color_list[this.curPic].color_name, // 颜色分类("红色"、"绿色"...)
        preview_img: picObj.back.preview_img, // 经过设计器修整后的用户图（且和轮廓图合并后的图）（预览图）
        prune_img: picObj.back.prune_img, // 经过设计器修整后的用户图（已缩放、旋转，但不包含轮廓）
        ori_user_img: picObj.back.ori_user_img, // 用户上传的未经处理的原图
        left: picObj.left,
        right: picObj.right,
        top: picObj.top,
        bottom: picObj.bottom
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
    // 点击切换按钮的时候重置数据
    handlerPicSourceChange() {
      this.$refs.designerControl.removeAllOriginImg()
      this.posList.forEach((pos) => {
        this[pos].ori_user_img = ''
        this[pos].ori_user_img_data = ''
        this[pos].ori_name = ''
      })
    },
    selectMaterialPic(item) {
      this.back.ori_user_img = item.material_img
      this.left.ori_user_img = item.material_img_left
      this.right.ori_user_img = item.material_img_right
      this.top.ori_user_img = item.material_img_top
      this.bottom.ori_user_img = item.material_img_bottom

      this.$refs.designerControl.addAllOriginImg(item)
      this.picSource = 1
    },
    async handlerPreviewClick() {
      if (!this.back.ori_user_img && !this.back.ori_user_img_data) {
        this.$message.error('背部DIY照片不能为空，请先上传或者选择')
        return
      }

      this.loading = true
      this.loadingTipText = '正在合成'
      const previewRes = await this.$refs.designerControl.previewAll()
      this.loading = false

      const preview_img_data = previewRes.preview_img_data
      // const prune_img_data = previewRes.prune_img_data

      // 预览弹窗图片赋值
      this.posList.forEach((pos) => {
        if (preview_img_data[pos]) {
          this[`preview_img_data_${pos}`] = preview_img_data[pos]
        }
      })

      this.dialogVisible = true
    },
    handlePreviewDialogClose() {
      this.posList.forEach((pos) => {
        this[`preview_img_data_${pos}`] = ''
      })
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
  display: flex;
  .opr-value {
    width: 520px;
    margin-right: 14px;
  }
  .outline-uploader {
    float: left;
    margin-right: 14px;
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
  padding-left: 110px;
  position: relative;
}
.pic-list-wrapper {
  text-align: center;
  width: 110px;
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
/deep/ .preview-dialog {
  // .el-dialog__header {
  // background: rgba(176, 204, 177, 0.51);
  // }
  .el-dialog__body {
    text-align: center;
    max-height: 80vh;
    // background: rgba(176, 204, 177, 0.51);

    .preview-img-wrapper {
      display: flex;
      justify-content: space-around;
      // .img-wrapper {
      // width: 60%;
      // }
    }
  }
}
/deep/ .preview-pic-wrapper {
  .el-dialog__body {
    max-height: 80vh;
    text-align: center;

    .pic-title {
      font-size: 16px;
      margin-bottom: 10px;
      font-weight: bold;
    }
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
