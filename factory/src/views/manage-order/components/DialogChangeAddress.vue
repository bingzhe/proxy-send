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
    @open="handlerDialogOpen"
  >
    <div class="change-tip">* 修改收货人信息将会作废已打印物流单，请谨慎修改。</div>

    <el-form
      ref="changeAddressForm"
      :model="changeAddressForm"
      :rules="changeAddressFormRules"
      :inline="true"
    >
      <el-form-item label="收件人" prop="person" label-width="130px">
        <el-input v-model.trim="changeAddressForm.person" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone" label-width="92px">
        <el-input v-model.trim="changeAddressForm.phone" placeholder="请输入" />
      </el-form-item>
      <br>
      <el-form-item label="第三方平台订单号" prop="order_id_3rd" label-width="130px">
        <el-input v-model.trim="changeAddressForm.order_id_3rd" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="固定电话" prop="telephone" label-width="92px">
        <el-input v-model.trim="changeAddressForm.telephone" placeholder="请输入" />
      </el-form-item>
      <br>
      <el-form-item label="物流公司" prop="delivery_company_name" label-width="130px">
        <el-select v-model="changeAddressForm.delivery_company_name" placeholder="请选择">
          <el-option
            v-for="(item,index) in delivery_list"
            :key="index"
            :label="item.delivery_str"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <br>
      <el-form-item class="address" label="收货人详细地址" prop="address" label-width="130px">
        <el-input v-model="changeAddressForm.address" :rows="3" type="textarea" placeholder="请输入" />
        <div class="gray-tip">* 自动拆解不正确时请手工填写以下信息</div>
        <el-button class="split-btn" type="primary" @click="autoSplit">自动拆解</el-button>
      </el-form-item>
      <br>
      <el-form-item label="省份" prop="province" label-width="130px">
        <el-input v-model.trim="changeAddressForm.province" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="市区" prop="city" label-width="92px">
        <el-input v-model.trim="changeAddressForm.city" placeholder="请输入" />
      </el-form-item>
      <br>
      <el-form-item label="区县" prop="area" label-width="130px">
        <el-input v-model.trim="changeAddressForm.area" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="街道 / 镇" prop="street" label-width="92px">
        <el-input v-model.trim="changeAddressForm.street" placeholder="请输入" />
      </el-form-item>
    </el-form>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import { orderSave, orderGet } from '@/api/api'
import { mapState } from 'vuex'

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
        person: '', // 收货人名
        phone: '', // 手机号码
        address: '', // 收货地址
        province: '', // 省
        city: '', // 市
        area: '', // 区县
        street: '', // 街道
        delivery_company_name: '', // 物流公司名称
        telephone: '',   // 固定电话
        order_id_3rd: '' // 第三平台订单号
      },
      changeAddressFormRules: {
        person: [{ required: true, message: '请选择收件人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        delivery_company_name: [
          { required: true, message: '请选择物流公司', trigger: 'change' }
        ],
        province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
        city: [{ required: true, message: '请输入市区', trigger: 'blur' }],
        area: [{ required: true, message: '请输入区县', trigger: 'blur' }],
        street: [
          { required: true, message: '请输入街道 / 镇', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      delivery_list: state => state.user.delivery_list
    })
  },
  methods: {
    async getOrderinfo() {
      const data = {
        opr: 'get_order_info',
        order_id: this.orderId
      }

      console.log('订单详情 req=>', data)
      const resp = await orderGet(data)
      console.log('订单详情 res=>', resp)

      if (resp.ret !== 0) return
      const info = resp.data.info
      const consignee_info = info.consignee_info || {}

      this.changeAddressForm.person = consignee_info.person
      this.changeAddressForm.phone = consignee_info.phone
      this.changeAddressForm.order_id_3rd = consignee_info.order_id_3rd
      this.changeAddressForm.telephone = consignee_info.telephone
      this.changeAddressForm.address = consignee_info.address
      this.changeAddressForm.province = consignee_info.province
      this.changeAddressForm.city = consignee_info.city
      this.changeAddressForm.area = consignee_info.area
      this.changeAddressForm.street = consignee_info.street
      this.changeAddressForm.delivery_company_name = (
        info.delivery_info || {}
      ).company_name
    },
    show() {
      this.$refs.changeAddress.show()
    },
    handerDialogClose() {
      this.$refs.changeAddressForm.resetFields()
      this.$emit('clsoe')
    },
    handlerDialogOpen() {
      this.getOrderinfo()
    },
    handlerDialogConfirm() {
      this.$refs.changeAddressForm.validate(valid => {
        if (valid) {
          this.adjustFeeOpr()
        }
      })
    },
    async adjustFeeOpr() {
      const data = {
        opr: 'modify_consignee_info',
        order_id: this.orderId,
        person: this.changeAddressForm.person, // 收货人名
        phone: this.changeAddressForm.phone, // 手机号码
        province: this.changeAddressForm.province, // 省
        city: this.changeAddressForm.city, // 市
        area: this.changeAddressForm.area, // 区县
        street: this.changeAddressForm.street, // 街道
        delivery_company_name: this.changeAddressForm.delivery_company_name,
        address: this.changeAddressForm.address,
        telephone: this.changeAddressForm.telephone,
        order_id_3rd: this.changeAddressForm.order_id_3rd

        // address: `${this.changeAddressForm.province}${
        //   this.changeAddressForm.city
        // }${this.changeAddressForm.area}${this.changeAddressForm.street}` // 收货地址
      }

      console.log('修改收货人信息 req=>', data)
      const resp = await orderSave(data)
      console.log('修改收货人信息 res=>', resp)

      if (resp.ret !== 0) return

      this.$refs.changeAddress.hide()
      this.$emit('on-success')
      this.handerDialogClose()
    },
    autoSplit() {
      const reg = /.+?(省|市|自治区|自治州|县|区|街道)/g
      const res = this.changeAddressForm.address.match(reg)

      this.changeAddressForm.province = res[0] || ''
      this.changeAddressForm.city = res[1] || ''
      this.changeAddressForm.area = res[2] || ''
      this.changeAddressForm.street = res[3] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 220px;
}
.el-select {
  width: 300px;
}
.el-textarea {
  width: 500px;
}
.change-tip {
  position: relative;
  top: -25px;
  font-size: 12px;
  color: #db0303;
}
.gray-tip {
  position: absolute;
  font-size: 12px;
  top: 70px;
  color: #999999;
}
.input-suffix-text {
  color: #333;
  margin-right: 10px;
}
.el-form-item.address {
  position: relative;
  margin-bottom: 40px;
}
.split-btn {
  font-weight: bold;
  background: #70aefa;
  padding: 11px 20px;
  border-color: #70aefa;
}
</style>
