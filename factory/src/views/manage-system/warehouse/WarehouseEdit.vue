<template>
  <SlDialog
    ref="warehouseEditDialog"
    :title="warehouse_id ? '编辑仓库信息': '新增仓库信息'"
    :confirm-text="warehouse_id ? '保存':'提交'"
    :validate="true"
    width="700px"
    top="15vh"
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
      <el-form-item label="仓库名称" prop="warehouse_name">
        <el-input v-model.trim="warehouseForm.warehouse_name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="仓库所在城市" prop="city_id">
        <el-cascader
          ref="cityCascader"
          v-model="warehouseForm.city_id"
          :options="regionList"
          clearable
          :show-all-levels="false"
          filterable
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="仓库详细地址" prop="address">
        <el-input v-model.trim="warehouseForm.address" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="可发货城市" prop="send_area_id_list">
        <el-cascader
          ref="cityListCascader"
          v-model="warehouseForm.send_area_id_list"
          :options="regionList"
          clearable
          :show-all-levels="false"
          :props="{ multiple: true }"
          filterable
          @change="handleChange"
        />
      </el-form-item>
    </el-form>
  </SlDialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import { warehouseSave, warehouseGet } from '@/api/api'

export default {
  components: {
    SlDialog
  },
  props: {
    warehouse_id: {
      type: String,
      default: ''
    },
    regionList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      warehouseForm: {
        warehouse_name: '', // 仓库名称
        city_id: [], // ['1', '12']
        city: '', // 仓库所在位置(城市)
        address: '', // 仓库详细地址
        send_area_id_list: [], // [['1','12'], ['2', '22']]
        send_area_list: [] // 可向哪些城市发货
      },
      warehouseFormRules: {
        warehouse_name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
        city_id: [
          { type: 'array', required: true, message: '请选择仓库所在城市', trigger: 'change' }
        ],
        address: [{ required: true, message: '请输入仓库详细地址', trigger: 'blur' }],
        send_area_id_list: [
          { type: 'array', required: true, message: '请选择可发货城市', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    show() {
      this.$refs.warehouseEditDialog.show()
    },

    handleWarehouseEditConfirm() {
      this.$refs.warehouseEditForm.validate((valid) => {
        if (valid) {
          this.saveWarehose()
        }
      })
    },
    handleWarehouseClose() {
      this.$refs.warehouseEditForm.resetFields()
      this.$emit('on-close')
    },
    handleWarehouseOpen() {
      if (this.warehouse_id) {
        this.getWarehouseInfo()
      }
    },
    async getWarehouseInfo() {
      const data = {
        opr: 'get_warehouse_info',
        warehouse_id: this.warehouse_id // 仓库ID
      }

      console.log('仓库详情 req=>', data)
      const resp = await warehouseGet(data)
      console.log('仓库详情 res=>', resp)
      if (resp.ret !== 0) return

      const info = resp.data || {}

      this.warehouseForm.warehouse_name = info.warehouse_name
      this.warehouseForm.address = info.address
      this.warehouseForm.send_area_id_list = info.send_area_id_list
      this.warehouseForm.city_id = info.city_id
    },
    async saveWarehose() {
      const citySelect = this.$refs.cityCascader.getCheckedNodes()
      const sendCitySelect = this.$refs.cityListCascader.getCheckedNodes(true)

      const city = citySelect.map((item) => item.label).join('')
      const sendCity = sendCitySelect.map((item) => item.label)

      const data = {
        opr: 'save_warehouse',
        warehouse_name: this.warehouseForm.warehouse_name, // 仓库名称
        address: this.warehouseForm.address, // 仓库详细地址
        city: city, // 仓库所在位置(城市)
        send_area_list: sendCity // 可向哪些城市发货
      }

      if (this.warehouse_id) {
        data.warehouse_id = this.warehouse_id
      }

      console.log('仓库保存 req=>', data)
      const resp = await warehouseSave(data)
      console.log('仓库保存 res=>', resp)

      this.handleWarehouseClose()
      this.$emit('on-success')
      this.$refs.warehouseEditDialog.hide()
      this.$notify({
        title: '成功',
        message: this.warehouse_id ? '保存成功' : '提交成功',
        type: 'success'
      })
    },
    handleChange(value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-right: 150px;
}
.el-cascader {
  width: 100%;
}
</style>
