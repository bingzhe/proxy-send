<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="角色名称" prop="role_name" label-width="70px">
          <el-input v-model.trim="searchForm.role_name" placeholder="请输入" />
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
          <span>已有角色列表</span>
        </div>
        <div class="add-button-group">
          <el-button class="add-btn btn-h-38" type="primary" @click="handlerAddRowlClick">新增</el-button>
        </div>
      </div>

      <div class="table-content default-table-change">
        <el-table :data="list" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />

          <el-table-column prop="role_name" label="角色名称" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.role_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="permlist" label="功能权限" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.perm_str }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="opr" label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="openRoleEditDialog(scope.row)">编辑</el-button>
              <el-button class="btn-red" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 start -->
        <div class="pagination-wrapper clearfix">
          <div class="pagination-total">
            <span>
              共
              <span class="num-text">{{ pageTotal }}</span>页/
              <span class="num-text">{{ total }}</span>条数据
            </span>
          </div>
          <el-pagination
            class="sl-pagination"
            :current-page.sync="listQuery.page"
            :page-sizes="[10,20,40]"
            :page-size="listQuery.limit"
            layout="prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <!-- 分页 end -->
      </div>
    </div>

    <!-- 参数编辑弹窗 -->
    <sl-dialog
      ref="roleEditDialog"
      :title="editRoleId ? '编辑角色':'新增角色'"
      :confirm-text="editRoleId ? '保存':'提交'"
      :validate="true"
      @confirm="handlerRoleEditConfirm"
      @close="handlerRoleEditClose"
    >
      <div class="role-edit-wrapper">
        <el-form
          ref="roleEditForm"
          :model="roleEditForm"
          :rules="roleEditFormRules"
          label-width="140px"
        >
          <el-form-item label="角色名称" prop="role_name">
            <el-input
              v-model.trim="roleEditForm.role_name"
              :disabled="!!editRoleId"
              placeholder="输入角色名称"
            />
          </el-form-item>
          <el-form-item label="功能权限" prop="permlistSelect">
            <el-checkbox-group v-model="roleEditForm.permlistSelect">
              <el-checkbox
                v-for="item in permlist"
                :key="item.type"
                :label="item.type"
              >{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
    </sl-dialog>
  </div>
</template>

<script>
import { roleSave, roleGet } from '@/api/api'
import SlDialog from '@/components/Dialog/Dialog'

export default {
  components: {
    SlDialog
  },
  data() {
    return {
      searchForm: {
        role_name: '' // 参数名称
      },

      editRoleId: '', // 编辑的角色id
      roleEditForm: {
        role_name: '',
        permlistSelect: []
      },
      roleEditFormRules: {
        role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        permlistSelect: [{ type: 'array', required: true, message: '请至少选择一个功能权限', trigger: 'change' }]
      },

      // 权限(1:商户管理, 2:参数配置, 3:员工管理, 4:角色管理, 5:充值受理, 6:订单审核, 7:订单查询, 8:发货管理)
      permlist: [
        { name: '商户管理', type: 1 },
        { name: '参数配置', type: 2 },
        { name: '员工管理', type: 3 },
        { name: '角色管理', type: 4 },
        { name: '充值受理', type: 5 },
        { name: '订单审核', type: 6 },
        { name: '订单查询', type: 7 },
        { name: '发货管理', type: 8 }
      ],

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
  computed: {
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const data = {
        opr: 'get_role_list',
        page_no: this.listQuery.page
      }

      if (this.searchForm.role_name) {
        data.role_name = this.searchForm.role_name
      }

      // console.log('角色list req=>', data)
      const resp = await roleGet(data)
      console.log('角色list res=>', resp)
      if (resp.ret !== 0) return

      this.list = resp.data.list

      this.list.map(item => {
        const permStrArr = []

        item.permlist.forEach(perm => {
          if (perm.checked) {
            permStrArr.push(this.permlist[perm.type - 1].name)
          }
        })
        item.perm_str = permStrArr.join('、')

        return item
      })
    },
    handlerSearchClick() {
      this.listQuery.page = 1
      this.getRoleList()
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.getRoleList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getRoleList()
    },
    handlerAddRowlClick() {
      this.$refs.roleEditDialog.show()
    },
    openRoleEditDialog(row) {
      this.editRoleId = row.role_id

      this.roleEditForm.role_name = row.role_name
      row.permlist.map(item => {
        if (item.checked) {
          this.roleEditForm.permlistSelect.push(item.type)
        }
      })

      this.$refs.roleEditDialog.show()
    },
    handlerRoleEditConfirm() {
      this.$refs.roleEditForm.validate(valid => {
        if (valid) {
          this.saveRole()
        }
      })
    },
    async saveRole() {
      const data = {
        opr: 'save_role',
        role_name: this.roleEditForm.role_name
      }
      data.permlist = this.permlist.map(item => {
        const perm = {
          type: item.type,
          checked: 0
        }
        if (this.roleEditForm.permlistSelect.indexOf(perm.type) !== -1) {
          perm.checked = 1
        }
        return perm
      })

      // 是否编辑
      if (this.editRoleId) {
        data.role_id = this.editRoleId
      }

      console.log('角色 req=>', data)
      const resp = await roleSave(data)
      console.log('角色 res=>', resp)
      if (resp.ret !== 0) return

      this.handlerRoleEditClose()
      this.$refs.roleEditDialog.hide()
      this.getRoleList()

      /**
       * 更新页面全局数据
       */
      this.$store.dispatch('user/getUserInfo')
    },
    handlerRoleEditClose() {
      this.$refs.roleEditForm.resetFields()
      this.editRoleId = ''
      this.roleEditForm.permlistSelect = []
      this.roleEditForm.role_name = ''
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
  /deep/ td {
    padding: 4px 0;
  }
}
.role-edit-wrapper {
  padding-right: 140px;
}
.btn-red {
  color: #e33119;
}
</style>

