<template>
  <div>
    <div v-if="hastop" class="designer-list" :style="topBottomOffsetStyle">
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
    <div v-if="hasbsottom" class="designer-list" :style="topBottomOffsetStyle">
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
/* eslint-disable vue/require-default-prop */
import PictureDesigner from './PictureDesigner'

export default {
  components: {
    PictureDesigner
  },
  props: {
    curPic: Number
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
      return !!(this.leftParam.width && this.leftParam.height)
    },
    hasright() {
      return !!(this.rightParam.width && this.rightParam.height)
    },
    hastop() {
      return !!(this.topParam.width && this.topParam.height)
    },
    hasbottom() {
      return !!(this.bottomParam.width && this.bottomParam.height)
    }
  },
  watch: {
    curPic: function (val) {
      this.opt_color = this.opt_color_list[val]

      this.$nextTick(async () => {
        this.removeAllOriginImg()
        await this.addAllColorImg()
        this.allAddOriginImgAgain()
        this.allRender()
      })
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

      this.opt_color = this.opt_color_list[this.curPic]

      this.$nextTick(() => {
        this.$refs.backDesigner.init()
        this.hasleft && this.$refs.leftDesigner.init()
        this.hasright && this.$refs.rightDesigner.init()
        this.hastop && this.$refs.topDesigner.init()
        this.hasbottom && this.$refs.bottomDesigner.init()

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

      this.calculateCanvasSize(600)

      this.topBottomOffsetStyle = `padding-left:${Math.round(
        this.leftParam.canvasWidth * this.scale
      )}px`
    },
    // 计算画布尺寸
    calculateCanvasSize(base) {
      this.backParam.canvasWidth = base + this.backParam.width || 0
      this.backParam.canvasHeight = base + this.backParam.height || 0

      this.leftParam.canvasWidth = base + this.leftParam.width || 0
      this.leftParam.canvasHeight = base + this.leftParam.height || 0

      this.rightParam.canvasWidth = base + this.leftParam.width || 0
      this.rightParam.canvasHeight = base + this.leftParam.height || 0

      this.topParam.canvasWidth = base + this.topParam.width || 0
      this.topParam.canvasHeight = base + this.topParam.height || 0

      this.bottomParam.canvasWidth = base + this.topParam.width || 0
      this.bottomParam.canvasHeight = base + this.topParam.height || 0
    },
    addAllColorImg() {
      return new Promise((resolve, reject) => {
        const promiseList = []
        ;['back', 'left', 'right', 'top', 'bottom'].forEach(async (key) => {
          if (this[`has${key}`]) {
            promiseList.push(
              this.$refs[`${key}Designer`].addColorImg(this.opt_color[key].color_img_url)
            )
          }
        })
        Promise.all(promiseList)
          .then(() => {
            resolve()
          })
          .catch((e) => reject(e))
      })
    },
    addAllOutline() {
      return new Promise((resolve, reject) => {
        const promiseList = []
        ;['back', 'left', 'right', 'top', 'bottom'].forEach(async (key) => {
          if (this[`has${key}`]) {
            await this.$refs[`${key}Designer`].addOutline(this.opt_color[key].outline_img_url)
          }
        })
        Promise.all(promiseList)
          .then(() => {
            resolve()
          })
          .catch((e) => reject(e))
      })
    },
    addAllOriginImg(item) {
      return new Promise((resolve, reject) => {
        const promiseList = []
        ;['back', 'left', 'right', 'top', 'bottom'].forEach((key) => {
          if (this[`has${key}`] && item[`material_img_${key}`]) {
            this.$refs[`${key}Designer`].addOriginImg(item[`material_img_${key}_url_ori`])
          }
        })
        Promise.all(promiseList)
          .then(() => {
            resolve()
          })
          .catch((e) => reject(e))
      })
    },
    removeAllOriginImg() {
      ['back', 'left', 'right', 'top', 'bottom'].forEach(async (key) => {
        if (this[`has${key}`]) {
          await this.$refs[`${key}Designer`].removeOriginImg()
        }
      })
    },
    allRender() {
      ['back', 'left', 'right', 'top', 'bottom'].forEach(async (key) => {
        if (this[`has${key}`]) {
          await this.$refs[`${key}Designer`].renderAll()
        }
      })
    },
    allAddOriginImgAgain() {
      ['back', 'left', 'right', 'top', 'bottom'].forEach(async (key) => {
        if (this[`has${key}`]) {
          await this.$refs[`${key}Designer`].addOriginImgAgain()
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

        Promise.all([backPromise, leftPromise, rightPromise, topPromise, bottomPromise])
          .then((res) => {
            console.log('PromiseAll', res)
            resolve(res)
          })
          .catch((e) => reject(e))
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
