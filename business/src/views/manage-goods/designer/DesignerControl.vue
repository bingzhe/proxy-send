<template>
  <div>
    <div class="designer-list">
      <PictureDesigner
        ref="topDesigner"
        namePrefix="top"
        :scale="scale"
        :height="topParam.height"
        :width="topParam.width"
        :radius="topParam.radius_adjius"
        :canvasHeight="topParam.canvasHeight"
        :canvasWidth="topParam.canvasWidth"
      />
    </div>
    <div class="designer-list">
      <PictureDesigner
        ref="leftDesigner"
        namePrefix="left"
        :scale="scale"
        :height="leftParam.height"
        :width="leftParam.width"
        :radius="leftParam.radius_adjius"
        :canvasHeight="leftParam.canvasHeight"
        :canvasWidth="leftParam.canvasWidth"
      />
      <PictureDesigner
        ref="backDesigner"
        namePrefix="back"
        :scale="scale"
        :height="backParam.height"
        :width="backParam.width"
        :radius="backParam.radius_adjius"
        :canvasHeight="backParam.canvasHeight"
        :canvasWidth="backParam.canvasWidth"
      />
      <PictureDesigner
        ref="rightDesigner"
        namePrefix="right"
        :scale="scale"
        :height="rightParam.height"
        :width="rightParam.width"
        :radius="rightParam.radius_adjius"
        :canvasHeight="rightParam.canvasHeight"
        :canvasWidth="rightParam.canvasWidth"
      />
    </div>
    <div class="designer-list">
      <PictureDesigner
        ref="bottomDesigner"
        namePrefix="bottom"
        :scale="scale"
        :height="bottomParam.height"
        :width="bottomParam.width"
        :radius="bottomParam.radius_adjius"
        :canvasHeight="bottomParam.canvasHeight"
        :canvasWidth="bottomParam.canvasWidth"
      />
    </div>
  </div>
</template>

<script>
import PictureDesigner from './PictureDesigner'

export default {
  components: {
    PictureDesigner
  },
  data() {
    return {
      opt_color_list: [],
      opt_color: {},

      scale: 1,

      backParam: {
        height: '',
        width: '',
        radius_adjius: '',
        canvasHeight: '',
        canvasWidth: ''
      },

      leftParam: {
        height: '',
        width: '',
        radius_adjius: '',
        canvasHeight: '',
        canvasWidth: ''
      },

      rightParam: {
        height: '',
        width: '',
        radius_adjius: '',
        canvasHeight: '',
        canvasWidth: ''
      },

      topParam: {
        height: '',
        width: '',
        radius_adjius: '',
        canvasHeight: '',
        canvasWidth: ''
      },

      bottomParam: {
        height: '',
        width: '',
        radius_adjius: '',
        canvasHeight: '',
        canvasWidth: ''
      }
    }
  },
  methods: {
    updateData(info) {
      const initData = {
        backParam: info.img_print_param,
        leftParam: info.img_print_param_left,
        rightParam: info.img_print_param_right,
        topParam: info.img_print_param_bottom,
        bottomParam: info.img_print_param_top
      }
      this.getInitData(initData)
      this.opt_color_list = info.opt_color_list

      // >>>>>>> colors
      this.opt_color = this.opt_color_list[0]

      this.$nextTick(() => {
        this.$refs.backDesigner.init()
        this.$refs.leftDesigner.init()
        this.$refs.rightDesigner.init()
        this.$refs.topDesigner.init()
        this.$refs.bottomDesigner.init()

        this.addAllColorImg()
        this.addAllOutline()

        const url3 =
          'http://b.pso.rockyshi.cn/php/img_get.php?token=T1mcrZXEpVwIU5kI&opr=get_img&type=1&img_name=7bde61719434db210bbab019f801f56f.jpg'
        this.$refs.backDesigner.addOriginImg(url3)
        this.$refs.leftDesigner.addOriginImg(url3)
        this.$refs.rightDesigner.addOriginImg(url3)
      })
    },
    getInitData(data) {
      ['backParam', 'leftParam', 'rightParam', 'topParam', 'bottomParam'].forEach((key) => {
        this[key].width = data[key].width
        this[key].height = data[key].height
        this[key].radius_adjius = data[key].radius_adjius
      })

      /**
       * 设置画布和真实图片缩放比例
       */
      const height = this.backParam.height
      if (height >= 1000 && height < 1500) {
        this.scale = 0.4
      } else if (height >= 1500) {
        this.scale = 0.3
      }

      /**
       * 计算画布尺寸
       */

      this.backParam.canvasWidth = 400 + this.backParam.width
      this.backParam.canvasHeight = 400 + this.backParam.height

      this.leftParam.canvasWidth = 400 + this.leftParam.width
      this.leftParam.canvasHeight = 400 + this.leftParam.height

      this.rightParam.canvasWidth = 400 + this.leftParam.width
      this.rightParam.canvasHeight = 400 + this.leftParam.height

      this.topParam.canvasWidth = 400 + this.topParam.width
      this.topParam.canvasHeight = 400 + this.topParam.height

      this.bottomParam.canvasWidth = 400 + this.topParam.width
      this.bottomParam.canvasHeight = 400 + this.topParam.height
    },
    addAllColorImg() {
      ['back', 'left', 'right', 'top', 'bottom'].forEach((key) => {
        if (this.opt_color[key].color_img) {
          this.$refs[`${key}Designer`].addColorImg(this.opt_color[key].color_img_url)
        }
      })
    },
    addAllOutline() {
      ['back', 'left', 'right', 'top', 'bottom'].forEach((key) => {
        if (this.opt_color[key].outline_img) {
          this.$refs[`${key}Designer`].addOutline(this.opt_color[key].outline_img_url)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.designer-list {
  display: flex;
}
</style>
