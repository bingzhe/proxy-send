<template>
  <sl-dialog
    ref="changeDeliveryDialog"
    title="修改物流单号"
    confirm-text="保存"
    :validate="true"
    @confirm="handlerChangeDeliveryConfirm"
    @close="handlerChangeDeliveryClose"
    @open="handlerChangeDeliveryOpen"
  >
    <el-form
      ref="deliveryForm"
      :model="deliveryForm"
      :rules="deliveryFormRules"
      label-width="134px"
    >
      <el-form-item label="订单编号" prop="order_id">
        <span>{{ deliveryForm.order_id }}</span>
      </el-form-item>
      <el-form-item label="收货人" prop="person">
        <span>{{ deliveryForm.person }}</span>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <span>{{ deliveryForm.phone }}</span>
      </el-form-item>
      <el-form-item label="物流单号" prop="delivery_number">
        <el-input v-model.trim="deliveryForm.delivery_number" placeholder="请输入" />
      </el-form-item>
    </el-form>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'

export default {
  components: {
    SlDialog
  },

  props: {
    delivery: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      deliveryForm: {
        order_id: '',            // 订单id(编号)
        person: '',              // 收货人
        phone: '',               // 手机号码
        delivery_number: ''      // 物流单号（发货的单号）
      },
      deliveryFormRules: {
        delivery_number: [{ required: true, message: '请输入快递单号', trigger: 'blur' }]
      }
    }
  },

  methods: {
    show() {
      this.$refs.changeDeliveryDialog.show()
    },
    handlerChangeDeliveryConfirm() {
      this.$refs.deliveryForm.validate(valid => {
        if (valid) {
          this.changeDeliveryNumber()
        }
      })
    },
    changeDeliveryNumber() {
      const data = {
        delivery_number: this.deliveryForm.delivery_number
      }

      console.log('修改物流单号 req=>', data)
      this.$emit('on-success')
      this.handlerChangeDeliveryClose()
      this.$refs.changeDeliveryDialog.hide()
      this.$notify({
        title: '成功',
        message: '保存成功',
        type: 'success'
      })
    },
    handlerChangeDeliveryClose() {
      this.$refs.deliveryForm.resetFields()
      this.$emit('close')
    },

    handlerChangeDeliveryOpen() {
      this.deliveryForm.order_id = this.delivery.order_id
      this.deliveryForm.person = this.delivery.person
      this.deliveryForm.phone = this.delivery.phone
      this.deliveryForm.delivery_number = this.delivery.delivery_number
    }
  }

}
</script>

<style lang="scss" scoped>
.el-input {
  width: 500px;
}
.el-form {
  margin-bottom: 50px;
}
.el-form-item {
  margin-bottom: 18px;
}
</style>

