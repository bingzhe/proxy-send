<template>
  <div ref="canvasBgWrapper" class="canvas-bg-wrapper">
    <canvas id="diy-designer-wrapper" />

    <!-- 截图 canvas -->
    <canvas id="canvas_crop" style="visibility: hidden; display: none" />

    <!-- <button @click="preview">合成</button>
    <button @click="addOriginImg(ori_user_img_url)">addOriginImg</button>
    <button @click="addOutline(outline_url)">addOutline</button>
    <button @click="addColorImg(color_img_url)">addColorImg</button>
    <button @click="removeOutlineImg">removeOutlineImg</button>-->

    <!-- <img :src="prune_img_data">
    <img :src="preview_img_data">-->
  </div>
</template>

<script>
import { fabric } from 'fabric'

export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    height: {
      type: Number,
      default: 620
    },
    // eslint-disable-next-line vue/require-default-prop
    width: {
      type: Number,
      default: 300
    },
    // eslint-disable-next-line vue/require-default-prop
    radius: {
      type: Number,
      default: 45
    }
  },
  data() {
    return {
      // url: process.env.VUE_APP_BASEURL + '/img_save.php',

      // height: 620,
      // width: 300,
      // radius: 45,

      canvas: null,
      rect: null, // 裁剪表示区域
      clipPath: null,
      originImg: null, // 原图实例
      outlineImg: null, // 轮廓图实例
      colorImg: null, // 地图实例

      prune_img_data: '',
      preview_img_data: '',

      prune_img: '', // 经过设计器修整后的用户图（已缩放、旋转，但不包含轮廓）
      preview_img: '', // 经过设计器修整后的用户图（且和轮廓图合并后的图）（预览图）

      outlineWidth: '',
      outlineHeight: '',

      isMoving: false,

      scale: 1, // canvas 缩放尺寸

      // <<<<<<<<<<<<<< test data <<<<<<<<<<<<<<<
      // http://b.pso.rockyshi.cn/php/img_get.php?token=T1YL6Do4dje6MDIp&opr=get_img&type=1&img_name=2c8e46b57fe880442d15c24c9c83bb32.png
      outline_url: require('@/assets/images/outline.png'), // 轮廓图
      ori_user_img_url: require('@/assets/images/origin.jpg'), // 用户原图
      color_img_url: require('@/assets/images/color.png') // 底图
    }
  },
  methods: {
    init() {
      // console.log(this.$refs.canvasBgWrapper.offsetWidth)
      const heightWrapper = this.$refs.canvasBgWrapper.offsetWidth

      /**
       * 设置画布和真实图片缩放比例
       */

      if (this.height >= 1000 && this.height < 1500) {
        this.scale = 0.5
      }
      if (this.height >= 1500) {
        this.scale = 0.4
      }

      this.canvas = new fabric.Canvas('diy-designer-wrapper', {
        width: heightWrapper,
        height: this.height * this.scale + 300 * this.scale
      })

      fabric.Object.prototype.transparentCorners = false

      // 隐藏的边框控件在遮罩上面
      this.canvas.controlsAboveOverlay = true

      this.clipPath = new fabric.Rect({
        left: 100,
        top: 100,
        width: this.width,
        height: this.height,
        rx: this.radius,
        ry: this.radius,
        absolutePositioned: true,
        fill: 'transparent'
      })

      this.rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: this.width,
        height: this.height,
        rx: this.radius,
        ry: this.radius,
        selectable: false,
        // borderColor: 'rgba(102, 153, 255, 0.75)',
        fill: 'rgba(184, 184, 184, 0.5)'
      })

      this.canvas.add(this.rect)

      // if (this.height >= 1000 && this.height < 1500) {
      //   this.canvas.setZoom(0.5)
      //   this.scale = 0.5
      // }
      // if (this.height >= 1500) {
      //   this.canvas.setZoom(0.4)
      //   this.scale = 0.4
      // }
      this.canvas.setZoom(this.scale)
      // 给 canvas添加路径
      // this.canvas.clipPath = this.clipPath
    },
    disposeCanvas() {
      if (this.canvas) {
        this.canvas.dispose()
      }
    },
    addOutline(url) {
      return new Promise((resolve) => {
        if (this.outlineImg) {
          this.canvas.remove(this.outlineImg)
        }

        fabric.Image.fromURL(url, (img) => {
          this.outlineWidth = img.width
          this.outlineHeight = img.height

          const left = 100 - (img.width - this.width) / 2
          const top = 100 - (img.height - this.height) / 2
          /**
           * 轮廓位置调整
           */
          img.set('top', top || 100)
          img.set('left', left || 100)
          // img && img.setCrossOrigin('anonymous')

          img.selectable = false
          img.hasControls = false
          img.hasBorders = false

          this.outlineImg = img
          this.canvas.add(img)

          // 设为active,准备截图
          // this.canvas.setActiveObject(img)
          img.evented = false
          resolve()
        })
      })
    },
    addOriginImg(url) {
      if (this.originImg) {
        this.canvas.remove(this.originImg)
      }

      fabric.Image.fromURL(url, (img) => {
        img.clipPath = this.clipPath

        // if (this.width > this.height) {
        //   img.scaleToWidth(this.width, false) // 缩放图片的高度到轮廓尺寸
        // } else {
        //   img.scaleToHeight(this.height, false)
        // }

        /**
         * 计算图片缩放后的尺寸，给定位距离加上偏移距离
         */
        img.scaleToHeight(this.height, false)
        const scaleWidth = img.width * img.scaleX
        // const offsetWidth = img.scaleX > 1 ? (scaleWidth - this.width) / 2 : 0
        const offsetWidth = (scaleWidth - this.width) / 2

        img.top = 100
        img.left = 100 - offsetWidth

        this.originImg = img

        const setOutlineTop = () => {
          this.isMoving = true
          if (this.isMoving) {
            this.canvas.setActiveObject(this.outlineImg)
          }
        }
        // const setOutlineBottom = () => {
        //   this.isMoving = false
        //   this.canvas.setActiveObject(img)
        // }

        img.on('moving', () => {
          setOutlineTop()
        })
        img.on('scaling', () => {
          setOutlineTop()
        })
        img.on('rotating', () => {
          setOutlineTop()
        })
        img.on('skewing', () => {
          setOutlineTop()
        })
        // img.on('moved', () => { setOutlineBottom() })
        // img.on('scaled', () => { setOutlineBottom() })
        // img.on('rotated', () => { setOutlineBottom() })
        // img.on('skewed', () => { setOutlineBottom() })

        // img.on('selected', (e) => {
        //   if (!(e.e && e.e.dbClick)) {
        //     // setOutlineTop()
        //   }
        // })
        // img.on('mousedblclick', (e) => {
        //   this.canvas.setActiveObject(this.originImg, { dbClick: true })
        // })

        this.canvas.add(img)
        setOutlineTop()
        // this.canvas.setActiveObject(this.originImg)
      })
    },
    addColorImg(url) {
      return new Promise((resolve) => {
        if (this.colorImg) {
          this.canvas.remove(this.colorImg)
        }
        // if (this.outlineImg) {
        //   this.canvas.remove(this.outlineImg)
        // }

        fabric.Image.fromURL(url, (img) => {
          const left = 100 - (img.width - this.width) / 2
          const top = 100 - (img.height - this.height) / 2
          /**
           * 轮廓位置调整
           */
          img.set('top', top || 100)
          img.set('left', left || 100)
          img.selectable = false
          // img && img.setCrossOrigin('anonymous')

          this.colorImg = img
          this.canvas.add(img)
          resolve()
        })
      })
    },
    removeOutlineImg() {
      if (this.outlineImg) {
        this.canvas.remove(this.outlineImg)
      }
    },
    removeOriginImg() {
      if (this.originImg) {
        this.canvas.remove(this.originImg)
      }
    },
    addOriginImgAgain() {
      if (this.originImg) {
        this.canvas.add(this.originImg)
      }
    },
    renderAll() {
      this.canvas.renderAll()
    },
    removeAll() {
      this.removeOutlineImg()
      this.removeOriginImg()
      this.canvas.remove(this.colorImg)
      this.canvas.remove(this.rect)
      this.canvas.renderAll()
    },
    preview() {
      return new Promise((resolve) => {
        const canvas_crop = new fabric.Canvas('canvas_crop')

        // 去掉底色
        this.canvas.remove(this.colorImg)
        this.canvas.remove(this.rect)
        this.canvas.remove(this.outlineImg)
        this.canvas.renderAll()

        fabric.Image.fromURL(this.canvas.toDataURL({ multiplier: 1 / this.scale }), async (img) => {
          canvas_crop.add(img)
          canvas_crop.setHeight(this.height)
          canvas_crop.setWidth(this.width)
          // canvas_crop.setBackgroundColor('rgba(	255,255,255,1)')

          img.set('top', -100)
          img.set('left', -100)
          canvas_crop.renderAll()

          /**
           * 生成第一张图片已缩放、旋转，但不包含轮廓
           */
          this.prune_img_data = canvas_crop.toDataURL({ format: 'png' })

          canvas_crop.clear()
          // _this.canvas.clear()
          // await this.addOutline(url)
          this.canvas.remove(this.originImg)
          this.canvas.renderAll()

          this.canvas.add(this.colorImg)
          this.canvas.add(this.outlineImg)
          this.canvas.add(this.originImg)
          // this.canvas.setActiveObject(this.originImg)
          this.canvas.setActiveObject(this.outlineImg)
          this.canvas.renderAll()

          fabric.Image.fromURL(this.canvas.toDataURL({ multiplier: 1 / this.scale }), async (img) => {
            canvas_crop.add(img)
            canvas_crop.setHeight(this.outlineHeight)
            canvas_crop.setWidth(this.outlineWidth)
            canvas_crop.setBackgroundColor('rgba(	255,255,255,1)')

            const top = 100 - (this.outlineHeight - this.height) / 2
            const left = 100 - (this.outlineWidth - this.width) / 2

            img.set('top', -top || 100)
            img.set('left', -left || 100)
            canvas_crop.renderAll()

            /**
             * 生成第二张图片 和轮廓图合并后的图
             */
            this.preview_img_data = canvas_crop.toDataURL({ format: 'jpeg' })

            // this.preview_img = await this.imgUpload(this.preview_img_data, 5)
            // this.prune_img = await this.imgUpload(this.prune_img_data, 6)

            this.canvas.add(this.rect)
            this.canvas.setActiveObject(this.originImg)
            this.canvas.renderAll()

            this.$emit('preview-success', {
              preview_img_data: this.preview_img_data,
              prune_img_data: this.prune_img_data
            })
            // this.$emit('on-success', { preview_img: this.preview_img, prune_img: this.prune_img })
            canvas_crop.dispose()
            resolve()
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#diy-designer-wrapper {
  border: 1px solid #ccc;
}
.canvas-bg-wrapper {
  background: url('../../assets/images/canvas_bg.jpg') repeat;
}
</style>
