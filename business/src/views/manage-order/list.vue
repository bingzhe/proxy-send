<template>
  <div class="app-container">
    <el-row :gutter="10" class="order-status-wrapper clearfix">
      <el-col v-for="(item, key) in statusList" :key="key" :span="2" class="status-item" :class="{ 'status-item--active': searchForm.order_status === item.value }">
        <div class="status-text" @click="handlerStatusCardClick(item)">
          {{ item.label }}
          (
          <span class="status-num">{{ item.num }}</span>
          )
        </div>
      </el-col>
    </el-row>
    <div class="app-wrapper">
      <!-- search start -->
      <div class="search-wrapper">
        <el-form ref="searchForm" :model="searchForm" :inline="true">
          <!-- <el-form-item label="订单状态" prop="order_status" label-width="70px">
          <el-select v-model="searchForm.order_status" placeholder="请选择">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in orderStausOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          </el-form-item>-->

          <el-form-item label="手机号" prop="consignee_phone" label-width="70px">
            <el-input v-model.trim="searchForm.consignee_phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="收货人姓名" prop="consignee_person" label-width="85px">
            <el-input v-model.trim="searchForm.consignee_person" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="订单编号" prop="order_id" label-width="70px">
            <el-input v-model.trim="searchForm.order_id" placeholder="请输入" />
          </el-form-item>
          <br />
          <el-form-item label="商品名称" prop="goods_name" label-width="70px">
            <el-input v-model.trim="searchForm.goods_name" placeholder="请输入" />
          </el-form-item>
          <!-- <el-form-item label="商户名" prop="business_name" label-width="70px">
          <el-input v-model.trim="searchForm.business_name" placeholder="请输入" />
          </el-form-item>-->
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

      <div v-loading="tableLoading" element-loading-text="拼命加载中" class="table-wrapper table-wrapper-default">
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

            <el-table-column prop="order_id" label="订单编号" min-width="60" />
            <el-table-column prop="goods_name" label="商品名称" min-width="60" />
            <el-table-column prop="consignee_person" label="收货人" min-width="60" />
            <el-table-column prop="consignee_phone" label="手机号码" min-width="60" />
            <el-table-column prop="order_fee" label="订单金额" min-width="60" />
            <el-table-column prop="order_status_str" label="订单状态" min-width="60" />
            <el-table-column prop="delivery_company_name" label="物流公司" min-width="60" />
            <el-table-column prop="delivery_number" label="物流单号" min-width="60" />
            <el-table-column prop="order_time_str" label="下单时间" min-width="60" />

            <el-table-column prop="opr" label="操作" width="240">
              <template slot-scope="scope">
                <div class="button-group">
                  <el-button type="text" @click="goOrderinfo(scope.row.order_id)">订单详情</el-button>

                  <el-button v-if="scope.row.order_status === ORDER_STATUS.AUDIT_WAIT" type="text" @click="openUndoDialogTip(scope.row.order_id)">撤销订单</el-button>
                  <el-button
                    v-if="scope.row.order_status === ORDER_STATUS.AUDIT_FAIL || scope.row.order_status === ORDER_STATUS.REPLENISH_WAIT"
                    type="text"
                    @click="handlerEditBtnClick(scope.row.order_id)"
                  >编辑订单</el-button>
                  <a href="https://www.kuaidi100.com/" target="_black">
                    <el-button v-if="scope.row.order_status === ORDER_STATUS.DELIVERY_SUC" type="text">物流跟踪</el-button>
                  </a>
                  <el-button
                    v-if="scope.row.order_status === ORDER_STATUS.AUDIT_FAIL || scope.row.order_status === ORDER_STATUS.REVOCAT"
                    type="text"
                    class="red-btn"
                    @click="openDeleteDialogTip(scope.row.order_id)"
                  >删除订单</el-button>
                </div>
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

    <!-- 撤销提示弹窗 -->
    <dialog-tip
      ref="undoDialogTip"
      type="undo"
      cancel-text="不撤销"
      confirm-text="撤销"
      title="撤销订单"
      tip-text="订单撤销不能还原，确定要撤销？"
      @confirm="undoOrderOpr"
      @close="handlerUndoDialogClose"
    />

    <!-- 删除提示弹窗 -->
    <dialog-tip
      ref="deleteDialogTip"
      type="delete"
      cancel-text="不删除"
      confirm-text="删除"
      title="删除订单"
      tip-text="确定要删除订单吗？"
      @confirm="deleteOrderOpr"
      @close="handlerDeleteDialogClose"
    />
  </div>
</template>
<script>
import { orderGet, orderSave } from '@/api/api'
import { ORDER_STATUS, pickerOptions } from '@/config/cfg'
import DialogTip from '@/components/Dialog/DialogTip'
import moment from 'moment'

export default {
  components: {
    DialogTip
  },

  data() {
    return {
      // search
      searchForm: {
        order_status: '', // 订单状态(1:待审核,2:审核未通过,3:待发货,4:已发货,5:已撤销,6:已退款)
        order_id: '', // 订单id(编号)
        consignee_phone: '', // 收货人手机号码
        // business_name: '',    // 商户名称
        goods_name: '', // 商品名称
        // salesman: '',         // 业务员(跟单人)
        consignee_person: '', // 收货人名
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

      // orderStausOptions: [
      //   {
      //     label: ORDER_STATUS.toString(ORDER_STATUS.AUDIT_WAIT),
      //     value: ORDER_STATUS.AUDIT_WAIT
      //   },
      //   {
      //     label: ORDER_STATUS.toString(ORDER_STATUS.AUDIT_FAIL),
      //     value: ORDER_STATUS.AUDIT_FAIL
      //   }
      //   // {
      //   //   label: '已通过',
      //   //   value: ORDER_STATUS.DELIVERY_WAIT
      //   // }
      // ],
      ORDER_STATUS,
      pickerOptions,

      statusList: {
        all: { label: '全部', value: '', num: 0 },
        audit_wait: {
          label: '待审核',
          value: ORDER_STATUS.AUDIT_WAIT,
          num: 0
        },
        audit_faile: {
          label: '审核未通过',
          value: ORDER_STATUS.AUDIT_FAIL,
          num: 0
        },
        delivery_wait: {
          label: '待发货',
          value: ORDER_STATUS.DELIVERY_WAIT,
          num: 0
        },
        delivery_suc: {
          label: '已发货',
          value: ORDER_STATUS.DELIVERY_SUC,
          num: 0
        },
        revocat: { label: '已撤销', value: ORDER_STATUS.REVOCAT, num: 0 },
        refund: { label: '已退款', value: ORDER_STATUS.REFUND, num: 0 },
        REPLENISH_WAIT: {
          label: '待处理',
          value: ORDER_STATUS.REPLENISH_WAIT,
          num: 0
        },
        FREEZE: {
          label: '已冻结',
          value: ORDER_STATUS.FREEZE,
          num: 0
        }
      },

      oprOrderId: ''
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
      if (this.searchForm.consignee_person) {
        data.consignee_person = this.searchForm.consignee_person
      }
      // 收货人手机号码
      if (this.searchForm.consignee_phone) {
        data.consignee_phone = this.searchForm.consignee_phone
      }
      // 商品名称
      if (this.searchForm.goods_name) {
        data.goods_name = this.searchForm.goods_name
      }
      // 订单id(编号)
      if (this.searchForm.order_id) {
        data.order_id = this.searchForm.order_id
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
        item.delivery_company_name = (item.delivery_info || {}).company_name || '-'

        return item
      })

      const statusStat = resp.data.status_stat || {}

      this.statusList.all.num = statusStat.all || 0
      this.statusList.audit_wait.num = statusStat[ORDER_STATUS.AUDIT_WAIT] || 0
      this.statusList.audit_faile.num = statusStat[ORDER_STATUS.AUDIT_FAIL] || 0
      this.statusList.delivery_wait.num = statusStat[ORDER_STATUS.DELIVERY_WAIT] || 0
      this.statusList.delivery_suc.num = statusStat[ORDER_STATUS.DELIVERY_SUC] || 0
      this.statusList.revocat.num = statusStat[ORDER_STATUS.REVOCAT] || 0
      this.statusList.refund.num = statusStat[ORDER_STATUS.REFUND] || 0
      this.statusList.REPLENISH_WAIT.num = statusStat[ORDER_STATUS.REPLENISH_WAIT] || 0
      this.statusList.FREEZE.num = statusStat[ORDER_STATUS.FREEZE] || 0
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
    handlerStatusCardClick(item) {
      this.searchForm.order_status = item.value
      this.getList()
    },
    goOrderinfo(id) {
      this.$router.push({
        path: '/manage-order/orderinfo',
        query: {
          orderid: id
        }
      })
    },
    // 撤销弹窗
    openUndoDialogTip(id) {
      this.oprOrderId = id
      this.$refs.undoDialogTip.show()
    },
    handlerUndoDialogClose() {
      this.oprOrderId = ''
    },
    async undoOrderOpr() {
      const data = {
        opr: 'cancel_order',
        order_id: this.oprOrderId
      }

      const resp = await orderSave(data)
      if (resp.ret !== 0) return
      this.$refs.undoDialogTip.hide()
      this.$slnotify({ message: '撤销成功' })
      this.getList()
      this.handlerUndoDialogClose()
    },

    // 删除订单
    openDeleteDialogTip(id) {
      this.oprOrderId = id
      this.$refs.deleteDialogTip.show()
    },
    handlerDeleteDialogClose() {
      this.oprOrderId = ''
    },
    async deleteOrderOpr() {
      const data = {
        opr: 'delete_order',
        order_id: this.oprOrderId
      }

      const resp = await orderSave(data)
      if (resp.ret !== 0) return
      this.$refs.deleteDialogTip.hide()
      this.$slnotify({ message: '删除成功' })
      this.getList()
      this.handlerDeleteDialogClose()
    },
    handlerEditBtnClick(id) {
      this.$router.push({ path: `/manage-order/tborderedit/${id}` })
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
.order-status-wrapper {
  // max-width: 1300px;
  .status-item {
    .status-text {
      height: 64px;
      min-width: 120px;
      font-size: 16px;
      color: #333;
      text-align: center;
      line-height: 64px;
      border-radius: 2px;
      background: #fff;
      margin-bottom: 20px;
      cursor: pointer;
      .status-num {
        color: #e33119;
      }
    }

    &.status-item--active {
      .status-text {
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

