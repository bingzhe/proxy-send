<template>
  <sl-dialog
    ref="dialogDesigner"
    title="设计器"
    :showFooter="true"
    :showClose="false"
    :closeOnClickModal="false"
    :closeOnPressEscape="false"
    :validate="true"
    top="5vh"
    width="90vw"
    @close="handleDialogClose"
  >
    <div class="opr-item clearfix pic-source">
      <div class="opr-lable">图片来源</div>
      <div class="opr-value">
        <el-radio-group v-model="picSource" @change="handlerPicSourceChange">
          <el-radio :label="1">本地图片</el-radio>
          <el-radio :label="2">图库来源</el-radio>
        </el-radio-group>
      </div>
    </div>

    <div v-show="picSource === 1" class="upload-img-wrapper opr-item clearfix">
      <div class="opr-lable">选择图片</div>
      <div class="opr-value">
        <el-input v-model="ori_user_img" placeholder="请选择DIY图片" />
      </div>
      <sl-upload class="outline-uploader" :type="4" :get-file="true" @get-file="handlerGetUploadFile">
        <el-button type="primary">选择</el-button>
      </sl-upload>
    </div>

    <div v-show="picSource === 1 || !showPicList" class="color-diy-wrapper clearfix">
      <div class="pic-list-wrapper">
        <div class="pic-list-title">选择边框颜色</div>
        <div v-for="(item, index) in opt_color_list" :key="index" class="pic-item" :class="{ active: curPic === index }" @click="handlerPicItemClick(item, index)">
          <el-button>{{ item.color_name }}</el-button>
        </div>
      </div>
      <div class="diy-content-wrapper">
        <div class="diy-designer-wrapper">
          <DiyDesigner ref="diyDesigner" :height="picHeight" :width="picWidth" :radius="picRadius" @preview-success="handlerPreviewSuc" />
        </div>
        <div class="button-group">
          <el-button v-if="picSource === 2" type="text" @click="showPicList = true">返回图库</el-button>
          <br />
          <el-button :disabled="!ori_user_img" type="text" @click="handlerPreviewClick">预览</el-button>
        </div>
      </div>
    </div>

    <material-list v-if="picSource === 2 && showPicList" @on-select="selectMaterialPic" />

    <el-dialog class="preview-dialog preview-pic-wrapper" :visible.sync="dialogVisible" title="预览图">
      <div class="img-wrapper">
        <img :src="dialogImageUrl" alt />
      </div>
    </el-dialog>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import { mapState } from 'vuex'
import SlUpload from '@/components/upload/index'
import DiyDesigner from '../PictureDesigner'
import Http from '@/config/encsubmit'
import MaterialList from '../components/MaterialList'

export default {
  components: {
    SlDialog,
    DiyDesigner,
    SlUpload,
    MaterialList
  },
  data() {
    return {
      token: window.Store.GetGlobalData('token'),
      url: process.env.VUE_APP_BASEURL + '/img_save.php',

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
      preview_img_data: ''
    }
  },
  computed: {
    ...mapState({
      buycart_id: (state) => state.user.buycart_id
    })
  },
  methods: {
    show() {
      this.$refs.dialogDesigner.show()
    },
    close() {
      this.$refs.dialogDesigner.hide()
    },
    handleDialogClose() {
      console.log('close')
    },
    handlerPicSourceChange() {
      if (this.picSource === 2) {
        this.showPicList = true
      }
      this.$refs.diyDesigner.removeOriginImg()
      this.ori_user_img = ''
      this.ori_user_img_data = ''
      // this.outline_img_url = ''
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
        _this.$refs.diyDesigner.addOriginImg(fr.result)
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
      this.$refs.diyDesigner.removeOriginImg()

      await this.$refs.diyDesigner.addOutline(this.outline_img_url)
      await this.$refs.diyDesigner.addColorImg(this.color_img_url)

      // await this.$refs.diyDesigner.addColorImg(require('@/assets/images/color.png'))
      // await this.$refs.diyDesigner.addOutline(require('@/assets/images/outline.png'))

      this.$refs.diyDesigner.addOriginImgAgain()
      this.$refs.diyDesigner.renderAll()
    },
    handlerPreviewSuc({ preview_img_data, prune_img_data }) {
      this.preview_img_data = preview_img_data
      this.prune_img_data = prune_img_data
      this.dialogImageUrl = this.preview_img_data

      if (this.isShowDialog) {
        this.dialogVisible = true
      }
    },
    async handlerPreviewClick() {
      this.loading = true
      this.loadingTipText = '正在合成'
      await this.$refs.diyDesigner.preview()
      this.loading = false
    },
    selectMaterialPic(img) {
      this.ori_user_img = img.material_img
      this.ori_user_img_url = img.material_img_url_ori
      this.showPicList = false
      this.$refs.diyDesigner.addOriginImg(this.ori_user_img_url)
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
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 10px 20px;
}
.opr-item {
  margin-bottom: 18px;
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
.upload-img-wrapper {
  margin-bottom: 18px;
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
</style>
