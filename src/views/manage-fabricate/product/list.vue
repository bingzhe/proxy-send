<template>
  <div class="app-container">
    <div class="product-status-wrapper clearfix">
      <div
        v-for="(item,key) in statusList"
        :key="key"
        class="status-item"
        :class="{'status-item--active': searchForm.status_txt === item.value}"
        @click="handlerStatusCardClick(item)"
      >
        {{ item.text }}
        (
        <span class="status-num">{{ item.num }}</span>
        )
      </div>
    </div>

    <div class="app-wrapper">
      <!-- search start -->
      <div class="search-wrapper">
        <el-form ref="searchForm" :model="searchForm" :inline="true">
          <el-form-item label="品牌" prop="brand_id" label-width="70px">
            <el-select v-model="searchForm.brand_id" placeholder="请选择">
              <el-option key="全部" label="全部" value />
              <el-option
                v-for="item in phone_brand_list"
                :key="item.brand_id"
                :label="item.brand_name"
                :value="item.brand_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status_txt" label-width="70px">
            <el-select v-model="searchForm.status_txt" placeholder="请选择">
              <el-option
                v-for="(item,key) in statusList"
                :key="key"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="材质" prop="raw_material" label-width="70px">
            <el-select v-model="searchForm.raw_material" placeholder="请选择">
              <el-option key="全部" label="全部" value />
              <el-option v-for="item in raw_material_list" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="订单编号" prop="order_id" label-width="70px">
            <el-input v-model.trim="searchForm.order_id" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="型号" prop="model_name" label-width="70px">
            <el-input v-model.trim="searchForm.model_name" placeholder="请输入" />
          </el-form-item>
          <br>
          <el-form-item label="下单时间" prop="create_time" label-width="70px">
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
            <span>生产单列表</span>
          </div>
          <div class="add-button-group">
            <router-link to="/manage-goods/goods/edit">
              <el-button class="goods-add btn-h-38" type="primary">下载</el-button>
              <el-button class="goods-add btn-h-38" type="primary">全部下载</el-button>
            </router-link>
          </div>
        </div>

        <div class="table-content default-table-change">
          <!-- table-content start -->
          <el-table :data="list" stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column prop="order_id" label="订单编号" min-width="60" />
            <el-table-column prop="brand_name" label="品牌" min-width="60" />
            <el-table-column prop="model_name" label="型号" min-width="60" />
            <el-table-column prop="goods_name" label="商品名称" min-width="60" />
            <el-table-column prop="num" label="生产数量" min-width="60" />
            <el-table-column prop="create_time_str" label="下单时间" min-width="80" />
            <el-table-column prop="status_txt" label="状态" min-width="60" />
            <el-table-column prop="opr" label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="openProductInfo(scope.row)">生产单详情</el-button>
                <el-button type="text" @click="handlerChangeStatusClick(scope.row)">修改状态</el-button>
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

    <product-info-dialog ref="productInfoDialog" />
  </div>
</template>

<script>
import { productionOrderGet } from '@/api/api'
import { pickerOptions } from '@/config/cfg'
import { mapState } from 'vuex'
import moment from 'moment'
import ProductInfoDialog from './ProductInfoDialog'

export default {
  components: {
    ProductInfoDialog
  },

  data() {
    return {
      // search
      searchForm: {
        brand_id: '',              // 品牌id
        status_txt: '',            // 生产单状态('未下载', '已下载', '下载失败', '下载成功')
        raw_material: '',          // 材质
        order_id: '',              // 订单id(编号)
        model_name: '',            // 型号名称
        create_time: '',
        create_time_begin: 0,      // 创建时间（开始）时间戳，秒
        create_time_end: 0         // 创建时间（终止）时间戳，秒
      },

      list: [],
      multipleSelection: [],
      tableLoading: false,
      // 分页
      total: 100, // 分页总条数
      listQuery: {
        page: 1,
        limit: 20
      },

      statusList: {
        all: { value: '', text: '全部', num: 0 },
        noUpdate: { value: '未下载', text: '未下载', num: 0 },
        updateSuc: { value: '已下载', text: '已下载', num: 0 },
        updateFail: { value: '下载失败', text: '下载失败', num: 0 }
      },
      pickerOptions

    }
  },
  computed: {
    ...mapState({
      phone_brand_list: state => state.user.phone_brand_list,
      raw_material_list: state => state.user.raw_material_list
    }),
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const data = {
        opr: 'get_production_order_list',
        page_no: this.listQuery.page
      }

      // 品牌id
      if (this.searchForm.brand_id) {
        data.brand_id = this.searchForm.brand_id
      }
      // 生产单状态
      if (this.searchForm.status_txt) {
        data.status_txt = this.searchForm.status_txt
      }
      // 材质
      if (this.searchForm.raw_material) {
        data.raw_material = this.searchForm.raw_material
      }
      // 订单id
      if (this.searchForm.order_id) {
        data.order_id = this.searchForm.order_id
      }
      // 型号名称
      if (this.searchForm.model_name) {
        data.model_name = this.searchForm.model_name
      }
      // 下单时间
      if (this.searchForm.create_time) {
        data.create_time_begin = parseInt(moment(this.searchForm.create_time[0]).format('X'))
        data.create_time_end = parseInt(moment(this.searchForm.create_time[1]).format('X'))
      }

      this.tableLoading = true

      console.log('生产单列表 req=>', data)
      const resp = await productionOrderGet(data)
      console.log('生产单列表 res=>', resp)

      if (resp.ret !== 0) return
      this.tableLoading = false

      this.list = resp.data.list
      this.total = resp.data.total

      this.list = this.list.map(item => {
        if (item.create_time) {
          item.create_time_str = moment(item.create_time * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }
        return item
      })
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handlerSearchClick() {
      this.listQuery.page = 1
      this.getList()
    },
    openProductInfo(row) {
      console.log(this.$refs.productInfoDialog)
      this.$refs.productInfoDialog.show()
    },
    handlerChangeStatusClick(row) {

    },
    handlerStatusCardClick(item) {
      this.searchForm.status_txt = item.text
    }
  }
}
</script>

<style lang="scss" scoped>
.product-status-wrapper {
  .status-item {
    height: 64px;
    width: 240px;
    border-radius: 2px;
    font-size: 16px;
    color: #333;
    text-align: center;
    line-height: 64px;
    margin-right: 30px;
    background: #fff;
    float: left;
    margin-bottom: 20px;

    .status-num {
      color: #e33119;
    }
    &.status-item--active {
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      background: #2584f9;
      box-shadow: 0px 0px 8px 0px #2584f9;
      .status-num {
        color: #fff;
      }
    }
  }
}

.app-wrapper {
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
</style>

