<template>
  <div>
    <!-- <Designer ref="diyDesigner" :height="picHeight" :width="picWidth" :radius="picRadius" @preview-success="handlerPreviewSuc" /> -->
    <!-- <DiyDesigner ref="diyDesigner" @preview-success="handlerPreviewSuc" /> -->

    <DesignerControl ref="designerControl" />

    <el-button @click="handlerPreviewClick">预览</el-button>
    <el-button @click="removeOriginImg">removeOriginImg</el-button>
    <el-button @click="removeOutlineImg">removeOutlineImg</el-button>

    <!-- <el-button @click="handlerPreviewClick">预览</el-button> -->
    <img :src="preview_img_data" alt="" />
    <img :src="prune_img_data" alt="" />
  </div>
</template>

<script>
import DesignerControl from './DesignerControl'
import { goodsGet } from '@/api/api'

export default {
  components: {
    DesignerControl
  },
  data() {
    return {
      token: window.Store.GetGlobalData('token'),
      color_img_url:
        'http://b.pso.rockyshi.cn/php/img_get.php?token=T1mcrZXEpVwIU5kI&opr=get_img&type=7&img_name=1985893923d88f9b9272cfd4fa8e552b.png',
      outline_img_url:
        'http://b.pso.rockyshi.cn/php/img_get.php?token=T1mcrZXEpVwIU5kI&opr=get_img&type=3&img_name=e70fd85154b3c9985093a8dcbffe8dd4.png',
      url3:
        'http://b.pso.rockyshi.cn/php/img_get.php?token=T1mcrZXEpVwIU5kI&opr=get_img&type=1&img_name=7bde61719434db210bbab019f801f56f.jpg',

      // diy裁剪尺寸
      picHeight: 1842,
      picWidth: 826,
      picRadius: 92,

      preview_img_data: '',
      prune_img_data: ''
    }
  },
  mounted() {
    // this.init()
    this.getGoodsInfo()
  },
  methods: {
    async getGoodsInfo() {
      const data = {
        opr: 'get_goods_info',
        goods_id: 'G18971'
      }
      const resp = await goodsGet(data)
      console.log(resp.data.info)
      const info = resp.data.info

      ;(info.opt_color_list || []).forEach((item) => {
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
      })
      this.$nextTick(async () => {
        this.$refs.designerControl.updateData(info)
      })
    },
    async handlerPreviewClick() {
      // console.log(1111)
      // //   this.loading = true
      // //   this.loadingTipText = '正在合成'
      const { preview_img_data, prune_img_data } = await this.$refs.designerControl.getPreviewData()
      //   this.loading = false
      this.preview_img_data = preview_img_data
      this.prune_img_data = prune_img_data

      // const prune_img_data = await this.$refs.designerControl.addOutline()
      // console.log(prune_img_data)
      // this.prune_img_data = prune_img_data
    },
    handlerPreviewSuc({ preview_img_data, prune_img_data }) {
      this.preview_img_data = preview_img_data
      this.prune_img_data = prune_img_data
      //   this.dialogImageUrl = this.preview_img_data

      //   if (this.isShowDialog) {
      //     this.dialogVisible = true
      //   }
    },
    removeOriginImg() {
      this.$refs.diyDesigner.removeOriginImg()
    },
    removeOutlineImg() {
      this.$refs.diyDesigner.removeOutlineImg()
    },
    getImgUrl(img_name, type = 1) {
      return `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=${type}&img_name=${img_name}`
    }
  }
}
</script>
