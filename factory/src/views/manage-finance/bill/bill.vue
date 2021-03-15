<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="类型" prop="opr_type" label-width="70px">
          <el-select v-model="searchForm.opr_type" placeholder="请选择" @change="getList">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in oprTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作编号" prop="opr_number" label-width="70px">
          <el-input v-model.trim="searchForm.opr_number" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="商户名称" prop="business_name" label-width="70px">
          <el-input v-model.trim="searchForm.business_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="操作时间" prop="opr_time" label-width="70px">
          <el-date-picker
            v-model="searchForm.opr_time"
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
          <el-button class="btn-h-38" type="primary" @click="handlerSearchClick">
            查询
          </el-button>
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
          <span>账单列表</span>
        </div>
      </div>

      <div class="table-content default-table-change">
        <!-- table-content start -->
        <el-table :data="list" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />

          <el-table-column prop="opr_number" label="操作编号" min-width="60" />
          <el-table-column prop="business_name" label="商户名称" min-width="60" />
          <el-table-column prop="opr_type_txt" label="操作类型" min-width="60" />
          <el-table-column prop="cost_amount" label="消费金额" min-width="60" />
          <el-table-column prop="opr_time_str" label="操作时间" min-width="60" />
          <el-table-column prop="goods_id" label="操作" min-width="60">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.opr_type === OPR_TYPE.ORDER ||
                  scope.row.opr_type === OPR_TYPE.ADJUST_ORDER_FEE ||
                  scope.row.opr_type === OPR_TYPE.ORDER_FAIL_REFUND ||
                  scope.row.opr_type === OPR_TYPE.ADUIT_FAIL_REFUND ||
                  scope.row.opr_type === OPR_TYPE.REFUND"
                type="text"
                @click="goSearchOrderinfo(scope.row)"
              >查看详情</el-button>
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
import { accounttrackGet, pickerOptions } from '@/api/api'
import { OPR_TYPE } from '@/config/cfg'
import moment from 'moment'

export default {
  data() {
    return {
      searchForm: {
        opr_type: '',             // 操作类型（1:充值,2:下单,3:调整订单金额,4:撤销订单退款,5:审核不通过退款,6:调整账户余额,7:退款）
        opr_number: '',           // 操作编号/单号（订单id、充值单号等）
        business_name: '',        // 商户名称
        opr_time: '',             // 操作时间
        opr_time_begin: 0,        // 操作时间（开始）（时间戳，秒）
        opr_time_end: 0           // 操作时间（终止）（时间戳，秒）
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

      oprTypeOptions: [
        { label: OPR_TYPE.toString(OPR_TYPE.RECHARGE), value: OPR_TYPE.RECHARGE },
        { label: OPR_TYPE.toString(OPR_TYPE.ORDER), value: OPR_TYPE.ORDER },
        { label: OPR_TYPE.toString(OPR_TYPE.ADJUST_ORDER_FEE), value: OPR_TYPE.ADJUST_ORDER_FEE },
        { label: OPR_TYPE.toString(OPR_TYPE.ORDER_FAIL_REFUND), value: OPR_TYPE.ORDER_FAIL_REFUND },
        { label: OPR_TYPE.toString(OPR_TYPE.ADUIT_FAIL_REFUND), value: OPR_TYPE.ADUIT_FAIL_REFUND },
        { label: OPR_TYPE.toString(OPR_TYPE.ADJUST_BALANCE), value: OPR_TYPE.ADJUST_BALANCE },
        { label: OPR_TYPE.toString(OPR_TYPE.REFUND), value: OPR_TYPE.REFUND }
      ],
      pickerOptions,
      OPR_TYPE
    }
  },
  computed: {
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  mounted() {
    this.getList()
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
        opr: 'get_account_track_list',
        page_no: this.listQuery.page
      }

      // 操作类型
      if (this.searchForm.opr_type) {
        data.opr_type = this.searchForm.opr_type
      }
      // 操作编号
      if (this.searchForm.opr_number) {
        data.opr_number = this.searchForm.opr_number
      }
      // business_name
      if (this.searchForm.business_name) {
        data.business_name = this.searchForm.business_name
      }
      // 操作时间
      if (this.searchForm.opr_time) {
        data.opr_time_begin = parseInt(moment(this.searchForm.opr_time[0]).format('X'))
        data.opr_time_end = parseInt(moment(this.searchForm.opr_time[1]).format('X'))
      }

      this.tableLoading = true

      console.log('对账单 req=>', data)
      const resp = await accounttrackGet(data)
      console.log('对账单 res=>', resp)

      if (resp.ret !== 0) return
      this.tableLoading = false

      this.list = resp.data.list || []
      this.total = resp.data.total

      this.list = this.list.map(item => {
        if (item.opr_time) {
          item.opr_time_str = moment(item.opr_time * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          )
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
    goSearchOrderinfo(row) {
      const id = row.opr_number
      this.$router.push({
        path: '/manage-order/searchorderinfo',
        query: {
          orderid: id
        }
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
</style>

