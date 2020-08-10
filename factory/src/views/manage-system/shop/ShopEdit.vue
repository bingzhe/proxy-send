<template>
  <sl-dialog
    ref="shopEditDialog"
    :title="businessId? '编辑商户信息' : '新增商户信息'"
    :confirm-text="businessId ? '保存': '提交'"
    :validate="true"
    width="900px"
    top="12vh"
    @confirm="handlerShopEditConfirm"
    @close="handlerShopEditClose"
    @open="handlerShopEditOpen"
  >
    <el-form
      ref="shopEditForm"
      :model="shopEditForm"
      :rules="shopEditFormRules"
      :inline="true"
      label-width="150px"
    >
      <el-form-item label="账户名" prop="username">
        <el-input v-model="shopEditForm.username" :disabled="!!businessId" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="账户密码" prop="password">
        <el-input v-model="shopEditForm.password" placeholder="请输入" />
      </el-form-item>
      <br />
      <el-form-item label="手机号" prop="telephone">
        <el-input
          v-model="shopEditForm.telephone"
          v-limit-input-number="shopEditForm.telephone"
          data-dotrange="{0,0}"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="VIP等级" prop="vip_level">
        <el-select v-model="shopEditForm.vip_level" placeholder="请选择">
          <el-option
            v-for="item in vip_level_list"
            :key="item.vip_level"
            :label="item.vip_title"
            :value="item.vip_level"
          />
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="商户姓名" prop="business_name">
        <el-input v-model="shopEditForm.business_name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="业务员" prop="salesman">
        <el-select v-model="shopEditForm.salesman" filterable placeholder="请选择">
          <el-option
            v-for="item in employee_list"
            :key="item.employee_id"
            :label="item.real_name"
            :value="item.employee_id"
          />
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="状态" prop="status">
        <el-select v-model="shopEditForm.status" placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="可使用DIY设计器" prop="designer_valid">
        <!-- <el-input v-model="shopEditForm.designer_valid" placeholder="请输入"/> -->
        <el-select v-model="shopEditForm.designer_valid" placeholder="请选择">
          <el-option
            v-for="item in useDesignerOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="联系地址" prop="address">
        <el-input
          v-model="shopEditForm.address"
          class="address"
          type="textarea"
          placeholder="请输入"
          :rows="3"
        />
      </el-form-item>
      <br />
      <el-form-item label="商铺URL" prop="url">
        <el-input v-model="shopEditForm.url" class="business-url" placeholder="请输入" />
      </el-form-item>
    </el-form>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import { businessSave, businessGet } from '@/api/api'
import { BUSINESS_STATUS, CANUSE_DESIGNERDIV } from '@/config/cfg'
import { mapState } from 'vuex'

export default {
  components: {
    SlDialog
  },

  props: {
    businessId: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      const reg = /[\u4e00-\u9fa5]/gm

      if (reg.test(value)) {
        return callback(new Error('密码不能为中文'))
      } else {
        callback()
      }
    }
    return {
      shopEditForm: {
        username: '', // 登录用户名(同用户表中的)
        password: '',
        telephone: '', // 联系电话
        vip_level: '', // VIP等级
        business_name: '', // 商户姓名（注：不是登录名）
        salesman: '', // 业务员ID(跟单人)
        status: '', // 状态(1:正常,2:停用)
        designer_valid: '', // 可使用DIY设计器(1:可使用,0:不能使用)
        address: '', // 联系地址
        url: '' // 商铺URL
      },
      shopEditFormRules: {
        username: [{ required: true, message: '请输入账户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入账户密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
        ],
        vip_level: [{ required: true, message: '请选择VIP等级', trigger: 'change' }],
        business_name: [{ required: true, message: '请输入商户姓名', trigger: 'blur' }],
        salesman: [{ required: true, message: '请选择业务员', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        designer_valid: [
          { required: true, message: '请选择是否可使用DIY设计器', trigger: 'change' }
        ],
        address: [{ required: true, message: '请输入联系地址', trigger: 'blur' }]
      },

      statusOptions: [
        {
          label: BUSINESS_STATUS.toString(BUSINESS_STATUS.NORMAL),
          value: BUSINESS_STATUS.NORMAL
        },
        {
          label: BUSINESS_STATUS.toString(BUSINESS_STATUS.DISABLE),
          value: BUSINESS_STATUS.DISABLE
        }
      ],

      useDesignerOptions: [
        {
          label: CANUSE_DESIGNERDIV.toString(CANUSE_DESIGNERDIV.YES),
          value: CANUSE_DESIGNERDIV.YES
        },
        {
          label: CANUSE_DESIGNERDIV.toString(CANUSE_DESIGNERDIV.NO),
          value: CANUSE_DESIGNERDIV.NO
        }
      ]
    }
  },
  computed: {
    ...mapState({
      vip_level_list: (state) => state.user.vip_level_list,
      employee_list: (state) => state.user.employee_list
    })
  },
  methods: {
    show() {
      this.$refs.shopEditDialog.show()
    },
    async getBusinessInfo() {
      const data = {
        opr: 'get_business_info',
        business_id: this.businessId
      }

      // console.log('商户详情 req=>', data)
      const resp = await businessGet(data)
      // console.log('商户详情 res=>', resp)
      if (resp.ret !== 0) return

      const info = resp.data.info

      this.shopEditForm.username = info.username
      this.shopEditForm.password = info.password
      this.shopEditForm.telephone = info.telephone
      this.shopEditForm.vip_level = info.vip_level
      this.shopEditForm.business_name = info.business_name
      this.shopEditForm.salesman = info.salesman
      this.shopEditForm.status = info.status
      this.shopEditForm.designer_valid = info.designer_valid
      this.shopEditForm.address = info.address
      this.shopEditForm.url = info.url
    },
    handlerShopEditConfirm() {
      this.$refs.shopEditForm.validate((valid) => {
        if (valid) {
          this.saveBusiness()
        }
      })
    },
    async saveBusiness() {
      const data = {
        opr: 'save_business',
        username: this.shopEditForm.username,
        password: this.shopEditForm.password,
        telephone: this.shopEditForm.telephone,
        vip_level: this.shopEditForm.vip_level,
        business_name: this.shopEditForm.business_name,
        salesman: this.shopEditForm.salesman,
        status: this.shopEditForm.status,
        designer_valid: this.shopEditForm.designer_valid,
        address: this.shopEditForm.address,
        url: this.shopEditForm.url
      }

      if (this.businessId) {
        data.business_id = this.businessId
      }

      // console.log('商户保存 req=>', data)
      const resp = await businessSave(data)
      // console.log('商户保存 res=>', resp)
      if (resp.ret !== 0) return

      this.handlerShopEditClose()
      this.$emit('on-success')
      this.$refs.shopEditDialog.hide()
      this.$notify({
        title: '成功',
        message: this.businessId ? '保存成功' : '提交成功',
        type: 'success'
      })
    },
    handlerShopEditClose() {
      this.$refs.shopEditForm.resetFields()
      this.$emit('on-close')
    },
    handlerShopEditOpen() {
      if (this.businessId) {
        this.getBusinessInfo()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 220px;
}
.el-select {
  width: 220px;
}
.el-textarea.address {
  width: 603px;
}
.business-url.el-input {
  width: 603px;
}
</style>

