<template>
  <sl-dialog
    ref="rechargeApplyDialog"
    title="充值受理"
    confirm-text="提交"
    :validate="true"
    top="12vh"
    width="900px"
    @confirm="handlerApplyConfirm"
    @close="handlerApplyClose"
    @open="handlerApplyOpen"
  >
    <div class="recharge-info-wrapper clearfix">
      <div class="recharge-info">
        <div v-for="(item,key) in recharegeInfo" :key="key" class="info-item">
          <span class="info-label">{{ item.label }}：</span>
          <span class="info-value">{{ item.value }}</span>
        </div>
      </div>
      <div class="recharge-picture">
        <img :src="screenshot_img_url">
      </div>
    </div>
    <el-form
      ref="rechargeForm"
      :model="rechargeForm"
      :rules="rechargeFormRules"
      label-width="134px"
    >
      <el-form-item label="处理结果" prop="pass">
        <el-radio v-model="rechargeForm.pass" :label="1">通过</el-radio>
        <el-radio v-model="rechargeForm.pass" :label="0">未通过</el-radio>
      </el-form-item>
      <el-form-item label="充值金额" prop="delivery_number">
        <el-input
          v-model.trim="rechargeForm.amount"
          v-limit-input-number="rechargeForm.amount"
          data-dotrange="{0,2}"
          disabled
          placeholder="请输入"
        >
          <span slot="suffix" class="input-suffix-text">元</span>
        </el-input>
      </el-form-item>
      <el-form-item label="原因" prop="remark">
        <el-input
          v-model="rechargeForm.remark"
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
import { rechargeGet, rechargeSave } from '@/api/api'
import moment from 'moment'

export default {
  components: {
    SlDialog
  },

  props: {
    depositId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      token: window.Store.GetGlobalData('token'),
      base_url: process.env.VUE_APP_BASEURL,

      recharegeInfo: {
        channel: { label: '转账渠道', value: '' },          // 充值渠道(1:微信, 2:支付宝, 3:其他)
        deposit_number: { label: '订单号', value: '' },     // 充值单号/转账订单号（外部充值订单号，对应各类充值，如微信、支付宝等）
        business_name: { label: '商户名称', value: '' },    // 商户名称
        business_telephone: { label: '商户电话', value: '' },   // 商户电话
        amount: { label: '充值金额', value: '' },           // 转账金额
        deposit_time: { label: '充值时间', value: '' },     // 充值时间
        input_remark: { label: '留言', value: '' }       // 留言
      },

      screenshot_img_url: '',

      rechargeForm: {
        pass: 0,                  // 处理结果(1:审核通过, 0:不通过)
        amount: '',               // 充值金额
        remark: ''                // 审核备注
      },

      rechargeFormRules: {}
    }
  },

  methods: {
    show() {
      this.$refs.rechargeApplyDialog.show()
    },
    handlerApplyConfirm() {
      this.$refs.rechargeForm.validate(valid => {
        if (valid) {
          this.rechargeAudit()
        }
      })
    },
    async rechargeAudit() {
      const data = {
        opr: 'recharge_audit',
        deposit_id: this.depositId,
        pass: this.rechargeForm.pass,
        remark: this.rechargeForm.remark
      }

      console.log('调整账户余额 req=>', data)
      const resp = await rechargeSave(data)
      console.log('调整账户余额 res=>', resp)

      if (resp.ret !== 0) return

      this.$emit('on-success')
      this.handlerApplyClose()
      this.$refs.rechargeApplyDialog.hide()
      this.$notify({
        title: '成功',
        message: '保存成功',
        type: 'success'
      })
    },
    handlerApplyClose() {
      this.$refs.rechargeForm.resetFields()
      this.$emit('close')
    },

    async handlerApplyOpen() {
      const data = {
        opr: 'get_recharge_info',
        deposit_id: this.depositId                // 充值ID
      }

      console.log('充值订单信息 req=>', data)
      const resp = await rechargeGet(data)
      console.log('充值订单信息 res=>', resp)

      if (resp.ret !== 0) return

      const info = resp.data

      this.recharegeInfo.channel.value = info.channel
      this.recharegeInfo.deposit_number.value = info.deposit_number
      this.recharegeInfo.business_name.value = info.business_name
      this.recharegeInfo.business_telephone.value = info.business_telephone
      this.recharegeInfo.amount.value = info.amount
      this.recharegeInfo.deposit_time.value = moment(info.deposit_time * 1000).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      this.recharegeInfo.input_remark.value = info.input_remark
      this.rechargeForm.amount = info.amount

      this.screenshot_img_url = `${this.base_url}/img_get.php?token=${this.token}&opr=get_img&width200&height=260&type=2&img_name=${info.screenshot_img}`
    }
  }

}
</script>

<style lang="scss" scoped>
.el-input {
  width: 300px;
}
.el-textarea {
  width: 480px;
}
.el-form {
  margin-bottom: 30px;
}
.el-form-item {
  margin-bottom: 18px;
}
.input-suffix-text {
  color: #333;
  margin-right: 10px;
}
/deep/ .el-dialog__body {
  padding-top: 16px;
}
.recharge-info-wrapper {
  background: #f9f9f9;
  margin: 0 20px;

  .recharge-info {
    float: left;

    .info-item {
      margin: 10px 0 15px;
      .info-label {
        display: inline-block;
        width: 110px;
        text-align: right;
        font-weight: bold;
        color: #666;
        vertical-align: top;
      }
      .info-value {
        display: inline-block;
        max-width: 400px;
      }
    }
  }
  .recharge-picture {
    float: right;
    margin: 10px 30px 10px 0;
    img {
      width: 200px;
      height: 260px;
    }
  }
}
</style>

