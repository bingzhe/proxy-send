<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="参数名称" prop="cfg_name" label-width="70px">
          <el-input v-model.trim="searchForm.cfg_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button class="btn-h-38" type="primary" @click="handlerSearchClick">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- search end -->

    <div
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      class="table-wrapper table-wrapper-default"
    >
      <div class="table-title clearfix">
        <div class="table-title__lable">
          <span>
            <i class="el-icon-goods" />
          </span>
          <span>参数配置管理</span>
        </div>
      </div>

      <div class="table-content default-table-change">
        <el-table :data="list" stripe>
          <el-table-column prop="cfg_name" label="参数名称" min-width="60" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cfg_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cfg_value" label="参数值" min-width="180" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cfg_value }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="opr" label="操作" min-width="60" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="openCfgEditDialog(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 参数编辑弹窗 -->
    <sl-dialog
      ref="cfgEditDialog"
      title="参数编辑"
      confirm-text="保存"
      :validate="true"
      @confirm="handlerCfgEditConfirm"
      @close="handlerCfgEditClose"
    >
      <div class="cfg-edit-wrapper">
        <el-form
          ref="cfgEditForm"
          :model="cfgEditForm"
          :rules="cfgEditFormRules"
          label-width="140px"
        >
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
import { factorycfgSave, factorycfgGet } from '@/api/api'
import SlDialog from '@/components/Dialog/Dialog'

export default {
  components: {
    SlDialog
  },
  data() {
    return {
      searchForm: {
        cfg_name: '' // 参数名称
      },

      cfgEditForm: {
        cfg_name: '',
        cfg_value: ''
      },

      cfgEditFormRules: {
        cfg_value: [
          { required: true, message: '请输入参数值', trigger: 'blur' }
        ]
      },

      list: [],
      multipleSelection: [],
      tableLoading: false,
      // 分页
      total: 100, // 分页总条数
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  mounted() {
    this.getCfgList()
  },
  methods: {
    async getCfgList() {
      const data = {
        opr: 'get_factory_cfg_list'
      }

      if (this.searchForm.cfg_name) {
        data.cfg_name = this.searchForm.cfg_name
      }

      // console.log('工厂参数list req=>', data)
      const resp = await factorycfgGet(data)
      console.log('工厂参数list res=>', resp)
      if (resp.ret !== 0) return

      this.list = resp.data.list
    },
    handlerSearchClick() {
      this.listQuery.page = 1
      this.getCfgList()
    },
    openCfgEditDialog(row) {
      this.$refs.cfgEditDialog.show()
      this.cfgEditForm.cfg_name = row.cfg_name
      this.cfgEditForm.cfg_value = row.cfg_value
    },
    handlerCfgEditConfirm() {
      this.$refs.cfgEditForm.validate(valid => {
        if (valid) {
          this.saveSystemCfg()
        }
      })
    },
    async saveSystemCfg() {
      const data = {
        opr: 'save_factory_cfg',
        cfg_name: this.cfgEditForm.cfg_name,    // 参数名称
        cfg_value: this.cfgEditForm.cfg_value    // 参数值(json格式串)
      }

      console.log('工厂参数保存 req=>', data)
      const resp = await factorycfgSave(data)
      console.log('工厂参数保存 res=>', resp)
      if (resp.ret !== 0) return

      this.handlerCfgEditClose()
      this.getCfgList()
    },
    handlerCfgEditClose() {
      this.$refs.cfgEditForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  padding: 0 16px 20px;
}
.search-wrapper {
  padding-top: 30px;
  .el-input {
    width: 300px;
  }
}
.el-table {
  min-height: 400px;
}
.cfg-edit-wrapper {
  padding-right: 140px;
}
</style>

