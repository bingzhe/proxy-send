<template>
  <sl-dialog
    ref="adjustOrderFee"
    title="调整订单金额"
    :validate="true"
    confirm-text="提交"
    @close="handerDialogClose"
    @confirm="handlerDialogConfirm"
  >
    <!-- @open="handlerDialogOpen" -->
    <el-form
      ref="adjustOrderFeeForm"
      :model="adjustOrderFeeForm"
      :rules="adjustOrderFeeFormRules"
      label-width="130px"
    >
      <el-form-item label="调整方式" prop="way">
        <el-radio v-model="adjustOrderFeeForm.way" :label="1">
          减免
        </el-radio>
        <el-radio v-model="adjustOrderFeeForm.way" :label="2">
          增加
        </el-radio>
      </el-form-item>
      <el-form-item label="调整金额" prop="fee">
        <el-input
          v-model.trim="adjustOrderFeeForm.fee"
          v-limit-input-number="adjustOrderFeeForm.fee"
          data-dotrange="{0,2}"
          placeholder="请输入"
        >
          <span slot="suffix" class="input-suffix-text">元</span>
        </el-input>
      </el-form-item>
      <el-form-item label="调整原因" prop="remark">
        <el-input
          v-model="adjustOrderFeeForm.remark"
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
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      adjustOrderFeeForm: {
        way: 0,                      // 调整方式(1:减免, 2:增加)
        fee: '',                     // 调整金额(元)
        remark: ''                   // 调整原因
      },
      adjustOrderFeeFormRules: {
        way: [{ required: true, message: '请选择减免方式', trigger: 'change' }],
        fee: [{ required: true, message: '请输入调整金额', trigger: 'blur' }]
      }
    }
  },

  methods: {
    show() {
      this.$refs.adjustOrderFee.show()
    },
    handerDialogClose() {
      this.$refs.adjustOrderFeeForm.resetFields()
      this.$emit('clsoe')
    },
    // handlerDialogOpen() {
    //   this.adjustOrderFeeForm.actual_fee = this.refundInfo.actual_fee
    // },
    handlerDialogConfirm() {
      this.$refs.adjustOrderFeeForm.validate(valid => {
        if (valid) {
          this.adjustFeeOpr()
        }
      })
    },
    async adjustFeeOpr() {
      const data = {
        opr: 'adjust_order_fee',
        order_id: this.orderId,
        way: this.adjustOrderFeeForm.way,
        fee: this.adjustOrderFeeForm.fee,
        remark: this.adjustOrderFeeForm.remark
      }

      console.log('调整订单金额 req=>', data)
      const resp = await orderSave(data)
      console.log('调整订单金额 res=>', resp)

      if (resp.ret !== 0) return

      this.$refs.adjustOrderFee.hide()
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
