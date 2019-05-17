<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="状态" prop="status" label-width="70px">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role_id" label-width="70px">
          <el-select v-model="searchForm.role_id" placeholder="请选择">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in roleList"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账户名" prop="username" label-width="70px">
          <el-input v-model.trim="searchForm.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="姓名" prop="real_name" label-width="70px">
          <el-input v-model.trim="searchForm.real_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" label-width="70px">
          <el-input v-model.trim="searchForm.phone" placeholder="请输入" />
        </el-form-item>
        <br>
        <el-form-item label="创建时间" prop="create_time" label-width="70px">
          <el-date-picker
            v-model="searchForm.create_time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          />
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
          <span>员工列表</span>
        </div>
        <div class="add-button-group">
          <el-button class="goods-add btn-h-38" type="primary" @click="handlerAddStaffClick">新增员工</el-button>
        </div>
      </div>

      <div class="table-content default-table-change">
        <!-- table-content start -->
        <el-table :data="list" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />

          <el-table-column prop="username" label="账户名" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="real_name" label="姓名" min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.real_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="联系电话" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="role_id" label="角色" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.role_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.status_str }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time_str }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="opr" label="操作" min-width="80" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handlerStaffEditClick(scope.row)">编辑</el-button>
              <el-button class="btn-red" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- table-content end -->

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

    <staff-edit
      ref="staffEdit"
      :staff-id="editStaffId"
      :role-list="roleList"
      @on-success="getStaffList"
      @on-close="handlerEditClose"
    />
  </div>
</template>
<script>
import { STAFF_STATUS, pickerOptions } from '@/config/cfg'
import { employeeSave, employeeGet, roleGet } from '@/api/api'
import moment from 'moment'
import StaffEdit from './StaffEdit'

export default {
  name: 'StaffList',

  components: {
    StaffEdit
  },

  data() {
    return {
      searchForm: {
        status: '',                // 状态(1:正常,2:停用)
        role_id: '',               // 角色ID
        username: '',              // 账户名
        real_name: '',             // 员工姓名
        phone: '',                 // 手机号
        create_time: '',           // 创建时间
        create_time_begin: 0,      // 创建时间（开始）（时间戳，秒）
        create_time_end: 0         // 创建时间（终止）（时间戳，秒）
      },

      list: [],

      tableLoading: false,
      // 分页
      total: 100, // 分页总条数
      listQuery: {
        page: 1,
        limit: 20
      },

      editStaffId: '', // 在编辑的员工id

      statusOptions: [
        {
          label: STAFF_STATUS.toString(STAFF_STATUS.NORMAL),
          value: STAFF_STATUS.NORMAL
        },
        {
          label: STAFF_STATUS.toString(STAFF_STATUS.DISABLE),
          value: STAFF_STATUS.DISABLE
        }
      ],
      roleList: [],

      pickerOptions
    }
  },
  computed: {
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  mounted() {
    this.getStaffList()
    this.getRoleList()
  },
  methods: {
    async getStaffList() {
      const data = {
        opr: 'get_employee_list',
        page_no: this.listQuery.page
      }
      // 状态
      if (this.searchForm.status) {
        data.status = this.searchForm.status
      }
      //  角色ID
      if (this.searchForm.role_id) {
        data.role_id = this.searchForm.role_id
      }
      // username
      if (this.searchForm.username) {
        data.username = this.searchForm.username
      }
      // 员工姓名
      if (this.searchForm.real_name) {
        data.real_name = this.searchForm.real_name
      }

      // phone
      if (this.searchForm.phone) {
        data.phone = this.searchForm.phone
      }
      // 创建时间
      if (this.searchForm.create_time) {
        data.create_time_begin = parseInt(moment(this.searchForm.create_time[0]).format('X'))
        data.create_time_end = parseInt(moment(this.searchForm.create_time[1]).format('X'))
      }

      this.tableLoading = true

      // console.log('员工列表 req=>', data)
      const resp = await employeeGet(data)
      // console.log('员工列表 res=>', resp)
      if (resp.ret !== 0) return

      this.tableLoading = false
      this.list = resp.data.list
      this.total = resp.data.total

      this.list.map(item => {
        if (item.status) {
          item.status_str = STAFF_STATUS.toString(item.status)
        }
        if (item.create_time) {
          item.create_time_str = moment(item.create_time * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }
        return item
      })
    },
    async getRoleList() {
      const data = {
        opr: 'get_role_list'
      }

      const resp = await roleGet(data)
      console.log('角色列表  res=>', resp)
      if (resp.ret !== 0) return
      this.roleList = resp.data.list
    },
    handlerSearchClick() {
      this.listQuery.page = 1
      this.getStaffList()
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.getStaffList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getStaffList()
    },
    handlerAddStaffClick() {
      this.$refs.staffEdit.show()
    },
    handlerStaffEditClick(row) {
      this.editStaffId = row.employee_id
      this.$refs.staffEdit.show()
    },
    handlerEditClose() {
      this.editStaffId = ''
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
    width: 180px;
  }
  .el-select {
    width: 180px;
  }
}
.el-table {
  min-height: 400px;

  /deep/ td {
    padding: 4px 0;
  }
}
.btn-green {
  color: #1a9901;
}
.btn-red {
  color: #e33119;
}
</style>

