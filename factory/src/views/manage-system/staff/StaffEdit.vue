<template>
  <sl-dialog
    ref="staffEditDialog"
    :title="staffId? '编辑员工信息' : '新增员工信息'"
    :confirm-text="staffId ? '保存': '提交'"
    :validate="true"
    width="900px"
    top="8vh"
    @confirm="handlerStaffEditConfirm"
    @close="handlerStaffEditClose"
    @open="handlerStaffEditOpen"
  >
    <el-form
      ref="staffEditForm"
      :model="staffEditForm"
      :rules="staffEditFormRules"
      :inline="true"
      label-width="150px"
    >
      <el-form-item label="账户名" prop="username">
        <el-input v-model.trim="staffEditForm.username" :disabled="!!staffId" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="账户密码" prop="password">
        <el-input v-model.trim="staffEditForm.password" placeholder="请输入" />
      </el-form-item>
      <br />
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model.trim="staffEditForm.phone"
          v-limit-input-number="staffEditForm.phone"
          data-dotrange="{0,0}"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="staffEditForm.role_id" placeholder="请选择">
          <el-option
            v-for="item in role_list"
            :key="item.role_id"
            :label="item.role_name"
            :value="item.role_id"
          />
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="姓名" prop="real_name">
        <el-input v-model.trim="staffEditForm.real_name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="staffEditForm.status" placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="仓库订单审核" prop="warehouse_list">
        <el-select
          v-model="staffEditForm.warehouse_list"
          class="warehouse-list"
          filterable
          multiple
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="warehouse in warehouseList"
            :key="warehouse.warehouse_id"
            :label="warehouse.warehouse_name"
            :value="warehouse.warehouse_id"
          />
        </el-select>

        <el-tooltip
          class="item"
          effect="dark"
          content="当前用户只能审核由所设仓库发货的订单（根据订单地址关联）"
          placement="top-end"
        >
          <i class="el-icon-question" />
        </el-tooltip>
      </el-form-item>
      <br />
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model.trim="staffEditForm.remark"
          class="remark"
          type="textarea"
          placeholder="请输入"
          :rows="3"
        />
      </el-form-item>
      <br />
    </el-form>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import { employeeSave, employeeGet } from '@/api/api'
import { STAFF_STATUS } from '@/config/cfg'
import { mapState } from 'vuex'

export default {
  components: {
    SlDialog
  },

  props: {
    staffId: {
      type: String,
      required: true
    },
    warehouseList: {
      type: Array,
      required: true
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
      staffEditForm: {
        username: '', // 用户名(即用户表中的)
        password: '', // 密码
        phone: '', // 手机号
        role_id: '', // 角色ID
        real_name: '', // 员工姓名
        // employee_no: '',           // 员工工号
        status: '', // 状态(1:正常, 2:停用)
        remark: '', // 备注,
        warehouse_list: [] // 当前用户只能审核由所设仓库发货的订单（根据订单地址来关联）
      },
      staffEditFormRules: {
        username: [{ required: true, message: '请输入账户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入账户密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        real_name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
        ],
        role_id: [{ required: true, message: '请选择角色', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        warehouse_list: [
          { type: 'array', required: true, message: '请选择仓库', trigger: 'change' }
        ]
      },
      statusOptions: [
        {
          label: STAFF_STATUS.toString(STAFF_STATUS.NORMAL),
          value: STAFF_STATUS.NORMAL
        },
        {
          label: STAFF_STATUS.toString(STAFF_STATUS.DISABLE),
          value: STAFF_STATUS.DISABLE
        }
      ]
    }
  },
  computed: {
    ...mapState({
      role_list: (state) => state.user.role_list
    })
  },
  methods: {
    show() {
      this.$refs.staffEditDialog.show()
    },
    async getStaffInfo() {
      const data = {
        opr: 'get_employee_info',
        employee_id: this.staffId
      }

      const resp = await employeeGet(data)
      // console.log('员工信息 res=>', resp)
      if (resp.ret !== 0) return

      const info = resp.data.info

      this.staffEditForm.username = info.username
      this.staffEditForm.password = info.password
      this.staffEditForm.phone = info.phone
      this.staffEditForm.role_id = info.role_id
      this.staffEditForm.real_name = info.real_name
      this.staffEditForm.status = info.status
      this.staffEditForm.remark = info.remark

      this.staffEditForm.warehouse_list = (info.warehouse_list || []).map(
        (item) => item.warehouse_id
      )
    },
    handlerStaffEditConfirm() {
      this.$refs.staffEditForm.validate((valid) => {
        if (valid) {
          this.saveStaff()
        }
      })
    },
    async saveStaff() {
      const data = {
        opr: 'save_employee',
        username: this.staffEditForm.username,
        password: this.staffEditForm.password,
        phone: this.staffEditForm.phone,
        role_id: this.staffEditForm.role_id,
        real_name: this.staffEditForm.real_name,
        status: this.staffEditForm.status,
        remark: this.staffEditForm.remark,
        warehouse_list: this.staffEditForm.warehouse_list
      }

      if (this.staffId) {
        data.employee_id = this.staffId
      }

      // console.log('员工保存 req=>', data)
      const resp = await employeeSave(data)
      // console.log('员工保存 res=>', data)
      if (resp.ret !== 0) return

      this.handlerStaffEditClose()
      this.$emit('on-success')
      this.$refs.staffEditDialog.hide()
      this.$notify({
        title: '成功',
        message: this.staffId ? '保存成功' : '提交成功',
        type: 'success'
      })
    },
    handlerStaffEditClose() {
      this.$refs.staffEditForm.resetFields()
      this.$emit('on-close')
    },
    handlerStaffEditOpen() {
      if (this.staffId) {
        this.getStaffInfo()
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
.el-textarea.remark {
  width: 603px;
}
.warehouse-list.el-select {
  width: 603px;
}
.el-icon-question {
  color: #e6a23c;
  font-size: 20px;
}
</style>

