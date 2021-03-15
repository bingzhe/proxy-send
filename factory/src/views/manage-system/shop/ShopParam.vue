<template>
  <div class="shop-param-wrapper">
    <div class="shop-param-title-wrapper">
      <baseinfo-title color="#F348A1" text="店铺参数配置" />
    </div>
    <div v-loading="paramTableLoading" element-loading-text="加载中" class="shop-param-table-wrapper default-table-change">
      <el-table :data="paramList" class="param-list-table" height="255" stripe border>
        <el-table-column prop="tshop_name" label="店铺名称" min-width="60" align="center" />

        <el-table-column prop="cfg_name" label="参数名称" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cfg_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cfg_value" label="参数值" min-width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cfg_value }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="opr" label="操作" min-width="60" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="openCfgEditDialog(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <sl-dialog ref="cfgEditDialog" title="参数编辑" confirm-text="保存" :validate="true" @confirm="handlerCfgEditConfirm" @close="handlerCfgEditClose">
      <div class="cfg-edit-wrapper">
        <el-form ref="cfgEditForm" :model="cfgEditForm" :rules="cfgEditFormRules" label-width="140px">
          <el-form-item label="店铺名称" prop="tshop_name">
            <div>{{ cfgEditForm.tshop_name }}</div>
          </el-form-item>
          <el-form-item label="参数名称" prop="cfg_name">
            <div>{{ cfgEditForm.cfg_name }}</div>
          </el-form-item>
          <el-form-item label="参数值" prop="cfg_value">
            <el-input v-model="cfgEditForm.cfg_value" :rows="7" type="textarea" placeholder="请输入" />
          </el-form-item>
        </el-form>
      </div>
    </sl-dialog>
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import SlDialog from '@/components/Dialog/Dialog'
import { tshopSave } from '@/api/api'

export default {
  components: {
    BaseinfoTitle,
    SlDialog
  },
  props: {
    paramList: {
      type: Array,
      required: true
    },
    paramTableLoading: {
      type: Boolean,
      required: true
    },
    oprtshopId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      cfgEditForm: {
        cfg_id: '',
        cfg_name: '',
        cfg_value: '',
        tshop_name: ''
      },

      cfgEditFormRules: {
        cfg_value: [{ required: true, message: '请输入参数值', trigger: 'blur' }]
      }
    }
  },
  methods: {
    openCfgEditDialog(row) {
      this.$refs.cfgEditDialog.show()
      this.cfgEditForm.cfg_name = row.cfg_name
      this.cfgEditForm.cfg_value = row.cfg_value
      this.cfgEditForm.cfg_id = row.cfg_id
      this.cfgEditForm.tshop_name = row.tshop_name
    },
    handlerCfgEditConfirm() {
      this.$refs.cfgEditForm.validate((valid) => {
        if (valid) {
          this.saveSystemCfg()
        }
      })
    },
    async saveSystemCfg() {
      const data = {
        opr: 'save_tshop_cfg',
        tshop_id: this.oprtshopId,
        cfg_id: this.cfgEditForm.cfg_id,
        cfg_name: this.cfgEditForm.cfg_name, // 参数名称
        cfg_value: this.cfgEditForm.cfg_value // 参数值(json格式串)
      }
      // console.log('工厂参数保存 req=>', data)
      const resp = await tshopSave(data)
      // console.log('工厂参数保存 res=>', resp)
      if (resp.ret !== 0) return
      this.$notify({
        title: '成功',
        message: '保存成功',
        type: 'success'
      })
      this.handlerCfgEditClose()
      this.$refs.cfgEditDialog.hide()
      this.$emit('suc-save')
    },
    handlerCfgEditClose() {
      this.$refs.cfgEditForm.resetFields()
      this.cfgEditForm.cfg_name = ''
      this.cfgEditForm.cfg_value = ''
      this.cfgEditForm.cfg_id = ''
      this.cfgEditForm.tshop_name = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-param-wrapper {
  max-width: 1100px;
  .shop-param-title-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 24px 20px 24px 30px;
  }
  .shop-param-table-wrapper {
    margin: 0 20px 40px 70px;
    .el-table {
      /deep/ .el-table__body-wrapper {
        td {
          padding: 0;
        }
      }
      /deep/ .el-form-item__content {
        line-height: 23px;
      }
    }
    .text-btn {
      color: #e33119;
    }
    .edit-btn {
      color: #2584f9;
    }
    .save-btn {
      color: #2584f9;
    }
  }
}
/deep/ .param-list-table {
  max-height: 255px !important;
  height: auto !important;
  .el-table__body-wrapper {
    max-height: 205px !important;
    height: auto !important;
  }
}
</style>
