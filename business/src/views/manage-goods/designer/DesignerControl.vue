<template>
  <div>
    <div class="designer-list" :style="topBottomOffsetStyle">
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
    <div class="designer-list" :style="topBottomOffsetStyle">
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
      },

      hasback: true,
      topBottomOffsetStyle: '' // top,bottom 偏移样式
    }
  },
  computed: {
    hasleft() {
      return !!(this.leftParam.width || this.leftParam.height)
    },
    hasright() {
      return !!(this.rightParam.width || this.rightParam.height)
    },
    hastop() {
      return !!(this.topParam.width || this.topParam.height)
    },
    hasbottom() {
      return !!(this.bottomParam.width || this.bottomParam.height)
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

      this.topBottomOffsetStyle = `padding-left:${Math.round(
        this.leftParam.canvasWidth * this.scale
      )}px`
    },
    addAllColorImg() {
      ['back', 'left', 'right', 'top', 'bottom'].forEach(async (key) => {
        if (this[`has${key}`]) {
          await this.$refs[`${key}Designer`].addColorImg(this.opt_color[key].color_img_url)
        }
      })
    },
    addAllOutline() {
      ['back', 'left', 'right', 'top', 'bottom'].forEach(async (key) => {
        if (this[`has${key}`]) {
          await this.$refs[`${key}Designer`].addOutline(this.opt_color[key].outline_img_url)
        }
      })
    },
    addAllOriginImg(item) {
      ['back', 'left', 'right', 'top', 'bottom'].forEach((key) => {
        if (this[`has${key}`] && item[`material_img_${key}`]) {
          this.$refs[`${key}Designer`].addOriginImg(item[`material_img_${key}_url_ori`])
        }
      })
    },
    addOriginImg(img, type) {
      this.$refs[`${type}Designer`].addOriginImg(img)
    },
    previewAll() {
      return new Promise((resolve, reject) => {
        let backPromise, leftPromise, rightPromise, topPromise, bottomPromise
        if (this.hasback) {
          backPromise = this.$refs.backDesigner.preview()
        }
        if (this.hasleft) {
          leftPromise = this.$refs.leftDesigner.preview()
        }
        if (this.hasright) {
          rightPromise = this.$refs.rightDesigner.preview()
        }
        if (this.hastop) {
          topPromise = this.$refs.topDesigner.preview()
        }
        if (this.hasbottom) {
          bottomPromise = this.$refs.bottomDesigner.preview()
        }

        Promise.all([backPromise, leftPromise, rightPromise, topPromise, bottomPromise]).then(
          (res) => {
            console.log('PromiseAll', res)
            resolve(res)
          }
        )
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
