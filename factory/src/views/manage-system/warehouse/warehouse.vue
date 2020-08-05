<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="仓库ID" prop="warehouse_id" label-width="70px">
          <el-input v-model.trim="searchForm.warehouse_id" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="仓库名称" prop="name" label-width="70px">
          <el-input v-model.trim="searchForm.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button class="btn-h-38" type="primary" @click="handlerSearchClick">查询</el-button>
        </el-form-item>
      </el-form>
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
            <span>仓库列表</span>
          </div>
          <div class="add-button-group">
            <el-button
              class="goods-add btn-h-38"
              type="primary"
              @click="handleAddWarehouseClick"
            >新增仓库</el-button>
          </div>
        </div>

        <div class="table-content default-table-change">
          <!-- table-content start -->
          <el-table :data="list" stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column prop="warehouse_id" label="仓库ID" min-width="60" />
            <el-table-column prop="name" label="仓库名称" min-width="80" />
            <el-table-column prop="city" label="仓库位置" min-width="60" />
            <el-table-column prop="address" label="地址" min-width="60" />
            <el-table-column prop="send_area_list" label="可城市发货" min-width="60" />
            <el-table-column prop="opr" label="操作" min-width="80" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="handleWarehouseClick(scope.row)">编辑</el-button>
                <el-button class="btn-red" type="text" @click="handleDelClick(scope.row)">删除</el-button>
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
    </div>
  </div>
</template>

<script>
import { warehouseGet } from '@/api/api'

export default {
  data() {
    return {
      searchForm: {
        warehouse_id: '', // 仓库ID
        name: '' // 仓库名称
      },

      list: [
        {
          warehouse_id: '11', // 仓库ID（空时为新建）
          name: '111', // 仓库名称
          city: '222', // 仓库所在位置(城市)
          address: '333', // 仓库详细地址
          send_area_list: ['深圳市'] // 可向哪些城市发货
        }
      ],
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
    console.log(warehouseGet)
    this.getWarehouseList()
  },
  methods: {
    async getWarehouseList() {
      const data = {
        opr: 'get_warehouse_list',
        page_no: this.listQuery.page
      }
      // 仓库ID
      if (this.searchForm.warehouse_id) {
        data.warehouse_id = this.searchForm.warehouse_id
      }
      //  仓库名称
      if (this.searchForm.name) {
        data.name = this.searchForm.name
      }
      this.tableLoading = true

      console.log('仓库列表 req=>', data)
      // const resp = await warehouseGet(data)
      // console.log('仓库列表 res=>', resp)

      // if (resp.ret !== 0) return
      this.tableLoading = false
    },
    handlerSearchClick() {
      this.listQuery.page = 1
      this.getWarehouseList()
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.getWarehouseList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getWarehouseList()
    },
    handleAddWarehouseClick() {},
    handleWarehouseClick() {},
    handleDelClick() {}
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
