<template>
  <sl-dialog
    ref="dialogSelectAudit"
    title="审核"
    :showFooter="false"
    :showClose="false"
    :closeOnClickModal="false"
    :closeOnPressEscape="false"
    :validate="true"
    top="15vh"
  >
    <el-form
      ref="queryOrderAuditForm"
      :model="queryOrderAuditForm"
      :rules="queryOrderAuditFormRules"
      label-width="100px"
    >
      <el-form-item label="操作" prop="pass">
        <el-radio v-model="queryOrderAuditForm.pass" :label="1"> 审核通过 </el-radio>
        <el-radio v-model="queryOrderAuditForm.pass" :label="0"> 审核不通过 </el-radio>
      </el-form-item>
      <el-form-item label="原因" prop="remark">
        <el-input
          v-model="queryOrderAuditForm.remark"
          :rows="3"
          type="textarea"
          placeholder="请输入"
          maxlength="150"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div class="handle-file-process-text" v-html="progressContent"></div>
    <div class="footer-content">
      <el-button type="primary" :disabled="disabledButton" @click="starHandle">
        开始处理
      </el-button>
      <el-button type="primary" @click="stopHandle"> 中止处理 </el-button>
      <el-button type="primary" :disabled="disabledButton" @click="handleCloseClick">
        关闭
      </el-button>
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
    multipleSelection: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      task_id: '', // 开始处理后的id

      queryOrderAuditForm: {
        pass: '', // 结论(1:审核通过, 0:不通过)
        remark: '' // 原因(不通过时说明原因)
      },

      queryOrderAuditFormRules: {
        pass: [{ required: true, message: '请选择操作' }]
      },

      disabledButton: false,

      progressContent: '',

      setintervalId: ''
    }
  },
  methods: {
    show() {
      this.$refs.dialogSelectAudit.show()
    },
    handerDialogClose() {
      this.$emit('clsoe')
    },
    handleCloseClick() {
      this.$emit('close-dialog')
      this.$refs.dialogSelectAudit.hide()
      this.$refs.queryOrderAuditForm.resetFields()
      this.task_id = ''
      this.progressContent = ''
      if (this.setintervalId) {
        clearInterval(this.setintervalId)
      }
    },
    starHandle() {
      this.$refs.queryOrderAuditForm.validate(async(valid) => {
        if (!valid) return

        const order_id_list = this.multipleSelection.map((item) => {
          return item.order_id
        })

        const data = {
          opr: 'create_task',
          type: 12,
          data: {
            order_id_list,
            pass: this.queryOrderAuditForm.pass,
            remark: this.queryOrderAuditForm.remark // 操作说明（可以为空）
          }
        }

        console.log('审核接口任务 req=>', data)
        const resp = await taskSave(data)
        console.log('审核接口 res=>', resp)

        if (resp.ret !== 0) return

        this.disabledButton = true
        this.task_id = resp.data.task_id

        this.getHandleFileProgress()
      })
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
        opr: 'cancel_task',
        task_id: this.task_id // 任务id
      }

      // console.log('停止处理 req=>', JSON.stringify(data))
      const resp = await taskSave(data)
      console.log('停止处理 res=>', JSON.stringify(resp.data))

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
  margin-bottom: 40px;
  margin-left: 100px;
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
/deep/ .el-dialog__body {
  padding-right: 40px;
}
</style>
