<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item>
          <el-button class="btn-h-38" type="primary" @click="handlerSearchClick">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="search-bottom-wrapper clearfix">
        <!-- 状态 -->
        <div class="search-item">
          <div class="search-label">
            <span>状态</span>
          </div>
          <div class="search-value">
            <el-input placeholder="请输入" />
          </div>
        </div>

        <!-- 商户名称 -->
        <div class="search-item">
          <div class="search-label">
            <span>商户名称</span>
          </div>
          <div class="search-value">
            <el-input placeholder="请输入" />
          </div>
        </div>

        <!-- 订单号 -->
        <div class="search-item">
          <div class="search-label">
            <span>订单号</span>
          </div>
          <div class="search-value">
            <el-input placeholder="请输入" />
          </div>
        </div>

        <!-- 充值时间 -->
        <div class="search-item">
          <div class="search-label">
            <span>充值时间</span>
          </div>
          <div class="search-value">
            <el-input placeholder="请输入" />
          </div>
        </div>

        <el-button type="primary">查询</el-button>
      </div>
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
          <span>充值申请</span>
        </div>
        <div class="add-button-group">
          <el-button class="add-btn" type="primary">调整账户余额</el-button>
        </div>
      </div>

      <div class="table-content default-table-change">
        <!-- table-content start -->
        <el-table :data="list" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />

          <el-table-column prop="goods_id" label="订单号" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="商户名" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="充值金额" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="充值时间" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="账户余额" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="状态" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="操作" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
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
</template>
<script>
export default {
  data() {
    return {
      // search
      searchForm: {},

      list: [
        {
          goods_id: '123'
        }, {}, {}
        // {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
      ],
      multipleSelection: [],
      tableLoading: false,
      // 分页
      total: 100, // 分页总条数
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  computed: {
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  methods: {
    handlerSearchClick() {
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      // this.getList()
      //   PageSize.set(this.$route, val);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      // this.getList()
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

  .search-item {
    float: left;
    margin: 0 20px 20px 0;
    .search-label {
      width: 72px;
      text-align: right;
      color: #333;
      float: left;
      font-size: 14px;
      line-height: 38px;
      padding-right: 12px;
    }
    .search-value {
      float: left;
    }
  }
}

.el-table {
  min-height: 400px;
}
</style>

