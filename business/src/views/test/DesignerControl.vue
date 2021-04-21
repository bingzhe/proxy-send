<template>
  <div>
    <PictureDesigner ref="pictureDesigner" :mode="mode" :posList="posList" />
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

      mode: 1, // 设计器模式 1：中左右上下 2：中右 3：中左
      posList: ['back']
    }
  },
  methods: {
    updateData(info) {
      const printParam = {
        back: info.img_print_param,
        left: info.img_print_param_left,
        right: info.img_print_param_right,
        top: info.img_print_param_bottom,
        bottom: info.img_print_param_top
      }

      if (
        !(
          printParam.top.width &&
          printParam.top.height &&
          printParam.bottom.width &&
          printParam.bottom.height
        )
      ) {
        if (
          !(
            printParam.left.width &&
            printParam.left.height &&
            printParam.right.width &&
            printParam.right.height
          )
        ) {
          this.mode = 3
        } else {
          this.mode = 2
        }
      } else {
        this.mode = 1
      }

      // 渲染的位置有哪些
      if (this.mode === 1) {
        this.posList.push('left', 'right', 'top', 'bottom')
      } else if (this.mode === 2) {
        this.posList.push('left', 'right')
      }
      console.log(this.mode)

      this.opt_color_list = info.opt_color_list

      this.$refs.pictureDesigner.updateDateBeforeInit(printParam)

      // >>>>>>> colors
      this.opt_color = this.opt_color_list[0]

      this.$nextTick(async () => {
        // 更新图片的定位距离
        this.$refs.pictureDesigner.setPosition()

        this.$refs.pictureDesigner.init()

        await this.addOutline()
        await this.addAllColorImg()

        const url3 =
          'http://b.pso.rockyshi.cn/php/img_get.php?token=T1mcrZXEpVwIU5kI&opr=get_img&type=1&img_name=7bde61719434db210bbab019f801f56f.jpg'
        this.$refs.pictureDesigner.addOriginImg(url3)
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
    async addOutline() {
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
    },
    async getPreviewData() {
      console.log(222)
      const { prune_img_data, preview_img_data } = await this.$refs.leftDesigner.getPreviewData()
      return { prune_img_data, preview_img_data }
    }
  }
}
</script>

<style lang="scss" scoped>
.designer-list {
  display: flex;
}
</style>
