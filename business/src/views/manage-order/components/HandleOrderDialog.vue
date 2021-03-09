<template>
  <sl-dialog ref="handleOrder" title="提交订单" :showFooter="false" :showClose="false" :closeOnClickModal="false" :closeOnPressEscape="false">
    <div class="handle-file-process-text" v-html="progressContent"></div>
    <div class="footer-content">
      <el-button type="primary" :disabled="disabledButton" @click="handleStart">开始处理</el-button>
      <el-button type="primary" @click="stopHandle">中止处理</el-button>
      <el-button type="primary" :disabled="disabledButton" @click="handleCloseClick">关闭</el-button>
    </div>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import { progressGet, taskSave } from '@/api/api'

export default {
  components: {
    SlDialog
  },
  props: {
    selectOrderIdList: {
      type: Array,
      default: () => {
        return []
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
      this.$refs.handleOrder.show()
    },
    handerDialogClose() {
      this.$emit('clsoe')
    },
    handleCloseClick() {
      this.$emit('close-dialog')
      this.$refs.handleOrder.hide()
      this.task_id = ''
      this.progressContent = ''
      if (this.setintervalId) {
        clearInterval(this.setintervalId)
      }
    },
    async handleStart() {
      const data = {
        opr: 'create_task',
        type: 11,
        order_id_list: this.selectOrderIdList
      }

      console.log('订单处理 req=>', data)
      const resp = await taskSave(data)
      console.log('订单处理 res=>', resp)

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

      this.setintervalId = setInterval(async () => {
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
        opr: 'cancel_task',
        task_id: this.task_id // 任务id
      }

      // console.log('停止文件处理 req=>', JSON.stringify(data))
      const resp = await taskSave(data)
      console.log('停止文件处理 res=>', JSON.stringify(resp.data))

      if (resp.ret !== 0) return

      // clearInterval(this.setintervalId)
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
  margin: 20px 40px;
  border: 1px solid #e6e6e6;
  height: 120px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    border-color: #2584f9;
  }

  /deep/ a {
    color: #2584f9;
  }
}
</style>
