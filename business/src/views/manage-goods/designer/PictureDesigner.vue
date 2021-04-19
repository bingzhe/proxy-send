<template>
  <div ref="canvasBgWrapper" class="canvas-bg-wrapper">
    <canvas :id="idName" />

    <!-- screenshot canvas -->
    <canvas id="screenshot-canvas" style="visibility: hidden; display: none" />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import { fabric } from 'fabric'

export default {
  props: {
    radius: [String, Number],
    width: [String, Number],
    height: [String, Number],
    namePrefix: String,
    scale: Number,
    canvasHeight: [String, Number],
    canvasWidth: [String, Number]
  },
  data() {
    return {
      canvas: null,
      rect: null, // 裁剪表示区域
      clipPath: null, // 裁剪路径

      originImg: null, // 原图实例
      outlineImg: null, // 轮廓图实例
      colorImg: null, // 底图实例

      prune_img_data: '', // 经过设计器修整后的用户图（已缩放、旋转，但不包含轮廓）
      preview_img_data: '', // 经过设计器修整后的用户图（且和轮廓图合并后的图）（预览图）

      outlineWidth: '',
      outlineHeight: '',

      posLeft: 200,
      posTop: 200
    }
  },
  computed: {
    idName() {
      return `${this.namePrefix}-canvas`
    },
    screenshotIdName() {
      return `${this.namePrefix}-screenshot`
    }
  },
  methods: {
    init() {
      // const heightWrapper = this.$refs.canvasBgWrapper.offsetWidth

      /**
       * 设计器画布的尺寸，宽度100% 高度是图片高度 + 300
       */
      this.canvas = new fabric.Canvas(this.idName, {
        // width: heightWrapper,
        // height: this.height * this.scale * 2 + 300 * this.scale
        width: Math.round(this.canvasWidth * this.scale),
        height: Math.round(this.canvasHeight * this.scale)
      })

      fabric.Object.prototype.transparentCorners = false

      // 隐藏的边框控件在遮罩上面
      this.canvas.controlsAboveOverlay = true

      // 初始化裁剪路径和位置
      this.addClipPathPos()
      this.canvas.setZoom(this.scale)
    },
    addClipPathPos() {
      this.clipPath = new fabric.Rect({
        left: this.posLeft,
        top: this.posTop,
        width: this.width,
        height: this.height,
        rx: this.radius,
        ry: this.radius,
        absolutePositioned: true,
        fill: 'transparent'
      })

      // 裁剪位置
      this.rect = new fabric.Rect({
        left: this.posLeft,
        top: this.posTop,
        width: this.width,
        height: this.height,
        rx: this.radius,
        ry: this.radius,
        selectable: false,
        fill: 'rgba(184, 184, 184, 0.5)'
      })

      this.canvas.add(this.rect)
    },
    // 底图
    addColorImg(url) {
      return new Promise((resolve) => {
        if (this.colorImg) {
          this.canvas.remove(this.colorImg)
        }

        fabric.Image.fromURL(url, (img) => {
          const left = this.posLeft - (img.width - this.width) / 2
          const top = this.posTop - (img.height - this.height) / 2

          img.set('top', top)
          img.set('left', left)
          img.selectable = false

          this.colorImg = img
          this.canvas.add(img)
          resolve()
        })
      })
    },
    // 轮廓图
    addOutline(url) {
      return new Promise((resolve) => {
        this.canvas.overlayImage = null

        fabric.Image.fromURL(url, async (img) => {
          this.outlineWidth = img.width
          this.outlineHeight = img.height

          const left = this.posLeft - (img.width - this.width) / 2
          const top = this.posTop - (img.height - this.height) / 2

          img.set('top', top)
          img.set('left', left)

          this.outlineImg = img
          await this.addOutlineImg(img)
          resolve()
        })
      })
    },
    addOutlineImg(img) {
      return new Promise((resolve) => {
        this.canvas.setOverlayImage(img, () => {
          resolve()
        })
      })
    },
    removeOutlineImg() {
      // if (this.outlineImg) {
      //   this.canvas.remove(this.outlineImg)
      // }
      this.canvas.overlayImage = null
      this.canvas.renderAll()
    },
    // 裁剪的原图
    addOriginImg(url) {
      console.log('222', url)
      if (this.originImg) {
        this.canvas.remove(this.originImg)
      }

      fabric.Image.fromURL(url, (img) => {
        img.clipPath = this.clipPath

        /**
         * 缩放图片的高度到轮廓尺寸
         * 计算图片缩放后的尺寸，给定位距离加上偏移距离
         */
        img.scaleToHeight(this.height, false)
        const scaleWidth = img.width * img.scaleX
        // const offsetWidth = img.scaleX > 1 ? (scaleWidth - this.width) / 2 : 0
        const offsetWidth = (scaleWidth - this.width) / 2

        img.top = this.posTop
        img.left = this.posLeft - offsetWidth

        this.originImg = img

        img.on('selected', () => {
          document.addEventListener('keydown', this.handleKeydown, false)
        })
        img.on('deselected', () => {
          document.removeEventListener('keydown', this.handleKeydown, false)
        })

        this.canvas.add(img)
      })
    },
    disposeCanvas() {
      if (this.canvas) {
        this.canvas.dispose()
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
    preview() {
      return new Promise((resolve) => {
        const screenshotCanvas = new fabric.Canvas(this.screenshotIdName)

        // 去掉底色
        this.canvas.remove(this.colorImg)
        this.canvas.remove(this.rect)
        this.canvas.overlayImage = null
        this.canvas.renderAll()

        fabric.Image.fromURL(this.canvas.toDataURL({ multiplier: 1 / this.scale }), async (img) => {
          screenshotCanvas.add(img)
          screenshotCanvas.setHeight(this.height)
          screenshotCanvas.setWidth(this.width)
          // screenshotCanvas.setBackgroundColor('rgba(	255,255,255,1)')

          img.set('top', -this.posTop)
          img.set('left', -this.posLeft)
          screenshotCanvas.renderAll()

          /**
           * 生成第一张图片已缩放、旋转，但不包含轮廓
           */
          this.prune_img_data = screenshotCanvas.toDataURL({ format: 'png' })

          screenshotCanvas.clear()
          // _this.canvas.clear()
          // await this.addOutline(url)
          this.canvas.remove(this.originImg)
          this.canvas.renderAll()

          this.canvas.add(this.colorImg)
          await this.addOutlineImg(this.outlineImg)
          this.canvas.add(this.originImg)
          this.canvas.renderAll()

          fabric.Image.fromURL(
            this.canvas.toDataURL({ multiplier: 1 / this.scale }),
            async (img) => {
              screenshotCanvas.add(img)
              screenshotCanvas.setHeight(this.outlineHeight)
              screenshotCanvas.setWidth(this.outlineWidth)
              screenshotCanvas.setBackgroundColor('rgba(255,255,255,1)')

              const top = this.posTop - (this.outlineHeight - this.height) / 2
              const left = this.posLeft - (this.outlineWidth - this.width) / 2

              img.set('top', -top || 100)
              img.set('left', -left || 100)
              screenshotCanvas.renderAll()

              /**
               * 生成第二张图片 和轮廓图合并后的图
               */
              this.preview_img_data = screenshotCanvas.toDataURL({ format: 'jpeg' })

              this.canvas.add(this.rect)
              this.canvas.setActiveObject(this.originImg)
              this.canvas.renderAll()

              this.$emit('preview-success', {
                preview_img_data: this.preview_img_data,
                prune_img_data: this.prune_img_data
              })

              screenshotCanvas.dispose()
              resolve()
            }
          )
        })
      })
    },
    handleKeydown(e) {
      if (e.ctrlKey && e.keyCode === 38 && this.originImg) {
        this.originImg.top -= 5
      }
      if (e.ctrlKey && e.keyCode === 40 && this.originImg) {
        this.originImg.top += 5
      }
      if (e.ctrlKey && e.keyCode === 37 && this.originImg) {
        this.originImg.left -= 5
      }
      if (e.ctrlKey && e.keyCode === 39 && this.originImg) {
        this.originImg.left += 5
      }

      const animate = () => {
        this.renderAll()
        setTimeout(animate, 10)
      }
      setTimeout(animate, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
#designer-canvas {
  border: 1px solid #ccc;
}
.canvas-bg-wrapper {
  background: url('../../../assets/images/canvas_bg.jpg') repeat;
}
</style>
