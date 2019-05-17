<template>
  <sl-dialog
    ref="staffEditDialog"
    :title="staffId? '编辑员工信息' : '新增员工信息'"
    :confirm-text="staffId ? '保存': '提交'"
    :validate="true"
    width="900px"
    top="15vh"
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
      <br>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.trim="staffEditForm.phone" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="staffEditForm.role_id" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.role_id"
            :label="item.role_name"
            :value="item.role_id"
          />
        </el-select>
      </el-form-item>
      <br>
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
      <br>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model.trim="staffEditForm.remark"
          class="remark"
          type="textarea"
          placeholder="请输入"
          :rows="3"
        />
      </el-form-item>
      <br>
    </el-form>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import { employeeSave, employeeGet } from '@/api/api'
import { STAFF_STATUS } from '@/config/cfg'

export default {
  components: {
    SlDialog
  },

  props: {
    staffId: {
      type: String,
      required: true
    },
    roleList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      staffEditForm: {
        username: '',              // 用户名(即用户表中的)
        password: '',              // 密码
        phone: '',                 // 手机号
        role_id: '',               // 角色ID
        real_name: '',             // 员工姓名
        // employee_no: '',           // 员工工号
        status: '',                // 状态(1:正常, 2:停用)
        remark: ''                 // 备注
      },
      staffEditFormRules: {
        username: [{ required: true, message: '请输入账户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入账户密码', trigger: 'blur' }],
        real_name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        role_id: [{ required: true, message: '请选择角色', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
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
    },
    handlerStaffEditConfirm() {
      this.$refs.staffEditForm.validate(valid => {
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
        remark: this.staffEditForm.remark
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
.business-url.el-input {
  width: 603px;
}
</style>

