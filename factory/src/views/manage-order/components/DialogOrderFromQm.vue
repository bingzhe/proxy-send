<template>
  <sl-dialog ref="uploadGoodsExecl" title="抓单" :showFooter="false" :showClose="false">
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="淘宝单号" prop="order_id" label-width="70px">
          <el-input v-model.trim="searchForm.order_id" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="店铺名称" prop="tshop_name" label-width="70px">
          <el-input v-model.trim="searchForm.tshop_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="开始时间" prop="tshop_name" label-width="70px">
          <el-input v-model.trim="searchForm.start_time" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="结束时间" prop="tshop_name" label-width="70px">
          <el-input v-model.trim="searchForm.end_time" placeholder="请输入" />
        </el-form-item>

      </el-form>
    </div>

    <div class="handle-file-process-text" v-html="progressContent" />
    <div class="footer-content">
      <el-button type="primary" :disabled="disabledButton" @click="starHandle">
        开始抓单
      </el-button>
      <el-button type="primary" @click="stopHandleFile">
        中止抓单
      </el-button>
      <el-button type="primary" :disabled="disabledButton" @click="handleCloseClick">
        关闭
      </el-button>
    </div>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import { progressGet, orderSave } from '@/api/api'

export default {
  components: {
    SlDialog
  },
  data() {
    return {
      searchForm: {
        order_id: '', // 订单id
        tshop_name: '', // 店铺名称
        start_time: '', // 开始时间
        end_time: '' // 结束时间
      },

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
      this.$refs.searchForm.resetFields()
      this.task_id = ''
      this.progressContent = ''
      if (this.setintervalId) {
        clearInterval(this.setintervalId)
      }
    },

    async starHandle() {
      const data = {
        opr: 'begin_sync_order_from_qm',
        order_id: this.searchForm.order_id, // 订单id
        tshop_name: this.searchForm.tshop_name, // 店铺名称
        start_time: this.searchForm.start_time, // 开始时间
        end_time: this.searchForm.end_time // 结束时间
      }

      console.log('开始抓单， req=>', data)
      const resp = await orderSave(data)
      console.log('开始抓单， res=>', resp)

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
        opr: 'cancel_sync_order_from_qm',
        task_id: this.task_id // 任务id
      }

      // console.log('中止抓单 req=>', JSON.stringify(data))
      const resp = await orderSave(data)
      console.log('中止抓单 res=>', JSON.stringify(resp.data))

      if (resp.ret !== 0) return

      // clearInterval(this.setintervalId)
      this.progressContent = ''
      this.disabledButton = false
    }
  }
}
</script>

<style lang="scss" scoped>
// .upload-wrapper {
//   display: flex;
//   padding: 0 40px;
// }
.footer-content {
  text-align: center;
}
.select-file-btn {
  margin-left: 20px;
  padding-top: 11px;
  padding-bottom: 11px;
}
.handle-file-process-text {
  margin: 0 40px 20px;
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
// .progress-wrapper {
//   position: absolute;
//   top: 86px;
//   left: 61px;
//   height: 32px;
//   width: 568px;
//   /deep/ .el-progress-bar__outer {
//     background: #fff;
//     border-radius: 0;
//   }
//   /deep/ .el-progress-bar__inner {
//     border-radius: 0;
//   }
// }
.search-wrapper{
    /deep/ .el-input {
        width: 280px;
    }
}
</style>
