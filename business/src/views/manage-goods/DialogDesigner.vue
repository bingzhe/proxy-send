<template>
  <sl-dialog ref="dialogDesigner" title="设计器" :showFooter="false" :showClose="false" :closeOnClickModal="false" :closeOnPressEscape="false" :validate="true" top="5vh" width="750px">
    <div class="dialog-designer-content">
      <div class="diy-designer-wrapper">
        <DiyDesigner ref="diyDesigner" :height="picHeight" :width="picWidth" :radius="picRadius" @preview-success="handlerPreviewSuc" />
      </div>
    </div>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import Http from '@/config/encsubmit'
import DiyDesigner from './PictureDesigner'
import { mapState } from 'vuex'

export default {
  components: {
    SlDialog,
    DiyDesigner
  },
  props: {
    designerGoods: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isEditShopcartGoods: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      token: window.Store.GetGlobalData('token'),
      url: process.env.VUE_APP_BASEURL + '/img_save.php',

      num: 1, // 商品数量

      ori_user_img: '', // 用户上传的未经处理的原图
      prune_img: '', // 经过设计器修整后的用户图（已缩放、旋转，但不包含轮廓）
      preview_img: '', // 经过设计器修整后的用户图（且和轮廓图合并后的图）（预览图）

      ori_user_img_url: '',
      outline_img_url: '', // 轮廓
      color_img_url: '', // 底图
      preview_img_url: '',
      prune_img_rul: '',

      picSource: 1, // 1.本地 2.图库
      // showPicList: false, // 是否显示图库
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

      loading: false,
      loadingTipText: '正在合成',

      // 图片base64数据
      ori_user_img_data: '',
      prune_img_data: '',
      preview_img_data: '',

      index_id: '' // 编辑完成之后，更新数据需要用的index_id
    }
  },
  computed: {
    ...mapState({
      buycart_id: (state) => state.user.buycart_id
    })
  },
  watch: {
    designerGoods: {
      handler: function(val) {
        // console.log('设计器处理的goods', val)
        if (JSON.stringify(val) === '{}') return

        this.picHeight = (val.img_print_param || {}).height
        this.picWidth = (val.img_print_param || {}).width
        this.picRadius = (val.img_print_param || {}).radius_adjius
        this.opt_color_list = (val.opt_color_list || []).map((item, index) => {
          item.color_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=7&img_name=${item.color_img}`
          item.outline_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=3&img_name=${item.outline_img}`
          if (this.curPic === index) {
            this.color_img_url = item.color_img_url
            this.outline_img_url = item.outline_img_url
          }
          return item
        })
        if (this.isEditShopcartGoods) {
          const ori_user_img = val.ori_user_img
          this.ori_user_img = ori_user_img
          this.ori_user_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=1&img_name=${ori_user_img}`
          this.num = val.num
          this.index_id = val.index_id
          this.curPic = (val.opt_color_list || []).findIndex((item) => item.color_name === val.color)
        }
        this.$nextTick(async () => {
          this.$refs.diyDesigner.init()
          /**
           * 默认选中第一张地图
           */
          await this.$refs.diyDesigner.addOutline(this.outline_img_url)
          await this.$refs.diyDesigner.addColorImg(this.color_img_url)
          /**
           * 回显ori_user_img
           */
          if (this.isEditShopcartGoods && this.ori_user_img_url) {
            this.$refs.diyDesigner.addOriginImg(this.ori_user_img_url)
          }
        })
      },
      deep: true
    }
  },
  methods: {
    show() {
      this.$refs.dialogDesigner.show()
    },
    handleDialogClose() {
      this.$refs.diyDesigner.disposeCanvas()
      this.ori_user_img = '' // 用户上传的未经处理的原图
      this.ori_user_img_url = ''
      this.prune_img = '' // 经过设计器修整后的用户图（已缩放、旋转，但不包含轮廓）
      this.preview_img = '' // 经过设计器修整后的用户图（且和轮廓图合并后的图）（预览图）
      this.$refs.dialogDesigner.hide()
      this.$emit('dialog-designer-close')
    },
    handlerPreviewSuc({ preview_img_data, prune_img_data }) {
      this.preview_img_data = preview_img_data
      this.prune_img_data = prune_img_data
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
    async handleConfirmClick() {
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
      if (this.picSource === 1 && this.ori_user_img_data) {
        this.ori_user_img = await this.imgUpload(this.ori_user_img_data, 4)
      }

      this.preview_img = await this.imgUpload(this.preview_img_data, 5)
      this.prune_img = await this.imgUpload(this.prune_img_data, 6)

      const data = {
        opr: 'put_to_buycart_diy',
        goods_id: this.designerGoods.goods_id, // 商品编号(ID)
        num: 1, // 订购数量
        color: this.opt_color_list[this.curPic].color_name, // 颜色分类("红色"、"绿色"...)
        preview_img: this.preview_img, // 经过设计器修整后的用户图（且和轮廓图合并后的图）（预览图）
        prune_img: this.prune_img, // 经过设计器修整后的用户图（已缩放、旋转，但不包含轮廓）
        ori_user_img: this.ori_user_img // 用户上传的未经处理的原图
      }

      if (this.buycart_id) {
        data.buycart_id = this.buycart_id
      }

      /**
       *
       * 接口更新
       */
      //   console.log('diy加入购物车', data)
      //   const resp = await buycartSave(data)
      //   console.log('diy加入购物车', resp)
      //   this.loading = false
      //   if (resp.ret !== 0) return

      //   this.$emit('diy-select-suc')

      this.handleDialogClose()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 10px 20px;
}

.color-diy-wrapper {
  min-width: 600px;
  min-height: 465px;
  border-radius: 2px;
}

.diy-content-wrapper {
  position: relative;
  // .diy-designer-wrapper {}
}

.dialog-designer-content {
  display: flex;

  .left-content {
    position: relative;
    width: 49%;
  }
  .right-content {
    width: 50%;
  }
}

.button-group {
  position: absolute;
  bottom: 100px;
  right: 20px;
  left: 0;
  text-align: right;
  .el-button {
    width: 100px;
  }
  .el-button + .el-button {
    margin-left: 30px;
  }
}
</style>
