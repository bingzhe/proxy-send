<template>
  <sl-dialog ref="uploadGoodsExecl" title="上传商品" :showFooter="false" :showClose="false" :closeOnClickModal="false" :closeOnPressEscape="false">
    <div class="upload-wrapper">
      <el-input v-model="oriname" readonly></el-input>

      <el-upload :show-file-list="false" :http-request="upload" :action="url">
        <el-button class="select-file-btn" type="primary" :disabled="showProgress">选择</el-button>
      </el-upload>
    </div>
    <div class="handle-file-process-text" v-html="progressContent" />
    <div class="footer-content">
      <el-button type="primary" :disabled="disabledButton" @click="starHandle">开始导入</el-button>
      <el-button type="primary" @click="stopHandleFile">中止处理</el-button>
      <el-button type="primary" :disabled="disabledButton" @click="handleCloseClick">关闭</el-button>
    </div>
    <div v-if="showProgress" class="progress-wrapper">
      <el-progress :text-inside="true" :stroke-width="36" :percentage="progressPercent"></el-progress>
    </div>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import Http from '@/config/encsubmit'
import { goodsSave, progressGet } from '@/api/api'

export default {
  components: {
    SlDialog
  },
  data() {
    return {
      url: process.env.VUE_APP_BASEURL + '/file_save.php',

      file_id: '', // 文件上传接口返回的文件id
      file_md5: '', // 文件上传接口返回的文件md5
      oriname: '',

      task_id: '', // 开始处理后的id

      disabledButton: false,

      progressContent: '',

      setintervalId: '',

      progressPercent: 0,
      showProgress: false
    }
  },
  methods: {
    show() {
      this.$refs.uploadGoodsExecl.show()
    },
    handerDialogClose() {
      this.$emit('clsoe')
    },
    handleCloseClick() {
      this.$emit('close-dialog')
      this.$refs.uploadGoodsExecl.hide()
      this.file_id = ''
      this.file_md5 = ''
      this.task_id = ''
      this.oriname = ''
      this.progressContent = ''
      if (this.setintervalId) {
        clearInterval(this.setintervalId)
      }
    },
    upload({ file }) {
      const data = {
        opr: 'file_upload',
        type: 1,
        file: file
      }

      this.showProgress = true
      Http.EncSubmit(
        this.url,
        data,
        (resp) => {
          console.log('上传文件 resp', resp)
          this.showProgress = false
          this.progressPercent = 0
          if (resp.ret !== 0) {
            return this.$message.error(resp.msg)
          }

          this.file_id = resp.data.file_id
          this.file_md5 = resp.data.file_md5
          this.oriname = resp.data.oriname

          // this.$emit('on-success', resp.data)
        },
        {
          UploadProgress: ({ complete, loaded, total }) => {
            // console.log(complete, loaded, total)
            this.progressPercent = complete
          }
        }
      )
    },
    async starHandle() {
      if (!this.file_id) {
        return this.$message.error('请先上传要导入的文件')
      }
      const data = {
        opr: 'goods_import_from_file',
        file_id: this.file_id, // 文件上传接口返回的文件id
        file_md5: this.file_md5 // 文件上传接口返回的文件md5
      }

      // console.log('开始导入， req=>', data)
      const resp = await goodsSave(data)
      console.log('开始导入， res=>', resp)

      if (resp.ret !== 0) return

      this.disabledButton = true
      this.task_id = resp.data.task_id

      this.getHandleFileInfo()
    },

    getHandleFileInfo() {
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

    async stopHandleFile() {
      const data = {
        opr: 'cancel_goods_import',
        task_id: this.task_id // 任务id
      }

      // console.log('停止文件处理 req=>', JSON.stringify(data))
      const resp = await goodsSave(data)
      console.log('停止文件处理 res=>', JSON.stringify(resp.data))

      if (resp.ret !== 0) return

      // clearInterval(this.setintervalId)
      this.disabledButton = false
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-wrapper {
  display: flex;
  padding: 0 40px;
}
.footer-content {
  text-align: center;
}
.select-file-btn {
  margin-left: 20px;
  padding-top: 11px;
  padding-bottom: 11px;
}
.handle-file-process-text {
  margin: 20px 40px;
  border: 1px solid #e6e6e6;
  height: 120px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    border-color: #2584f9;
  }
  /deep/  a {
    color: #2584f9;
  }
}
.progress-wrapper {
  position: absolute;
  top: 86px;
  left: 61px;
  height: 32px;
  width: 568px;
  /deep/ .el-progress-bar__outer {
    background: #fff;
    border-radius: 0;
  }
  /deep/ .el-progress-bar__inner {
    border-radius: 0;
  }
}
</style>
