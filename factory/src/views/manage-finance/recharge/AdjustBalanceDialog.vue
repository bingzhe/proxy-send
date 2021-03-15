<template>
  <sl-dialog
    ref="adjustBalanceDialog"
    title="调整账户余额"
    confirm-text="提交"
    :validate="true"
    @confirm="handlerAdjustConfirm"
    @close="handlerAdjustClose"
  >
    <!-- @open="handlerAdjustOpen" -->
    <el-form
      ref="adjustBalanceForm"
      :model="adjustBalanceForm"
      :rules="adjustBalanceFormRules"
      label-width="134px"
    >
      <el-form-item label="商户名称" prop="business_id">
        <!-- <el-input v-model.trim="adjustBalanceForm.business_id" placeholder="请输入" /> -->
        <el-select v-model="adjustBalanceForm.business_id" filterable placeholder="请选择" @change="handlerBusinessChange">
          <el-option
            v-for="item in businessList"
            :key="item.business_id"
            :label="item.business_name"
            :value="item.business_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="当前余额" prop="account_balance">
        <!-- <el-input v-model.trim="adjustBalanceForm.business_id" placeholder="请输入" /> -->
        <span>{{ adjustBalanceForm.account_balance }} 元</span>
      </el-form-item>
      <el-form-item label="调整方式" prop="way">
        <el-radio v-model="adjustBalanceForm.way" :label="1">
          扣除
        </el-radio>
        <el-radio v-model="adjustBalanceForm.way" :label="2">
          增加
        </el-radio>
      </el-form-item>
      <el-form-item label="调整金额" prop="amount">
        <el-input
          v-model.trim="adjustBalanceForm.amount"
          v-limit-input-number="adjustBalanceForm.amount"
          data-dotrange="{0,2}"
          placeholder="请输入"
        >
          <span slot="suffix" class="input-suffix-text">元</span>
        </el-input>
      </el-form-item>
      <el-form-item label="调整原因" prop="remark">
        <el-input
          v-model="adjustBalanceForm.remark"
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
import { rechargeSave } from '@/api/api'

export default {
  components: {
    SlDialog
  },

  props: {
    businessList: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      adjustBalanceForm: {
        account_balance: 0,
        business_id: '',                 // 商户ID
        way: '',                          // 调整方式(1:扣除商户账户, 2:增加商户账户)
        amount: '',                     // 调整金额(元)
        remark: ''                       // 调整原因
      },
      adjustBalanceFormRules: {
        business_id: [{ required: true, message: '请选择商户', trigger: 'change' }],
        way: [{ required: true, message: '请选择调整方式', trigger: 'change' }],
        amount: [{ required: true, message: '请输入要调整的金额', trigger: 'blur' }]
      }
    }
  },

  methods: {
    show() {
      this.$refs.adjustBalanceDialog.show()
    },
    handlerAdjustConfirm() {
      this.$refs.adjustBalanceForm.validate(valid => {
        if (valid) {
          this.adjustBalance()
        }
      })
    },
    async adjustBalance() {
      const data = {
        opr: 'adjust_business_amount',
        business_id: this.adjustBalanceForm.business_id,    // 商户ID
        way: this.adjustBalanceForm.way,                    // 调整方式(1:扣除商户账户, 2:增加商户账户)
        amount: this.adjustBalanceForm.amount,               // 调整金额(元)
        remark: this.adjustBalanceForm.remark              // 调整原因
      }

      console.log('调整账户余额 req=>', data)
      const resp = await rechargeSave(data)
      console.log('调整账户余额 res=>', resp)

      if (resp.ret !== 0) return

      this.$emit('on-success')
      this.handlerAdjustClose()
      this.$refs.adjustBalanceDialog.hide()
      this.$notify({
        title: '成功',
        message: '保存成功',
        type: 'success'
      })
    },
    handlerAdjustClose() {
      this.$refs.adjustBalanceForm.resetFields()
      this.$emit('close')
    },
    handlerBusinessChange(item) {
      this.businessList.forEach(business => {
        if (business.business_id === item) {
          this.adjustBalanceForm.account_balance = business.account_balance
        }
      })
    }
    // handlerAdjustOpen() {
    // }
  }

}
</script>

<style lang="scss" scoped>
.el-input {
  width: 300px;
}
.el-select{
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
</style>

