<template>
  <div class="app-container">
    <div class="cur-balance-wrapper">
      <span class="label">当前账户余额：</span>
      <span class="balance">￥{{ account_balance }}</span>
      <el-button type="primary" @click="openRechargeDialog">现在充值</el-button>
    </div>
    <div class="app-wrapper">
      <!-- search start -->
      <div class="search-wrapper">
        <el-form ref="searchForm" :model="searchForm" :inline="true">
          <el-form-item label="状态" prop="status" label-width="45px">
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
        </div>

        <div class="table-content default-table-change">
          <!-- table-content start -->
          <el-table :data="list" stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="55" />

            <el-table-column prop="deposit_number" label="订单号" min-width="60" />
            <el-table-column prop="channel" label="充值渠道" min-width="60" />
            <el-table-column prop="amount" label="充值金额" min-width="60">
              <template slot-scope="scope">
                <span>¥+{{ scope.row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="account_balance" label="账户余额" min-width="60" />
            <el-table-column prop="status_str" label="状态" min-width="60" />
            <el-table-column prop="deposit_time_str" label="充值时间" min-width="60" />
            <el-table-column prop="opr_remark" label="失败原因" min-width="80">
              <template slot-scope="scope">
                <span style="display:inline-block;height:30px;">{{ scope.row.opr_remark }}</span>
                <div class="placeholder-height" />
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

      <!-- 充值申请弹窗 -->
      <dialog-recharge ref="dialogRecharge" @on-success="handlerRechargeSuc" />
    </div>
  </div>
</template>
<script>
import { RECHARGE_STATUS, pickerOptions } from '@/config/cfg'
import moment from 'moment'
import { rechargeGet } from '@/api/api'
import DialogRecharge from './DialogRecharge'
import { mapState } from 'vuex'

export default {
  components: {
    DialogRecharge
  },
  data() {
    return {
      // search
      searchForm: {
        status: '',              // 状态(1:待审核,2:审核失败,3:已到账)
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

      // curHandlerRechargeId: '', // 正在处理的充值订单
      pickerOptions

      // businessList: [
      //   // {
      //   //   business_name: '11',
      //   //   business_id: '22',
      //   //   balance: '33'   // 余额
      //   // }
      // ]
    }
  },
  computed: {
    ...mapState({
      business_info: state => state.user.business_info
    }),
    account_balance() {
      return this.business_info.account_balance
    },
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  mounted() {
    this.getList()
    // 更新页面全局数据
    this.$store.dispatch('user/getUserInfo')
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
    openRechargeDialog() {
      this.$refs.dialogRecharge.show()
    },
    handlerRechargeSuc() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
// .app-container {
// }
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
  .placeholder-height {
    display: inline-block;
    height: 30px;
    width: 1px;
  }
}
.cur-balance-wrapper {
  height: 70px;
  line-height: 70px;
  background: #fff;
  border-radius: 2px;
  margin-bottom: 10px;
  padding: 0 16px;
  .label {
    font-size: 16px;
    color: #333;
  }
  .balance {
    color: #e33119;
    font-size: 24px;
    margin-left: 10px;
  }
  .el-button {
    font-size: 16px;
    margin-left: 20px;
    padding: 13px 16px;
    font-weight: bold;
    box-shadow: 0px 0px 8px 1px #2584f9;
  }
}
</style>

