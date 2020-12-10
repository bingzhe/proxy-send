<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="状态" prop="status" label-width="70px">
          <el-select v-model="searchForm.status" placeholder="请选择" @change="getList">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商户名称" prop="business_name" label-width="70px">
          <el-input v-model.trim="searchForm.business_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="订单号" prop="deposit_number" label-width="70px">
          <el-input v-model.trim="searchForm.deposit_number" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="充值时间" prop="deposit_time" label-width="70px">
          <el-date-picker
            v-model="searchForm.deposit_time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            @change="getList"
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
          <span>充值申请</span>
        </div>
        <div class="add-button-group">
          <el-button class="add-btn" type="primary" @click="openAdjustBalanceDialog">调整账户余额</el-button>
        </div>
      </div>

      <div class="table-content default-table-change">
        <!-- table-content start -->
        <el-table :data="list" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />

          <el-table-column prop="deposit_number" label="订单号" min-width="60" />
          <el-table-column prop="business_name" label="商户名" min-width="60" />
          <el-table-column prop="amount" label="充值金额" min-width="60">
            <template slot-scope="scope">
              <span>¥+{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deposit_time_str" label="充值时间" min-width="60" />
          <el-table-column prop="account_balance" label="账户余额" min-width="60" />
          <el-table-column prop="status_str" label="状态" min-width="60" />
          <el-table-column prop="opr" label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="openHandlerRechargeApply(scope.row)">受理</el-button>
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

    <!-- 受理充值申弹窗 -->
    <handler-recharge-apply
      ref="rechargeApply"
      :deposit-id="curHandlerRechargeId"
      @close="handlerRechargeApplyClose"
      @on-success="handlerRechargeApplySuc"
    />

    <!-- 调整账户余额 -->
    <adjust-balance-dialog ref="adjustBalanceDialog" :business-list="businessList" @on-success="handlerAjustSuc" />
  </div>
</template>
<script>
import { RECHARGE_STATUS, pickerOptions } from '@/config/cfg'
import moment from 'moment'
import { rechargeGet } from '@/api/api'
import HandlerRechargeApply from './HandlerRechargeApply'
import AdjustBalanceDialog from './AdjustBalanceDialog'

export default {
  components: {
    HandlerRechargeApply,
    AdjustBalanceDialog
  },
  data() {
    return {
      // search
      searchForm: {
        status: '',              // 状态(1:待审核,2:审核失败,3:已到账)
        business_name: '',       // 商户名称
        deposit_number: '',      // 充值单号
        deposit_time: '',        // 充值时间
        deposit_time_begin: 0,   // 充值时间（开始）（时间戳，秒）
        deposit_time_end: 0      // 充值时间（终止）（时间戳，秒）
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

      statusOptions: [
        {
          label: RECHARGE_STATUS.toString(RECHARGE_STATUS.AUDIT),
          value: RECHARGE_STATUS.AUDIT
        },
        {
          label: RECHARGE_STATUS.toString(RECHARGE_STATUS.FAIL),
          value: RECHARGE_STATUS.FAIL
        },
        {
          label: RECHARGE_STATUS.toString(RECHARGE_STATUS.SUCCESS),
          value: RECHARGE_STATUS.SUCCESS
        }
      ],

      curHandlerRechargeId: '', // 正在处理的充值订单
      pickerOptions,

      businessList: [
        // {
        //   business_name: '11',
        //   business_id: '22',
        //   balance: '33'   // 余额
        // }
      ]
    }
  },
  computed: {
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  mounted() {
    this.getList()
    this.getBusinessList()
    document.addEventListener('keydown', this.handleKeydownEvent, false)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeydownEvent, false)
  },
  methods: {
    handleKeydownEvent(e) {
      if (e.keyCode === 13) {
        this.getList()
      }
    },
    async getList() {
      const data = {
        opr: 'get_recharge_list',
        page_no: this.listQuery.page
      }

      // 状态
      if (this.searchForm.status) {
        data.status = this.searchForm.status
      }
      // 商户名称
      if (this.searchForm.business_name) {
        data.business_name = this.searchForm.business_name
      }
      // 充值单号
      if (this.searchForm.deposit_number) {
        data.deposit_number = this.searchForm.deposit_number
      }
      // 充值时间
      if (this.searchForm.deposit_time) {
        data.deposit_time_begin = parseInt(moment(this.searchForm.deposit_time[0]).format('X'))
        data.deposit_time_end = parseInt(moment(this.searchForm.deposit_time[1]).format('X'))
      }

      this.tableLoading = true

      console.log('充值申请单 req=>', data)
      const resp = await rechargeGet(data)
      console.log('充值申请单 res=>', resp)

      if (resp.ret !== 0) return
      this.tableLoading = false

      this.list = resp.data.list || []
      this.total = resp.data.total

      this.list = this.list.map(item => {
        if (item.deposit_time) {
          item.deposit_time_str = moment(item.deposit_time * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          item.status_str = RECHARGE_STATUS.toString(item.status)
        }
        return item
      })
    },
    handlerSearchClick() {
      this.listQuery.page = 1
      this.getList()
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
    openHandlerRechargeApply(row) {
      this.curHandlerRechargeId = row.deposit_id
      this.$refs.rechargeApply.show()
    },
    handlerRechargeApplyClose() {
      this.curHandlerRechargeId = ''
    },
    handlerRechargeApplySuc() {
      this.getList()
    },
    openAdjustBalanceDialog() {
      this.$refs.adjustBalanceDialog.show()
    },
    async getBusinessList() {
      const resp = await rechargeGet({ opr: 'get_recharge_business_list' })
      console.log('商户列表 res=>', resp)

      if (resp.ret !== 0) return

      this.businessList = resp.data.list || []
    },
    handlerAjustSuc() {
      this.getList()
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
</style>

