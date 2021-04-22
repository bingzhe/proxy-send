
<template>
  <div>
    <PictureDesigner ref="pictureDesigner" :posList="posList" />
  </div>
</template>

<script>
import PictureDesigner from './PictureDesigner'

export default {
  /* eslint-disable vue/require-default-prop */
  components: {
    PictureDesigner
  },
  props: {
    posList: Array
  },
  data() {
    return {
      opt_color_list: [],
      opt_color: {},

      scale: 1
    }
  },
  methods: {
    updateData(info) {
      this.opt_color_list = info.opt_color_list
      this.$refs.pictureDesigner.updateDateBeforeInit(info.printParam)

      // >>>>>>> colors
      this.opt_color = this.opt_color_list[0]

      this.$nextTick(async () => {
        // 更新图片的定位距离
        this.$refs.pictureDesigner.setPosition()

        this.$refs.pictureDesigner.init()

        await this.addOutline()
        await this.addAllColorImg()
      })
    },

    addAllColorImg() {
      return new Promise((resolve, reject) => {
        const promiseList = []
        this.posList.forEach((pos) => {
          if (this.opt_color[pos].color_img) {
            promiseList.push(
              this.$refs.pictureDesigner.addColorImg(this.opt_color[pos].color_img_url, pos)
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
    addAllOutlineToCanvas() {
      return new Promise((resolve, reject) => {
        const promiseList = []
        this.posList.forEach((pos) => {
          if (this.opt_color[pos].outline_img) {
            promiseList.push(
              this.$refs.pictureDesigner.addOutlineToCanvas(
                this.opt_color[pos].outline_img_url,
                pos
              )
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
    addAllOriginImg(item) {
      return new Promise((resolve, reject) => {
        const promiseList = []
        this.posList.forEach((pos) => {
          if (item[`material_img_${pos}`]) {
            promiseList.push(
              this.$refs.pictureDesigner.addOriginImg(item[`material_img_${pos}_url_ori`], pos)
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
    addOriginImg(img, pos) {
      this.$refs.pictureDesigner.addOriginImg(img, pos)
    },

    async addOutline() {
      try {
        // 1. 清除画布上其他的东西
        this.$refs.pictureDesigner.removeAllColor()
        this.$refs.pictureDesigner.removeAllOutline()
        // 2. 添加轮廓
        await this.addAllOutlineToCanvas()
        // 3. 截图
        const prune_img_data = await this.$refs.pictureDesigner.getFullOutline()
        // 4. 添加到遮罩层
        await this.$refs.pictureDesigner.addOutlineMask(prune_img_data)
        // 5. 清楚第二步添加的轮廓
        this.$refs.pictureDesigner.removeAllOutline()
        // 6. 刷新
        this.$refs.pictureDesigner.renderAll()
      } catch (error) {
        console.error(error)
      }
      // await this.$refs.pictureDesigner.addOutlineMask(require('@/assets/images/test.png'))
    },
    async previewAll() {
      return await this.$refs.pictureDesigner.getPreviewData()
    },
    removeAllOriginImg() {
      this.$refs.pictureDesigner.removeAllOriginImg()
      this.$refs.pictureDesigner.renderAll()
    }
  }
}
</script>

<style lang="scss" scoped>
.designer-list {
  display: flex;
}
</style>
