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
        <el-form-item label="业务员" prop="salesman" label-width="70px">
          <el-select v-model="searchForm.salesman" placeholder="请选择">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in salesmanList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账户名" prop="username" label-width="70px">
          <el-input v-model.trim="searchForm.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="商户名称" prop="business_name" label-width="70px">
          <el-input v-model.trim="searchForm.business_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone" label-width="70px">
          <el-input v-model.trim="searchForm.telephone" placeholder="请输入" />
        </el-form-item>
        <br>
        <el-form-item label="开户时间" prop="create_time" label-width="70px">
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
          <span>商品列表</span>
        </div>
        <div class="add-button-group">
          <el-button class="goods-add btn-h-38" type="primary" @click="handlerAddBusinessClick">新增商户</el-button>
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
          <el-table-column prop="business_name" label="商品名称" min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.business_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="telephone" label="联系电话" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.telephone }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="vip_level" label="VIP等级" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.vip_level }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="salesman" label="业务员" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.salesman }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="开户时间" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="opr" label="操作" min-width="120" align="center">
            <template slot-scope="scope">
              <el-button type="text">编辑</el-button>
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

    <shop-edit ref="shopEdit" :business-id="editbBusinessId" @on-close="editbBusinessId=''" />
  </div>
</template>
<script>
import { BUSINESS_STATUS, pickerOptions } from '@/config/cfg'
import { businessSave, businessGet } from '@/api/api'
import moment from 'moment'
import ShopEdit from './components/ShopEdit'

export default {
  name: 'BussinessList',

  components: {
    ShopEdit
  },

  data() {
    return {
      searchForm: {
        status: '',                // 状态(1:正常,2:停用)
        salesman: '',              // 业务员ID(跟单人)
        username: '',              // 账户名
        business_name: '',         // 商户姓名（注：不是登录名）
        telephone: '',             // 联系电话
        create_time: '',           // /开户时间
        create_time_begin: 0,      // 开户时间（开始）（时间戳，秒）
        create_time_end: 0         // 开户时间（终止）（时间戳，秒）
      },

      list: [
        {
          business_id: '1',   // 账户ID
          business_name: '2', // 商户姓名（注：不是登录名）
          username: '3',      // 用户名(即用户表中的)
          vip_level: '4',     // VIP等级
          salesman: '5',      // 业务员ID(跟单人)
          status: 0,         // 状态(1:正常,2:停用)
          designer_valid: 0, // 可使用DIY设计器(1:可使用,0:不能使用)
          telephone: '7',     // 联系电话
          address: '8',       // 联系地址
          url: '0',           // 商铺URL
          create_time: '-'    // 开户时间（开始）（时间戳，秒）
        }
      ],
      tableLoading: false,
      // 分页
      total: 100, // 分页总条数
      listQuery: {
        page: 1,
        limit: 10
      },

      editbBusinessId: '1', // 在编辑的商户id

      statusOptions: [
        {
          label: BUSINESS_STATUS.toString(BUSINESS_STATUS.NORMAL),
          value: BUSINESS_STATUS.NORMAL
        },
        {
          label: BUSINESS_STATUS.toString(BUSINESS_STATUS.DISABLE),
          value: BUSINESS_STATUS.DISABLE
        }
      ],
      salesmanList: [],

      pickerOptions
    }
  },
  computed: {
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  methods: {
    async getBusinessList() {
      const data = {
        opr: 'get_business_list'
      }
      // 状态
      if (this.searchForm.status) {
        data.status = this.searchForm.status
      }
      //  业务员
      if (this.searchForm.salesman) {
        data.salesman = this.searchForm.salesman
      }
      // username
      if (this.searchForm.username) {
        data.username = this.searchForm.username
      }
      // 商户姓名
      if (this.searchForm.business_name) {
        data.business_name = this.searchForm.business_name
      }
      // telephone
      if (this.searchForm.telephone) {
        data.telephone = this.searchForm.telephone
      }
      // 开户时间
      if (this.searchForm.create_time) {
        data.create_time_begin = parseInt(moment(this.searchForm.create_time[0]).format('X'))
        data.create_time_end = parseInt(moment(this.searchForm.create_time[1]).format('X'))
      }

      console.log('商户列表 req=>', data)
      // <<<<<<<<<<<<<<<<<<<<<<<<<
      // const resp = await businessGet(data)
      // console.log('商户列表 res=>', resp)
      // if (resp.ret !== 0) return

      this.tableLoading = true
      setTimeout(() => {
        this.tableLoading = false
      }, 3000)
    },
    handlerSearchClick() {
      this.getBusinessList()
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
    },
    handlerAddBusinessClick() {
      this.$refs.shopEdit.show()
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
}
.btn-green {
  color: #1a9901;
}
.btn-red {
  color: #e33119;
}
</style>

