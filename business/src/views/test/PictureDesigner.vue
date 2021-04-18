<template>
  <div ref="canvasBgWrapper" class="canvas-bg-wrapper">
    <canvas id="designer-canvas" />

    <!-- screenshot canvas -->
    <canvas id="screenshot-canvas" style="visibility: hidden; display: none" />
  </div>
</template>

<script>
import { fabric } from 'fabric'

export default {
  props: {
    height: {
      type: Number,
      default: 620
    },
    width: {
      type: Number,
      default: 300
    },
    radius: {
      type: Number,
      default: 45
    }
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

      isMoving: false,

      scale: 1, // canvas 缩放尺寸

      backParam: {
        height: '',
        width: '',
        radius_adjius: ''
      },
      // 背部图片向对于图层的定位角
      backPosLeft: '',
      backPosTop: '',
      backRect: null, // 裁剪表示区域
      backClipPath: null, // 裁剪路径

      leftParam: {
        height: '',
        width: '',
        radius_adjius: ''
      },
      // 左侧图片向对于图层的定位角
      leftPosLeft: '',
      leftPosTop: '',
      leftRect: null, // 裁剪表示区域
      leftClipPath: null, // 裁剪路径

      rightParam: {
        height: '',
        width: '',
        radius_adjius: ''
      },
      // 右侧侧图片向对于图层的定位角
      rightPosLeft: '',
      rightPosTop: '',
      rightRect: null, // 裁剪表示区域
      rightClipPath: null, // 裁剪路径

      topParam: {
        height: '',
        width: '',
        radius_adjius: ''
      },
      // 顶部侧图片向对于图层的定位角
      topPosLeft: '',
      topPosTop: '',
      topRect: null, // 裁剪表示区域
      topClipPath: null, // 裁剪路径

      bottomParam: {
        height: '',
        width: '',
        radius_adjius: ''
      },
      // 底部侧图片向对于图层的定位角
      bottomPosLeft: '',
      bottomPosTop: '',
      bottomRect: null, // 裁剪表示区域
      bottomClipPath: null // 裁剪路径
    }
  },
  methods: {
    setInitData(data) {
      /**
       * data : {
       *  backParam: { width: '', height: '', radius_adjius: '',},
       *  leftParam: {...}
       *  rightParam: {...}
       *  topParam: {...}
       *  bottomParam: {...}
       * }
       */
      // this.back.width = back.width
      // this.back.height = back.height
      // this.back.radius_adjius = back.radius_adjius

      ['backParam', 'leftParam', 'rightParam', 'topParam', 'bottomParam'].forEach((key) => {
        this[key].width = data[key].width
        this[key].height = data[key].height
        this[key].radius_adjius = data[key].radius_adjius
      })
    },
    // 获取所有图片的定位距离
    setPosition() {
      // this.backPosLeft = 400 + Math.round(this.width / 2)
      this.backPosLeft = 400 + this.leftParam.width
      this.backPosTop = 400 + Math.round(this.height / 3)

      this.leftPosLeft = 200
      this.leftPosTop = this.backPosTop

      this.rightPosLeft = this.backPosLeft + this.width + 200
      this.rightPosTop = this.backPosTop

      this.topPosLeft = this.backPosLeft
      this.topPosTop = 200

      this.bottomPosLeft = this.backPosLeft
      this.bottomPosTop = this.backPosTop + +this.height + 200
    },
    init() {
      const heightWrapper = this.$refs.canvasBgWrapper.offsetWidth

      /**
       * 设置画布和真实图片缩放比例
       */

      if (this.height >= 1000 && this.height < 1500) {
        this.scale = 0.4
      }
      if (this.height >= 1500) {
        this.scale = 0.3
      }

      /**
       * 设计器画布的尺寸，宽度100% 高度是图片高度 + 300
       */
      this.canvas = new fabric.Canvas('designer-canvas', {
        width: heightWrapper,
        height: this.height * this.scale * 2 + 300 * this.scale
      })

      fabric.Object.prototype.transparentCorners = false

      // 隐藏的边框控件在遮罩上面
      this.canvas.controlsAboveOverlay = true

      // 初始化裁剪路径和位置
      this.addClipPathPos('back')
      this.addClipPathPos('left')
      this.addClipPathPos('right')
      this.addClipPathPos('top')
      this.addClipPathPos('bottom')

      this.canvas.setZoom(this.scale)
    },
    // pos: back/left/right/top/bottom
    addClipPathPos(pos) {
      const { width, height, radius_adjius } = this[`${pos}Param`]
      const left = this[`${pos}PosLeft`]
      const top = this[`${pos}PosTop`]

      console.log(left, top, width, height, radius_adjius)
      this[`${pos}clipPath`] = new fabric.Rect({
        left,
        top,
        width,
        height,
        rx: radius_adjius,
        ry: radius_adjius,
        absolutePositioned: true,
        fill: 'transparent'
      })

      // 裁剪位置
      this[`${pos}rect`] = new fabric.Rect({
        left,
        top,
        width,
        height,
        rx: radius_adjius,
        ry: radius_adjius,
        selectable: false,
        fill: 'rgba(184, 184, 184, 0.5)'
      })

      this.canvas.add(this[`${pos}rect`])
    },
    disposeCanvas() {
      if (this.canvas) {
        this.canvas.dispose()
      }
    },
    addOutlineImg(img) {
      return new Promise((resolve) => {
        this.canvas.setOverlayImage(img, () => {
          resolve()
        })
      })
    },
    addOutline(url) {
      return new Promise((resolve) => {
        // if (this.outlineImg) {
        //   this.canvas.remove(this.outlineImg)
        // }
        this.canvas.overlayImage = null

        fabric.Image.fromURL(url, async (img) => {
          this.outlineWidth = img.width
          this.outlineHeight = img.height

          const left = this.backPosLeft - (img.width - this.width) / 2
          const top = this.backPosTop - (img.height - this.height) / 2

          /**
           * 轮廓位置调整
           */
          img.set('top', top || 100)
          img.set('left', left || 100)

          // img.selectable = false
          // img.hasControls = false
          // img.hasBorders = false

          this.outlineImg = img

          // 设为active
          // this.canvas.setActiveObject(img)

          await this.addOutlineImg(img)
          resolve()
          // this.canvas.setOverlayImage(img, () => {
          //   this.canvas.renderAll.bind(this.canvas)
          //   resolve()
          // })
        })
      })
    },
    addOriginImg(url) {
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

        img.top = this.backPosTop
        img.left = this.backPosLeft - offsetWidth

        this.originImg = img

        img.on('selected', () => {
          document.addEventListener('keydown', this.handleKeydown, false)
        })
        img.on('deselected', () => {
          document.removeEventListener('keydown', this.handleKeydown, false)
        })

        this.canvas.add(img)
        // setOutlineTop()
        // this.canvas.setActiveObject(this.originImg)
      })
    },
    addColorImg(url) {
      return new Promise((resolve) => {
        if (this.colorImg) {
          this.canvas.remove(this.colorImg)
        }

        fabric.Image.fromURL(url, (img) => {
          const left = this.backPosLeft - (img.width - this.width) / 2
          const top = this.backPosTop - (img.height - this.height) / 2
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
      // if (this.outlineImg) {
      //   this.canvas.remove(this.outlineImg)
      // }
      this.canvas.overlayImage = null
      this.canvas.renderAll()
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
        const screenshotCanvas = new fabric.Canvas('screenshot-canvas')

        // 去掉底色
        this.canvas.remove(this.colorImg)
        this.canvas.remove(this.rect)
        // this.canvas.remove(this.outlineImg)
        this.canvas.overlayImage = null
        this.canvas.renderAll()

        fabric.Image.fromURL(this.canvas.toDataURL({ multiplier: 1 / this.scale }), async (img) => {
          screenshotCanvas.add(img)
          screenshotCanvas.setHeight(this.height)
          screenshotCanvas.setWidth(this.width)
          // screenshotCanvas.setBackgroundColor('rgba(	255,255,255,1)')

          img.set('top', -100)
          img.set('left', -100)
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
          // this.canvas.add(this.outlineImg)
          await this.addOutlineImg(this.outlineImg)
          this.canvas.add(this.originImg)
          // this.canvas.setActiveObject(this.originImg)
          // this.canvas.setActiveObject(this.outlineImg)
          this.canvas.renderAll()

          fabric.Image.fromURL(
            this.canvas.toDataURL({ multiplier: 1 / this.scale }),
            async (img) => {
              screenshotCanvas.add(img)
              screenshotCanvas.setHeight(this.outlineHeight)
              screenshotCanvas.setWidth(this.outlineWidth)
              screenshotCanvas.setBackgroundColor('rgba(255,255,255,1)')

              const top = 100 - (this.outlineHeight - this.height) / 2
              const left = 100 - (this.outlineWidth - this.width) / 2

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
      // console.log(e.keyCode)
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
  background: url('../../assets/images/canvas_bg.jpg') repeat;
}
</style>
