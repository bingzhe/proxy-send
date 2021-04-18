<template>
  <div>
    <DiyDesigner ref="diyDesigner" :height="picHeight" :width="picWidth" :radius="picRadius" @preview-success="handlerPreviewSuc" />
    <!-- <DiyDesigner ref="diyDesigner" @preview-success="handlerPreviewSuc" /> -->

    <el-button @click="handlerPreviewClick">预览</el-button>
    <el-button @click="removeOriginImg">removeOriginImg</el-button>
    <el-button @click="removeOutlineImg">removeOutlineImg</el-button>
    <!-- <el-button @click="handlerPreviewClick">预览</el-button> -->
    <img :src="preview_img_data" alt="" />
    <img :src="prune_img_data" alt="" />
  </div>
</template>

<script>
import DiyDesigner from './PictureDesigner'
import { goodsGet } from '@/api/api'

export default {
  components: {
    DiyDesigner
  },
  data() {
    return {
      color_img_url: 'http://b.pso.rockyshi.cn/php/img_get.php?token=T1mcrZXEpVwIU5kI&opr=get_img&type=7&img_name=1985893923d88f9b9272cfd4fa8e552b.png',
      outline_img_url: 'http://b.pso.rockyshi.cn/php/img_get.php?token=T1mcrZXEpVwIU5kI&opr=get_img&type=3&img_name=e70fd85154b3c9985093a8dcbffe8dd4.png',
      url3: 'http://b.pso.rockyshi.cn/php/img_get.php?token=T1mcrZXEpVwIU5kI&opr=get_img&type=1&img_name=7bde61719434db210bbab019f801f56f.jpg',

      printParam: {
        height: 1842,
        pos: 2,
        radius: 184,
        radius_adjius: 92,
        width: 826,
        x_offset: 39,
        y_offset: 37
      },
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
      const initData = {
        backParam: info.img_print_param,
        leftParam: info.img_print_param_left,
        rightParam: info.img_print_param_right,
        topParam: info.img_print_param_bottom,
        bottomParam: info.img_print_param_top
      }

      this.$nextTick(async () => {
        this.$refs.diyDesigner.setInitData(initData)
        this.$refs.diyDesigner.setPosition()
        this.$refs.diyDesigner.init()

        /**
         * 默认选中第一张地图
         */
        await this.$refs.diyDesigner.addColorImg(this.color_img_url)
        // // console.log(this.outline_img_url)
        // await this.$refs.diyDesigner.addOutline(this.outline_img_url)

        // await this.$refs.diyDesigner.addOriginImg(this.url3)
      })
    },
    // init() {
    //   this.$nextTick(async () => {
    //     this.$refs.diyDesigner.init()

    //     /**
    //      * 默认选中第一张地图
    //      */
    //     await this.$refs.diyDesigner.addColorImg(this.color_img_url)
    //     // console.log(this.outline_img_url)
    //     await this.$refs.diyDesigner.addOutline(this.outline_img_url)

    //     await this.$refs.diyDesigner.addOriginImg(this.url3)
    //   })
    // },
    async handlerPreviewClick() {
      //   this.loading = true
      //   this.loadingTipText = '正在合成'
      await this.$refs.diyDesigner.preview()
      //   this.loading = false
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
    }
  }
}
</script>
