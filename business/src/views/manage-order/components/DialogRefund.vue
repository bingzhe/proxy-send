<template>
  <sl-dialog
    ref="orderRefundDialog"
    title="订单退款"
    :validate="true"
    confirm-text="提交"
    @close="handerDialogClose"
    @open="handlerDialogOpen"
    @confirm="handlerDialogConfirm"
  >
    <el-form ref="refundForm" :model="refundForm" :rules="refundFormRules" label-width="130px">
      <el-form-item label="实付金额" prop="actual_fee">
        <span>{{ refundForm.actual_fee }}元</span>
      </el-form-item>
      <el-form-item label="退款金额" prop="refund_fee">
        <el-input
          v-model.trim="refundForm.refund_fee"
          v-limit-input-number="refundForm.refund_fee"
          data-dotrange="{0,2}"
          placeholder="请输入"
        >
          <span slot="suffix" class="input-suffix-text">元</span>
        </el-input>
      </el-form-item>
      <el-form-item label="退款原因" prop="refund_remark">
        <el-input
          v-model="refundForm.refund_remark"
          :rows="3"
          type="textarea"
          placeholder="请输入"
          maxlength="150"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import { orderSave } from '@/api/api'

export default {
  components: {
    SlDialog
  },
  props: {
    refundInfo: {
      type: Object,
      required: true,
      default: () => {
        return {
          order_id: '',
          actual_fee: ''
        }
      }
    }
  },
  data() {
    return {
      refundForm: {
        actual_fee: '',
        refund_fee: '',
        refund_remark: ''
      },
      refundFormRules: {
        refund_fee: [{ required: true, message: '请输入退款金额' }]
      }
    }
  },

  methods: {
    show() {
      this.$refs.orderRefundDialog.show()
    },
    handerDialogClose() {
      this.$refs.refundForm.resetFields()
      this.$emit('clsoe')
    },
    handlerDialogOpen() {
      this.refundForm.actual_fee = this.refundInfo.actual_fee
    },
    handlerDialogConfirm() {
      this.$refs.refundForm.validate(valid => {
        if (valid) {
          this.saveReFundOrder()
        }
      })
    },
    async saveReFundOrder() {
      const data = {
        opr: 'order_refund',
        order_id: this.refundInfo.order_id,               // 订单id
        refund_fee: this.refundForm.refund_fee,           // 退款金额(元)
        refund_remark: this.refundForm.refund_remark      // 退款原因
      }

      console.log('订单退款 req=>', data)
      const resp = await orderSave(data)
      console.log('订单退款 res=>', resp)

      if (resp.ret !== 0) return

      this.$refs.orderRefundDialog.hide()
      this.$emit('on-success')
      this.handerDialogClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 300px;
}
.el-textarea {
  width: 450px;
  margin-bottom: 80px;
}
.change-tip {
  position: relative;
  top: -25px;
  font-size: 12px;
  color: #db0303;
}
.input-suffix-text {
  color: #333;
  margin-right: 10px;
}
</style>
