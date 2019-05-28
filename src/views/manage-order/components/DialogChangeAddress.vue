<template>
  <sl-dialog
    ref="changeAddress"
    title="修改收货人信息"
    :validate="true"
    width="900px"
    top="12vh"
    confirm-text="提交"
    @close="handerDialogClose"
    @confirm="handlerDialogConfirm"
  >
    <!-- @open="handlerDialogOpen" -->
    <el-form
      ref="changeAddressForm"
      :model="changeAddressForm"
      :rules="changeAddressFormRules"
      label-width="130px"
    >
      <el-form-item label="调整方式" prop="way">
        <el-radio v-model="changeAddressForm.way" :label="1">减免</el-radio>
        <el-radio v-model="changeAddressForm.way" :label="2">增加</el-radio>
      </el-form-item>
      <el-form-item label="调整金额" prop="fee">
        <el-input
          v-model.trim="changeAddressForm.fee"
          v-limit-input-number="changeAddressForm.fee"
          data-dotrange="{0,2}"
          placeholder="请输入"
        >
          <span slot="suffix" class="input-suffix-text">元</span>
        </el-input>
      </el-form-item>
      <el-form-item label="调整原因" prop="remark">
        <el-input
          v-model="changeAddressForm.remark"
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
      changeAddressForm: {
        way: 0,                      // 调整方式(1:减免, 2:增加)
        fee: '',                     // 调整金额(元)
        remark: '',                   // 调整原因
        person: '李六',                            // 收货人名
        phone: '13922223333',                      // 手机号码
        address: '广东省深圳市宝安区西乡街道101号',   // 收货地址
        province: '广东省',                         // 省
        city: '深圳市',                             // 市
        area: '宝安区',                            // 区县
        street: '西乡街道101号',                   // 街道
        delivery_company_name: '顺丰'                            // 物流公司名称
      },
      changeAddressFormRules: {
        way: [{ required: true, message: '请选择减免方式', trigger: 'change' }],
        fee: [{ required: true, message: '请输入调整金额', trigger: 'blur' }]
      }
    }
  },

  methods: {
    show() {
      this.$refs.changeAddress.show()
    },
    handerDialogClose() {
      this.$refs.changeAddressForm.resetFields()
      this.$emit('clsoe')
    },
    // handlerDialogOpen() {
    //   this.changeAddressForm.actual_fee = this.refundInfo.actual_fee
    // },
    handlerDialogConfirm() {
      this.$refs.changeAddressForm.validate(valid => {
        if (valid) {
          this.adjustFeeOpr()
        }
      })
    },
    async adjustFeeOpr() {
      const data = {
        opr: 'adjust_order_fee',
        order_id: this.orderId,
        way: this.changeAddressForm.way,
        fee: this.changeAddressForm.fee,
        remark: this.changeAddressForm.remark
      }

      console.log('调整订单金额 req=>', data)
      const resp = await orderSave(data)
      console.log('调整订单金额 res=>', resp)

      if (resp.ret !== 0) return

      this.$refs.changeAddress.hide()
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
