<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <div class="search-top-wrapper clearfix">
        <!-- 材质 -->
        <div class="search-item">
          <div class="search-label">
            <span>材质</span>
          </div>
          <div class="search-value">
            <el-input placeholder="请输入" />
          </div>
        </div>

        <!-- 商品种类 -->
        <div class="search-item">
          <div class="search-label">
            <span>商品种类</span>
          </div>
          <div class="search-value">
            <el-input placeholder="请输入" />
          </div>
        </div>

        <!-- 品牌 -->
        <div class="search-item">
          <div class="search-label">
            <span>品牌</span>
          </div>
          <div class="search-value">
            <el-input placeholder="请输入" />
          </div>
        </div>

        <!-- 型号 -->
        <div class="search-item">
          <div class="search-label">
            <span>型号</span>
          </div>
          <div class="search-value">
            <el-input placeholder="请输入" />
          </div>
        </div>

        <!-- 商品名称 -->
        <div class="search-item">
          <div class="search-label">
            <span>商品名称</span>
          </div>
          <div class="search-value">
            <el-input placeholder="请输入" />
          </div>
        </div>
      </div>
      <div class="search-bottom-wrapper clearfix">
        <!-- 商品编号 -->
        <div class="search-item">
          <div class="search-label">
            <span>商品编号</span>
          </div>
          <div class="search-value">
            <el-input placeholder="请输入" />
          </div>
        </div>

        <!-- 库存量 -->
        <div class="search-item">
          <div class="search-label">
            <span>库存量</span>
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
          <span>商品列表</span>
        </div>
        <div class="add-button-group">
          <router-link to="/manage-goods/goods/edit">
            <el-button class="goods-add" type="primary">新增商品</el-button>
          </router-link>
        </div>
      </div>

      <div class="table-content default-table-change">
        <!-- table-content start -->
        <el-table :data="list" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />

          <el-table-column prop="goods_id" label="商品编号" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="商品名称" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="材质" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="品牌" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="型号" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="商品种类" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="库存" min-width="60">
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

