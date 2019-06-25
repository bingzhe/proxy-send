<template>
  <sl-dialog
    ref="rechargeDialog"
    title="账户充值"
    confirm-text="提交"
    :validate="true"
    top="12vh"
    @confirm="handlerDialogConfirm"
    @close="handlerDialogClose"
  >
    <!-- @open="handlerAdjustOpen" -->
    <el-form
      ref="rechargeForm"
      :model="rechargeForm"
      :rules="rechargeFormRules"
      label-width="134px"
    >
      <el-form-item label="充值渠道" prop="channel">
        <el-radio-group v-model="rechargeForm.channel" @change="handlerChannelChange">
          <el-radio
            v-for="(item,index) in input_account_list"
            :key="index"
            :label="item.type"
          >{{ item.type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="工厂收款账号" prop="input_account">
        <span>{{ rechargeForm.input_account }}</span>
      </el-form-item>
      <el-form-item label="转账订单号" prop="deposit_number">
        <el-input v-model.trim="rechargeForm.deposit_number" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="转账账户" prop="output_account">
        <el-input v-model.trim="rechargeForm.output_account" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="转账金额" prop="amount">
        <el-input
          v-model.trim="rechargeForm.amount"
          v-limit-input-number="rechargeForm.amount"
          data-dotrange="{0,2}"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="转账截图" prop="screenshot_img">
        <sl-upload class="outline-uploader" :type="2" @on-success="handlerScreenshotSuc">
          <img
            v-if="rechargeForm.screenshot_img"
            :src="rechargeForm.screenshot_img_url"
            class="upload-preview"
          >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </sl-upload>
      </el-form-item>
      <el-form-item label="留言" prop="input_remark">
        <el-input
          v-model="rechargeForm.input_remark"
          :rows="2"
          type="textarea"
          placeholder="请输入"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import SlUpload from '@/components/upload/index'
import { rechargeSave } from '@/api/api'
import { mapState } from 'vuex'

export default {
  components: {
    SlDialog,
    SlUpload
  },

  props: {

  },

  data() {
    return {
      token: window.Store.GetGlobalData('token'),

      rechargeForm: {
        channel: '',                      // 充值渠道("微信", "支付宝", "其他")
        input_account: '',                // 工厂收款账号（收款）
        deposit_number: '',               // 充值单号/转账订单号（外部充值订单号，对应各类充值，如微信、支付宝等）
        output_account: '',               // 转账账户（付款）
        amount: '',                       // 转账金额（元）
        screenshot_img: '',               // 转账截图
        screenshot_img_url: '',
        input_remark: ''                  // 充值备注（留言）
      },
      rechargeFormRules: {
        channel: [{ required: true, message: '请选择充值渠道', trigger: 'change' }],
        input_account: [{ required: true, message: '请输入工厂收款账号', trigger: 'blur' }],
        deposit_number: [{ required: true, message: '请输入转账订单号', trigger: 'blur' }],
        output_account: [{ required: true, message: '请输入转账账户', trigger: 'blur' }],
        amount: [{ required: true, message: '请输入转账金额', trigger: 'blur' }]
        // screenshot_img: [{ required: true, message: '请上传转账截图' }]
      }
    }
  },
  computed: {
    ...mapState({
      input_account_list: state => state.user.input_account_list
    })
  },
  methods: {
    show() {
      this.$refs.rechargeDialog.show()
    },
    handlerDialogConfirm() {
      this.$refs.rechargeForm.validate(valid => {
        if (valid) {
          this.rechargeOpr()
        }
      })
    },
    async rechargeOpr() {
      const data = {
        opr: 'save_recharge',
        deposit_number: this.rechargeForm.deposit_number,           // 充值单号/转账订单号（外部充值订单号，对应各类充值，如微信、支付宝等）
        channel: this.rechargeForm.channel,                         // 充值渠道("微信", "支付宝", "其他")
        input_account: this.rechargeForm.input_account,             // 工厂收款账号（收款）
        output_account: this.rechargeForm.output_account,           // 转账账户（付款）
        amount: this.rechargeForm.amount,                           // 转账金额（元）
        input_remark: this.rechargeForm.input_remark,               // 充值备注（留言）
        screenshot_img: this.rechargeForm.screenshot_img            // 转账截图
      }

      console.log('账户充值 req=>', data)
      const resp = await rechargeSave(data)
      console.log('账户充值 res=>', resp)

      if (resp.ret !== 0) return

      this.$emit('on-success')
      this.handlerDialogClose()
      this.$refs.rechargeDialog.hide()
      this.$slnotify({
        message: '充值成功'
      })
    },
    handlerDialogClose() {
      this.$refs.rechargeForm.resetFields()
      this.$emit('close')
    },
    handlerScreenshotSuc({ img_name }) {
      this.rechargeForm.screenshot_img = img_name
      this.rechargeForm.screenshot_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${
        this.token
      }&opr=get_img&type=2&width=117&height=140&img_name=${img_name}`
    },
    handlerChannelChange(val) {
      const select = this.input_account_list.filter(item => {
        return item.type === val
      })
      this.rechargeForm.input_account = (select[0] || {}).account
    }
  }

}
</script>

<style lang="scss" scoped>
.el-input {
  width: 300px;
}
.el-select {
  width: 300px;
}
.el-textarea {
  width: 480px;
}
.el-form {
  margin-bottom: 30px;
}
.input-suffix-text {
  color: #333;
  margin-right: 10px;
}
/deep/ .outline-uploader {
  .el-upload {
    border: 1px dashed #e6e6e6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #2584f9;
  }
  .avatar-uploader-icon {
    font-size: 30px;
    color: #2584f9;
    width: 117px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }
  .upload-preview {
    width: 117px;
    height: 140px;
    display: block;
  }
}
</style>

