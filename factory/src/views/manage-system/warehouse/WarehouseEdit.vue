<template>
  <SlDialog
    ref="warehouseEditDialog"
    :title="warehouse_id ? '编辑仓库信息': '新增仓库信息'"
    :confirm-text="warehouse_id ? '保存':'提交'"
    :validate="true"
    width="700px"
    top="20vh"
    @confirm="handleWarehouseEditConfirm"
    @close="handleWarehouseClose"
    @open="handleWarehouseOpen"
  >
    <el-form
      ref="warehouseEditForm"
      :model="warehouseForm"
      :rules="warehouseFormRules"
      label-width="150px"
    >
      <el-form-item label="仓库名称" prop="name">
        <el-input v-model.trim="warehouseForm.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="仓库所在城市" prop="city">
        <el-input v-model.trim="warehouseForm.city" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="仓库详细地址" prop="address">
        <el-input v-model.trim="warehouseForm.address" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <el-form-item label="仓库详细地址" prop="send_area_list">
      <el-input v-model.trim="warehouseForm.send_area_list" placeholder="请输入" />
    </el-form-item>
  </SlDialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'

export default {
  components: {
    SlDialog
  },
  props: {
    warehouse_id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      warehouseForm: {
        name: '', // 仓库名称
        city: '', // 仓库所在位置(城市)
        address: '', // 仓库详细地址
        send_area_list: [] // 可向哪些城市发货
      },
      warehouseFormRules: {
        name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
        city: [{ required: true, message: '请选择仓库所在城市', trigger: 'change' }],
        address: [{ required: true, message: '请输入仓库详细地址', trigger: 'blur' }]
      }
    }
  },
  methods: {
    show() {
      this.$refs.warehouseEditDialog.show()
    },

    handleWarehouseEditConfirm() {},
    handleWarehouseClose() {},
    handleWarehouseOpen() {}
  }
}
</script>

<style lang="scss" scoped>
</style>
