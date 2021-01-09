<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="状态" prop="task_status" label-width="70px">
          <el-select v-model="searchForm.task_status" placeholder="请选择" @change="getTaskList">
            <el-option key="全部" label="全部" value />
            <el-option v-for="item in task_status_list" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="task_name" label-width="70px">
          <el-input v-model.trim="searchForm.task_name" placeholder="请输入" clearable />
        </el-form-item>

        <el-form-item>
          <el-button class="btn-h-38" type="primary" @click="handlerSearchClick">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- search end -->

    <div v-loading="tableLoading" element-loading-text="拼命加载中" class="table-wrapper table-wrapper-default">
      <div class="table-title clearfix">
        <div class="table-title__lable">
          <span>
            <i class="el-icon-goods" />
          </span>
          <span>任务列表</span>
        </div>
      </div>

      <div class="table-content default-table-change">
        <!-- table-content start -->
        <el-table :data="list" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column prop="task_id" label="任务ID" min-width="60" />
          <el-table-column prop="task_name" label="任务名称" min-width="60" />
          <el-table-column prop="start_time_txt" label="操作时间" min-width="60" />
          <el-table-column prop="end_time_txt" label="结束时间" min-width="60" />
          <el-table-column prop="task_status_txt" label="状态" min-width="60" />
          <el-table-column prop="progress" label="处理进度" min-width="60" />
          <el-table-column prop="opr_person" label="操作人" min-width="60" />
          <el-table-column prop="opr" label="操作" min-width="80" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.task_status === 1 || scope.row.task_status === 2" type="text" @click="handleStopClick(scope.row)">中止</el-button>
              <el-button
                v-if="scope.row.task_status === 3 || scope.row.task_status === 4 || scope.row.task_status === 5"
                class="btn-red"
                type="text"
                @click="handlerDelClick(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- table-content end -->

        <!-- 分页 start -->
        <div class="pagination-wrapper clearfix">
          <div class="pagination-total">
            <span>
              共
              <span class="num-text">{{ pageTotal }}</span>页/ <span class="num-text">{{ total }}</span>条数据
            </span>
          </div>
          <el-pagination
            class="sl-pagination"
            :current-page.sync="listQuery.page"
            :page-sizes="[10, 20, 40]"
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
  </div>
</template>
<script>
import { taskSave, taskGet } from '@/api/api'
import { mapState } from 'vuex'

export default {
  name: 'BackTask',

  data() {
    return {
      searchForm: {
        task_status: '', // 任务状态
        task_name: '' // 任务名称
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

      warehouseList: [] // 仓库列表
    }
  },
  computed: {
    ...mapState({
      task_status_list: (state) => state.user.task_status_list
    }),
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  mounted() {
    this.getTaskList()
    document.addEventListener('keydown', this.handleKeydownEvent, false)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeydownEvent, false)
  },
  methods: {
    handleKeydownEvent(e) {
      if (e.keyCode === 13) {
        this.getTaskList()
      }
    },
    async getTaskList() {
      const data = {
        opr: 'get_task_list',
        page_no: this.listQuery.page
      }
      // 状态
      if (this.searchForm.task_status) {
        data.task_status = this.searchForm.task_status
      }
      // task_name
      if (this.searchForm.task_name) {
        data.task_name = this.searchForm.task_name
      }

      this.tableLoading = true

      console.log('任务列表 req=>', data)
      const resp = await taskGet(data)
      console.log('任务列表 res=>', resp)
      if (resp.ret !== 0) return

      this.tableLoading = false
      this.list = resp.data.list
      this.total = resp.data.total
    },
    handlerSearchClick() {
      this.listQuery.page = 1
      this.getTaskList()
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.getTaskList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getTaskList()
    },

    async handleStopClick(row) {
      const task_id = row.task_id
      const data = {
        opr: 'cancel_task',
        task_id: task_id
      }

      const resp = await taskSave(data)
      if (resp.ret !== 0) return
      this.getTaskList()
      this.$notify({
        title: '成功',
        message: '操作成功',
        type: 'success'
      })
    },

    handlerDelClick(row) {
      const task_id = row.task_id

      this.$confirm('确认要删除选中任务？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          this.delOpr(task_id)
        })
        .catch(() => {})
    },
    async delOpr(id) {
      const data = {
        opr: 'delete_task',
        task_id: id
      }

      const resp = await taskSave(data)
      if (resp.ret !== 0) return
      this.getTaskList()
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success'
      })
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

