<template>
  <div ref="canvasBgWrapper" class="canvas-bg-wrapper">
    <canvas id="preview-canvas" />

    <!-- screenshot canvas -->
    <canvas id="screenshot-canvas" style="visibility: hidden; display: none" />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import { fabric } from 'fabric'

export default {
  props: {
    posList: Array
  },
  data() {
    return {
      scale: 1,

      canvas: null,
      rect: null, // 裁剪表示区域

      originImg: null, // 原图实例
      outlineImg: null, // 轮廓图实例
      colorImg: null, // 底图实例

      outlineWidth: '',
      outlineHeight: '',

      posLeft: 200,
      posTop: 200,

      outlineImgMask: null, // 轮廓图

      back: {
        height: '',
        width: '',
        outlineWidth: '',
        outlineHeight: '',
        radius_adjius: '',
        posTop: 0,
        posLeft: 0,
        rect: null, // 裁剪表示区域
        clipPath: null, // 裁剪路径
        originImg: null, // 原图实例
        outlineImg: null, // 轮廓图实例
        colorImg: null // 底图实例
      },
      left: {
        height: '',
        width: '',
        outlineWidth: '',
        outlineHeight: '',
        radius_adjius: '',
        posTop: 0,
        posLeft: 0,
        rect: null, // 裁剪表示区域
        clipPath: null, // 裁剪路径
        originImg: null, // 原图实例
        outlineImg: null, // 轮廓图实例
        colorImg: null // 底图实例
      },
      right: {
        height: '',
        width: '',
        outlineWidth: '',
        outlineHeight: '',
        radius_adjius: '',
        posTop: 0,
        posLeft: 0,
        rect: null, // 裁剪表示区域
        clipPath: null, // 裁剪路径
        originImg: null, // 原图实例
        outlineImg: null, // 轮廓图实例
        colorImg: null // 底图实例
      },
      top: {
        height: '',
        width: '',
        outlineWidth: '',
        outlineHeight: '',
        radius_adjius: '',
        posTop: 0,
        posLeft: 0,
        rect: null, // 裁剪表示区域
        clipPath: null, // 裁剪路径
        originImg: null, // 原图实例
        outlineImg: null, // 轮廓图实例
        colorImg: null // 底图实例
      },
      bottom: {
        height: '',
        width: '',
        outlineWidth: '',
        outlineHeight: '',
        radius_adjius: '',
        posTop: 0,
        posLeft: 0,
        rect: null, // 裁剪表示区域
        clipPath: null, // 裁剪路径
        originImg: null, // 原图实例
        outlineImg: null, // 轮廓图实例
        colorImg: null // 底图实例
      }
    }
  },
  computed: {},
  methods: {
    updateDateBeforeInit(data) {
      // 各位置尺寸
      ['back', 'left', 'right', 'top', 'bottom'].forEach((key) => {
        this[key].width = data[key].width
        this[key].height = data[key].height
        this[key].radius_adjius = data[key].radius_adjius
      })

      // this.setPosition()
    },
    /**
     * @description: 更新图片的定位距离
     * @param {*} offset 距离边界距离，上边界，左边界
     * @param {*} gutter 间隔
     * @return {*}
     */
    setPosition(offset = 300, gutter = 300) {
      // 设计器模式 1：中左右上下 2：中右 3：中左
      let mode = 1
      if (this.posList.indexOf('top') !== -1 || this.posList.indexOf('bottom') !== -1) {
        mode = 1
      } else if (this.posList.indexOf('left') !== -1 || this.posList.indexOf('right') !== -1) {
        mode = 2
      } else {
        mode = 3
      }

      switch (mode) {
        case 1:
          this.back.posLeft = offset + gutter + this.left.width
          this.back.posTop = offset + gutter + this.top.height

          this.left.posLeft = offset
          this.left.posTop = this.back.posTop

          this.right.posLeft = this.back.posLeft + this.back.width + gutter
          this.right.posTop = this.back.posTop

          this.top.posLeft = this.back.posLeft
          this.top.posTop = offset

          this.bottom.posLeft = this.back.posLeft
          this.bottom.posTop = this.back.posTop + +this.back.height + gutter
          break
        case 2:
          this.back.posLeft = offset + gutter + this.left.width
          this.back.posTop = offset

          this.left.posLeft = offset
          this.left.posTop = offset

          this.right.posLeft = this.back.posLeft + this.back.width + gutter
          this.right.posTop = offset
          break
        case 3:
          this.back.posLeft = offset
          this.back.posTop = offset
          break
        default:
          break
      }
    },
    init() {
      const canvasWidth = this.$refs.canvasBgWrapper.offsetWidth

      // 设置画布和真实图片缩放比例
      if (this.back.height >= 1000 && this.back.height < 1500) {
        this.scale = 0.4
      } else if (this.back.height >= 1500) {
        this.scale = 0.3
      }
      /**
       * 设计器画布的尺寸，宽度100%  高度是图片高度 * 2 + 300
       */

      let canvasHeight
      if (this.posList.indexOf('top') !== -1 || this.posList.indexOf('top') !== -1) {
        canvasHeight = this.back.height * this.scale * 2
      } else {
        canvasHeight = this.back.height * this.scale + 600 * this.scale
      }
      this.canvas = new fabric.Canvas('preview-canvas', {
        width: canvasWidth,
        height: canvasHeight
      })

      fabric.Object.prototype.transparentCorners = false

      // 隐藏的边框控件在遮罩上面
      this.canvas.controlsAboveOverlay = true

      this.canvas.setZoom(this.scale)

      // 初始化裁剪路径和位置
      this.posList.forEach((key) => {
        this.addClipPathPos(key)
      })
    },
    addClipPathPos(pos) {
      const { width, height, radius_adjius, posLeft, posTop } = this[pos]
      this[pos].clipPath = new fabric.Rect({
        left: posLeft,
        top: posTop,
        width: width,
        height: height,
        rx: radius_adjius,
        ry: radius_adjius,
        absolutePositioned: true,
        fill: 'transparent'
      })

      // // 裁剪位置
      // this[pos].rect = new fabric.Rect({
      //   left: posLeft,
      //   top: posTop,
      //   width: width,
      //   height: height,
      //   rx: radius_adjius,
      //   ry: radius_adjius,
      //   selectable: false,
      //   fill: 'rgba(184, 184, 184, 0.5)'
      // })

      // this.canvas.add(this[pos].rect)
    },
    // 底图
    addColorImg(url, pos) {
      if (this[pos].colorImg) {
        this.canvas.remove(this[pos].colorImg)
      }

      return new Promise((resolve) => {
        fabric.Image.fromURL(url, (img) => {
          const left = this[pos].posLeft - (img.width - this[pos].width) / 2
          const top = this[pos].posTop - (img.height - this[pos].height) / 2

          img.set('top', top)
          img.set('left', left)
          img.selectable = false

          this[pos].colorImg = img
          this.canvas.add(img)
          resolve()
        })
      })
    },
    removeAllColor() {
      this.posList.forEach((pos) => {
        if (this[pos].colorImg) {
          this.canvas.remove(this[pos].colorImg)
        }
      })
    },
    addAllColorAgain() {
      this.posList.forEach((pos) => {
        if (this[pos].colorImg) {
          this.canvas.add(this[pos].colorImg)
        }
      })
    },
    /**
     * 添加到canvas,不是遮罩层，所有的添加到canvas上后，截图之后再把截的图添加的遮罩层
     */
    addOutlineToCanvas(url, pos) {
      if (this[pos].outlineImg) {
        this.canvas.remove(this[pos].outlineImg)
      }

      return new Promise((resolve) => {
        fabric.Image.fromURL(url, (img) => {
          this[pos].outlineWidth = img.width
          this[pos].outlineHeight = img.height

          const left = this[pos].posLeft - (img.width - this[pos].width) / 2
          const top = this[pos].posTop - (img.height - this[pos].height) / 2

          img.set('top', top)
          img.set('left', left)

          this[pos].outlineImg = img
          this.canvas.add(img)
          resolve()
        })
      })
    },
    removeAllOutline() {
      this.posList.forEach((pos) => {
        if (this[pos].outlineImg) {
          this.canvas.remove(this[pos].outlineImg)
        }
      })
    },

    // 轮廓图mask
    addOutlineMask(url) {
      return new Promise((resolve) => {
        this.canvas.overlayImage = null

        fabric.Image.fromURL(url, async (img) => {
          this.outlineImgMask = img
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
    removeOutlineImgMask() {
      if (this.canvas) {
        this.canvas.overlayImage = null
        this.canvas.renderAll()
      }
    },
    // 裁剪的原图
    addOriginImg(url, pos) {
      if (this[pos].originImg) {
        this.canvas.remove(this[pos].originImg)
      }

      fabric.Image.fromURL(url, (img) => {
        img.clipPath = this[pos].clipPath

        /**
         * 缩放图片的高度到轮廓尺寸
         * 计算图片缩放后的尺寸，给定位距离加上偏移距离
         */
        img.scaleToHeight(this[pos].height, false)

        const scaleWidth = img.width * img.scaleX
        // const offsetWidth = img.scaleX > 1 ? (scaleWidth - this.width) / 2 : 0
        const offsetWidth = (scaleWidth - this[pos].width) / 2

        img.top = this[pos].posTop
        img.left = this[pos].posLeft - offsetWidth

        this[pos].originImg = img

        img.on('selected', () => {
          document.addEventListener('keydown', this.handleKeydown, false)
        })
        img.on('deselected', () => {
          document.removeEventListener('keydown', this.handleKeydown, false)
        })
        this.canvas.add(img)
      })
    },
    addOriginImgAgain() {
      this.posList.forEach((pos) => {
        if (this[pos].originImg) {
          this.canvas.add(this[pos].originImg)
        }
      })
    },
    removeAllOriginImg() {
      this.posList.forEach((pos) => {
        if (this[pos].originImg) {
          this.canvas.remove(this[pos].originImg)
        }
      })
    },
    disposeCanvas() {
      if (this.canvas) {
        this.canvas.dispose()
      }
    },
    renderAll() {
      this.canvas.renderAll()
    },
    async getFullOutline() {
      return this.canvas.toDataURL({ multiplier: 1 / this.scale })
    },
    /**
     * @description: 通过canvas实现截图
     * @param {*} picData 需要截图的原图数据
     * @param {*} height 生成图片的高度
     * @param {*} width 生成图片的宽度
     * @param {*} offsetTop 原图向上偏移距离 默认0
     * @param {*} offsetLeft 原图向下偏移距离 默认0
     * @param {*} imgTyle 生成图片的格式 默认png
     * @param {*} background 生成图片是canvas的背景图
     * @return {*} Promise
     */
    getScreenshot(
      picData,
      height,
      width,
      offsetTop = 0,
      offsetLeft = 0,
      imgTyle = 'png',
      background
    ) {
      return new Promise((resolve) => {
        const screenshotCanvas = new fabric.Canvas('screenshot-canvas')

        fabric.Image.fromURL(picData, (img) => {
          screenshotCanvas.add(img)
          screenshotCanvas.setHeight(height)
          screenshotCanvas.setWidth(width)

          if (background) screenshotCanvas.setBackgroundColor(background)

          img.set('top', offsetTop)
          img.set('left', offsetLeft)

          screenshotCanvas.renderAll()
          const screenshotData = screenshotCanvas.toDataURL({ format: imgTyle })
          screenshotCanvas.dispose()
          resolve(screenshotData)
        })
      })
    },
    async getPreviewData() {
      this.removeAllColor()
      this.canvas.overlayImage = null
      this.canvas.renderAll()

      const prune_img_data = {}
      const preview_img_data = {}

      // 生成裁剪图，原图缩放，旋转后图片，不包括底图，轮廓图
      for (const pos of this.posList) {
        if (this[pos].originImg) {
          prune_img_data[pos] = await this.getScreenshot(
            this.canvas.toDataURL({ multiplier: 1 / this.scale }),
            this[pos].height,
            this[pos].width,
            -this[pos].posTop,
            -this[pos].posLeft
          )
        }
      }
      this.canvas.clear()
      this.canvas.renderAll()

      this.addAllColorAgain()
      await this.addOutlineImg(this.outlineImgMask)
      this.addOriginImgAgain()
      this.canvas.renderAll()

      // 生成预览图，原图缩放，旋转后图片，包括底图，轮廓图
      for (const pos of this.posList) {
        if (this[pos].originImg) {
          const top = this[pos].posTop - (this[pos].outlineHeight - this[pos].height) / 2
          const left = this[pos].posLeft - (this[pos].outlineWidth - this[pos].width) / 2

          preview_img_data[pos] = await this.getScreenshot(
            this.canvas.toDataURL({ multiplier: 1 / this.scale }),
            this[pos].outlineHeight,
            this[pos].outlineWidth,
            -top,
            -left,
            'jpeg',
            'rgba(255,255,255,1)'
          )
        }
      }

      return { prune_img_data, preview_img_data }
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
