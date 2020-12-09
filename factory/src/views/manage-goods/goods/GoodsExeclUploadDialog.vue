<template>
  <sl-dialog ref="uploadGoodsExecl" title="上传商品" :showFooter="false">
    <div class="upload-wrapper">
      <el-input></el-input>
      <el-upload :show-file-list="false" :http-request="upload" :action="url">
        <el-button type="primary">选择</el-button>
      </el-upload>
    </div>
    <div class="footer-content">
      <el-button class="btn-bd-primary" @click="handleStartClick">开始导入</el-button>
      <el-button type="primary" @click="handleStopClick">中止处理</el-button>
      <el-button type="primary" @click="handleCloseClick">关闭</el-button>
    </div>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import Http from '@/config/encsubmit'

export default {
  components: {
    SlDialog
  },
  data() {
    return {
      url: process.env.VUE_APP_BASEURL + '/file_save.php'
    }
  },
  methods: {
    show() {
      this.$refs.uploadGoodsExecl.show()
    },
    handerDialogClose() {
      this.$emit('clsoe')
    },
    handleStartClick() {},
    handleStopClick() {},
    handleCloseClick() {
      this.$refs.uploadGoodsExecl.hide()
    },
    upload({ file }) {
      console.log({ file })

      const data = {
        opr: 'file_upload',
        type: 1,
        file: file
      }

      Http.EncSubmit(this.url, data, (resp) => {
        console.log(resp)
        if (resp.ret !== 0) {
          return this.$message.error(resp.msg)
        }

        // this.$emit('on-success', resp.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-wrapper {
  display: flex;
  padding: 0 30px;
}
.footer-content {
  text-align: center;
}
</style>
