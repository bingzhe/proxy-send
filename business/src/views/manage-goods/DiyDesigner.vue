<template>
  <div ref="canvasBgWrapper" class="canvas-bg-wrapper">
    <canvas id="diy-designer-wrapper" />

    <!-- 截图 canvas -->
    <canvas id="canvas_crop" style="visibility:hidden;display: none;" />

    <!-- <button @click="preview">合成</button>
    <button @click="addOriginImg(ori_user_img_url)">addOriginImg</button>
    <button @click="addOutline(outline_url)">addOutline</button>
    <button @click="addColorImg(color_img_url)">addColorImg</button>
    <button @click="removeOutlineImg">removeOutlineImg</button> -->

    <!-- <img :src="prune_img_data">
    <img :src="preview_img_data"> -->
  </div>
</template>

<script>
import { fabric } from 'fabric'
import Http from '@/config/encsubmit'

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
      url: process.env.VUE_APP_BASEURL + '/img_save.php',

      // height: 620,
      // width: 300,
      // radius: 45,

      canvas: null,
      rect: null,        // 裁剪表示区域
      clipPath: null,
      originImg: null,   // 原图实例
      outlineImg: null,  // 轮廓图实例
      colorImg: null,    // 地图实例

      prune_img_data: '',
      preview_img_data: '',

      prune_img: '',         // 经过设计器修整后的用户图（已缩放、旋转，但不包含轮廓）
      preview_img: '',       // 经过设计器修整后的用户图（且和轮廓图合并后的图）（预览图）

      outlineWidth: '',
      outlineHeight: '',

      isMoving: false,

      // http://b.pso.rockyshi.cn/php/img_get.php?token=T1YL6Do4dje6MDIp&opr=get_img&type=1&img_name=2c8e46b57fe880442d15c24c9c83bb32.png
      outline_url: require('@/assets/images/2.png'),  // 轮廓图
      ori_user_img_url: require('@/assets/images/1.jpg'), // 用户原图
      color_img_url: require('@/assets/images/2.png')   // 底图
    }
  },
  watch: {
    // width: {
    //   handler() {
    //     this.init()
    //   }
    // }
  },
  mounted() {
    // this.init()
  },
  methods: {
    init() {
      // console.log(this.$refs.canvasBgWrapper.offsetWidth)
      const heightWrapper = this.$refs.canvasBgWrapper.offsetWidth

      this.canvas = new fabric.Canvas('diy-designer-wrapper', {
        width: heightWrapper,
        height: 800
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

      if (this.height >= 1000 && this.height < 1500) {
        this.canvas.setZoom(0.5)
      }
      if (this.height >= 1500) {
        this.canvas.setZoom(0.35)
      }
      // 给 canvas添加路径
      // this.canvas.clipPath = this.clipPath
    },
    addOutline() {
      return new Promise(resolve => {
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
          img.selectable = false
          img.hasControls = false
          img.hasBorders = false

          this.outlineImg = img
          this.canvas.add(img)

          // 设为active,准备截图
          // this.canvas.setActiveObject(img)
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
    addOriginImg(url) {
      if (this.originImg) {
        this.canvas.remove(this.originImg)
      }
      // if (this.outlineImg) {
      //   this.canvas.remove(this.outlineImg)
      // }

      fabric.Image.fromURL(url, (img) => {
        img.clipPath = this.clipPath
        img.scaleToWidth(this.width, false)  // 缩放图片的高度到400

        // img.width = this.width
        // img.height = this.height
        img.top = 100
        img.left = 100

        this.originImg = img

        const setOutlineTop = () => {
          this.isMoving = true
          if (this.isMoving) {
            this.canvas.setActiveObject(this.outlineImg)
          }
        }
        const setOutlineBottom = () => {
          this.isMoving = false
          this.canvas.setActiveObject(img)
        }

        img.on('moving', () => { setOutlineTop() })
        img.on('scaling', () => { setOutlineTop() })
        img.on('rotating', () => { setOutlineTop() })
        img.on('skewing', () => { setOutlineTop() })
        img.on('moved', () => { setOutlineBottom() })
        img.on('scaled', () => { setOutlineBottom() })
        img.on('rotated', () => { setOutlineBottom() })
        img.on('skewed', () => { setOutlineBottom() })

        this.canvas.add(img)
      })
    },

    addColorImg(url) {
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

        this.colorImg = img
        this.canvas.add(img)
      })
    },

    preview(url) {
      const canvas_crop = new fabric.Canvas('canvas_crop')

      // 去掉底色
      this.canvas.remove(this.colorImg)
      this.canvas.remove(this.rect)
      this.canvas.remove(this.outlineImg)
      this.canvas.renderAll()

      fabric.Image.fromURL(this.canvas.toDataURL('png'), async(img) => {
        canvas_crop.add(img)
        canvas_crop.setHeight(this.height + 2)
        canvas_crop.setWidth(this.width + 2)

        img.set('top', -100)
        img.set('left', -100)
        canvas_crop.renderAll()

        /**
         * 生成第一张图片已缩放、旋转，但不包含轮廓
         */
        this.prune_img_data = canvas_crop.toDataURL('png')

        canvas_crop.clear()
        // _this.canvas.clear()
        // await this.addOutline(url)

        this.canvas.add(this.colorImg)
        this.canvas.add(this.outlineImg)
        this.canvas.setActiveObject(this.outlineImg)
        this.canvas.renderAll()

        fabric.Image.fromURL(this.canvas.toDataURL('png'), async(img) => {
          canvas_crop.add(img)
          canvas_crop.setHeight(this.outlineHeight)
          canvas_crop.setWidth(this.outlineWidth)

          const top = 100 - (this.outlineHeight - this.height) / 2
          const left = 100 - (this.outlineWidth - this.width) / 2

          img.set('top', -top || 100)
          img.set('left', -left || 100)
          canvas_crop.renderAll()

          /**
           * 生成第二张图片 和轮廓图合并后的图
           */
          this.preview_img_data = canvas_crop.toDataURL('png')

          // setTimeout(() => {
          //   this.canvas.remove(this.outlineImg)
          // }, 50)
          // setTimeout(() => {
          //   this.canvas.add(this.colorImg)
          // }, 50)

          this.preview_img = await this.imgUpload(this.preview_img_data, 5)
          this.prune_img = await this.imgUpload(this.prune_img_data, 6)

          this.canvas.add(this.rect)
          this.canvas.setActiveObject(this.originImg)
          this.canvas.renderAll()

          this.$emit('on-success', { preview_img: this.preview_img, prune_img: this.prune_img })
          canvas_crop.dispose()
        })
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

        Http.EncSubmit(this.url, data, resp => {
          if (resp.ret !== 0) {
            reject(resp)
            return this.$message.error(resp.msg)
          }
          resolve(resp.data.img_name)
        })
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
#diy-designer-wrapper {
  border: 1px solid #ccc;
}
.canvas-bg-wrapper {
  background: url("../../assets/images/canvas_bg.jpg") repeat;
}
</style>

