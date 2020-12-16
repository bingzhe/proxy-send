<template>
  <sl-dialog
    ref="exportGoods"
    title="导出商品"
    :showFooter="false"
    :showClose="false"
    :closeOnClickModal="false"
    :closeOnPressEscape="false"
  >
    <el-input
      v-model="progressContent"
      class="handle-file-process-text"
      type="textarea"
      :rows="6"
      readonly
    ></el-input>
    <div class="footer-content">
      <el-button type="primary" :disabled="disabledButton" @click="handleStartExport">开始导出</el-button>
      <el-button type="primary" @click="stopHandle">中止处理</el-button>
      <el-button
        type="primary"
        :disabled="disabledButton"
        @click="handleCloseClick"
      >关闭</el-button>
    </div>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import { goodsSave, progressGet, goodsGet } from '@/api/api'

export default {
  components: {
    SlDialog
  },
  props: {
    searchForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      task_id: '', // 开始处理后的id

      disabledButton: false,

      progressContent: '',

      setintervalId: ''
    }
  },
  methods: {
    show() {
      this.$refs.exportGoods.show()
    },
    handerDialogClose() {
      this.$emit('clsoe')
    },
    handleCloseClick() {
      this.$emit('close-dialog')
      this.$refs.exportGoods.hide()
      this.task_id = ''
      this.progressContent = ''
      if (this.setintervalId) {
        clearInterval(this.setintervalId)
      }
    },
    async handleStartExport() {
      const data = {
        opr: 'goods_export'
      }

      // 材质
      console.log(this.searchForm)
      if (this.searchForm.goods_material) {
        data.goods_material = this.searchForm.goods_material
      }
      // 商品种类
      if (this.searchForm.type) {
        data.type = this.searchForm.type
      }
      // 品牌
      if (this.searchForm.brand) {
        data.brand = this.searchForm.brand
      }
      // 型号
      if (this.searchForm.model) {
        data.model = this.searchForm.model
      }
      // 商品名称
      if (this.searchForm.goods_name) {
        data.goods_name = this.searchForm.goods_name
      }
      // 商品编号
      if (this.searchForm.goods_id) {
        data.goods_id = this.searchForm.goods_id
      }
      // 商品库存 查找
      if (this.searchForm.goods_stock_type === 'more') {
        data.inventory_gte = this.searchForm.goods_stock
      } else if (this.searchForm.goods_stock_type === 'less') {
        data.inventory_lte = this.searchForm.goods_stock
      }

      // console.log('商品导出 req=>', data)
      const resp = await goodsGet(data)
      console.log('商品导出， res=>', resp)

      if (resp.ret !== 0) return

      this.disabledButton = true
      this.task_id = resp.data.task_id

      this.getHandleFileProgress()
    },

    getHandleFileProgress() {
      const data = {
        opr: 'get_progress_info',
        task_id: this.task_id // 任务id
      }

      this.setintervalId = setInterval(async() => {
        // console.log('操作进度信息 req=>', JSON.stringify(data))
        const resp = await progressGet(data)
        console.log('操作进度信息 res=>', JSON.stringify(resp.data))
        if (resp.ret !== 0) return

        this.progressContent = resp.data.content

        // stop: 0, 当为1时，停止调用本接口
        if (resp.data.stop === 1) {
          clearInterval(this.setintervalId)
          this.disabledButton = false
        }
      }, 3000)
    },

    async stopHandle() {
      const data = {
        opr: 'cancel_goods_import',
        task_id: this.task_id // 任务id
      }

      // console.log('停止文件处理 req=>', JSON.stringify(data))
      const resp = await goodsSave(data)
      console.log('停止文件处理 res=>', JSON.stringify(resp.data))

      if (resp.ret !== 0) return

      clearInterval(this.setintervalId)
      this.disabledButton = false
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-content {
  text-align: center;
}
.handle-file-process-text {
  padding: 0 40px;
  margin: 20px 0;
}
</style>
