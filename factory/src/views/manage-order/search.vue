<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="订单状态" prop="order_status" label-width="70px">
          <el-select v-model="searchForm.order_status" placeholder="请选择" @change="getList">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in orderStausOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号" prop="order_id" label-width="70px">
          <el-input v-model.trim="searchForm.order_id" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="收货人手机" prop="consignee_phone" label-width="85px">
          <el-input v-model.trim="searchForm.consignee_phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="商户名" prop="business_name" label-width="70px">
          <el-input v-model.trim="searchForm.business_name" placeholder="请输入" />
        </el-form-item>
        <br />
        <el-form-item label="业务员" prop="salesman" label-width="70px">
          <el-input v-model.trim="searchForm.salesman" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="下单时间" prop="order_time" label-width="70px">
          <el-date-picker
            v-model="searchForm.order_time"
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
          <span>订单审核列表</span>
        </div>
      </div>

      <div class="table-content default-table-change">
        <!-- table-content start -->
        <el-table :data="list" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />

          <el-table-column prop="order_id" label="订单编号" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.order_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="business_name" label="商户名" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.business_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="consignee_person" label="收货人姓名" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.consignee_person }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="consignee_phone" label="收货人手机" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.consignee_phone }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="order_fee" label="订单金额" min-width="60">
            <template slot-scope="scope">
              <span>￥{{ scope.row.order_fee }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="salesman_name" label="业务员" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.salesman_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="delivery_number" label="物流单号" min-width="60" />
          <el-table-column prop="order_time" label="下单时间" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.order_time_str }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="order_status" label="订单状态" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.order_status_str }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="order_remark" label="备注" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.order_remark }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="opr" label="操作" width="210">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="goSearchOrderinfo(scope.row.order_id)"
              >订单详情</el-button>
              <el-button
                v-if="scope.row.order_status === ORDER_STATUS.DELIVERY_WAIT"
                type="text"
                @click="openChangeAddressDialog(scope.row.order_id)"
              >修改收货信息</el-button>
              <a href="https://www.kuaidi100.com/" target="_black">
                <el-button
                  v-if="scope.row.order_status === ORDER_STATUS.DELIVERY_SUC"
                  type="text"
                >物流跟踪</el-button>
              </a>
              <el-button
                v-if="scope.row.order_status === ORDER_STATUS.DELIVERY_SUC"
                type="text"
                @click="openRefundDialog(scope.row)"
              >退款</el-button>
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

    <!-- 退款弹窗 -->
    <dialog-refund
      ref="refundDialog"
      :refund-info="refundInfo"
      @close="handlerRefundDialogClose"
      @on-success="handlerRefundDialogSuc"
    />

    <!-- 调整地址 -->
    <dialog-change-address
      ref="changeAddress"
      :order-id="curChangeAddressId"
      @close="handlerChangeAddressClose"
      @on-success="handlerChangeAddrerss"
    />
  </div>
</template>
<script>
import { orderGet } from '@/api/api'
import moment from 'moment'
import { ORDER_STATUS, pickerOptions } from '@/config/cfg'
import DialogChangeAddress from './components/DialogChangeAddress'
import DialogRefund from './components/DialogRefund'

export default {
  components: {
    DialogRefund,
    DialogChangeAddress
  },
  data() {
    return {
      // search
      searchForm: {
        order_status: '', // 订单状态(1:待审核,2:审核未通过,3:待发货,4:已发货,5:已撤销,6:已退款)
        order_id: '', // 订单id(编号)
        consignee_phone: '', // 收货人手机号码
        business_name: '', // 商户名称
        salesman: '', // 业务员(跟单人)
        // goods_name: '',            // 商品名称
        // consignee_person: '',      // 收货人名
        order_time: '', // 下单时间
        order_time_begin: 0, // 开始时间（时间戳，秒）
        order_time_end: 0 // 终止时间（时间戳，秒）
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

      orderStausOptions: [
        {
          label: ORDER_STATUS.toString(ORDER_STATUS.AUDIT_WAIT),
          value: ORDER_STATUS.AUDIT_WAIT
        },
        {
          label: ORDER_STATUS.toString(ORDER_STATUS.AUDIT_FAIL),
          value: ORDER_STATUS.AUDIT_FAIL
        },
        {
          label: ORDER_STATUS.toString(ORDER_STATUS.DELIVERY_WAIT),
          value: ORDER_STATUS.DELIVERY_WAIT
        },
        {
          label: ORDER_STATUS.toString(ORDER_STATUS.DELIVERY_SUC),
          value: ORDER_STATUS.DELIVERY_SUC
        },
        {
          label: ORDER_STATUS.toString(ORDER_STATUS.REVOCAT),
          value: ORDER_STATUS.REVOCAT
        },
        {
          label: ORDER_STATUS.toString(ORDER_STATUS.REFUND),
          value: ORDER_STATUS.REFUND
        },
        {
          label: ORDER_STATUS.toString(ORDER_STATUS.COMPLETE),
          value: ORDER_STATUS.COMPLETE
        },
        {
          label: ORDER_STATUS.toString(ORDER_STATUS.REPLENISH_WAIT),
          value: ORDER_STATUS.REPLENISH_WAIT
        },
        {
          label: ORDER_STATUS.toString(ORDER_STATUS.FREEZE),
          value: ORDER_STATUS.FREEZE
        },
        {
          label: ORDER_STATUS.toString(ORDER_STATUS.ERROR),
          value: ORDER_STATUS.ERROR
        }
      ],
      ORDER_STATUS,
      pickerOptions,

      // 退款弹窗信息
      refundInfo: {
        order_id: '',
        actual_fee: ''
      },

      curChangeAddressId: ''
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
        opr: 'get_order_list',
        page_no: this.listQuery.page
      }

      // 订单状态
      if (this.searchForm.order_status) {
        data.order_status = this.searchForm.order_status
      }
      // 订单id(编号)
      if (this.searchForm.order_id) {
        data.order_id = this.searchForm.order_id
      }
      // 收货人手机号码
      if (this.searchForm.consignee_phone) {
        data.consignee_phone = this.searchForm.consignee_phone
      }
      // 商户名称
      if (this.searchForm.business_name) {
        data.business_name = this.searchForm.business_name
      }
      // 业务员(跟单人)
      if (this.searchForm.salesman) {
        data.salesman = this.searchForm.salesman
      }
      // 下单时间
      if (this.searchForm.order_time) {
        data.order_time_begin = parseInt(moment(this.searchForm.order_time[0]).format('X'))
        data.order_time_end = parseInt(moment(this.searchForm.order_time[1]).format('X'))
      }

      this.tableLoading = true

      console.log('订单列表 req=>', data)
      const resp = await orderGet(data)
      console.log('订单列表 res=>', resp)

      if (resp.ret !== 0) return
      this.tableLoading = false

      this.list = resp.data.list
      this.total = resp.data.total

      this.list = this.list.map((item) => {
        if (item.order_time) {
          item.order_time_str = moment(item.order_time * 1000).format('YYYY-MM-DD HH:mm:ss')
        }

        if (item.order_status) {
          // item.order_status_str = ORDER_STATUS.toString(item.order_status)
          item.order_status_str = item.order_status_txt
        }

        item.delivery_number = (item.delivery_info || {}).delivery_number || '-'

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
    goSearchOrderinfo(id) {
      this.$router.push({
        path: '/manage-order/searchorderinfo',
        query: {
          orderid: id
        }
      })
    },
    openRefundDialog(row) {
      this.refundInfo.order_id = row.order_id
      this.refundInfo.actual_fee = row.actual_fee
      this.$refs.refundDialog.show()
    },
    handlerRefundDialogClose() {
      this.refundInfo.order_id = ''
      this.refundInfo.actual_fee = ''
    },
    handlerRefundDialogSuc() {
      this.getList()
    },
    openChangeAddressDialog(id) {
      this.curChangeAddressId = id
      this.$refs.changeAddress.show()
    },
    handlerChangeAddressClose() {
      this.curChangeAddressId = ''
    },
    handlerChangeAddrerss() {
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
  .el-button + .el-button {
    margin-left: 0;
  }
  .el-button {
    margin-right: 10px;
  }
}
</style>
