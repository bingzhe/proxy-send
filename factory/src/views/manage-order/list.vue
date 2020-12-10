<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="订单状态" prop="order_status" label-width="70px">
          <el-select v-model="searchForm.order_status" placeholder="请选择" @change="getList">
            <el-option key="全部" label="全部" value />
            <el-option v-for="item in orderStausOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号" prop="order_id" label-width="70px">
          <el-input v-model.trim="searchForm.order_id" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="收货人手机" prop="consignee_phone" label-width="85px">
          <el-input v-model.trim="searchForm.consignee_phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="收货人姓名" prop="consignee_person" label-width="85px">
          <el-input v-model.trim="searchForm.consignee_person" placeholder="请输入" />
        </el-form-item>
        <br />
        <el-form-item label="商户名" prop="business_name" label-width="70px">
          <el-input v-model.trim="searchForm.business_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="商品名称" prop="goods_name" label-width="70px">
          <el-input v-model.trim="searchForm.goods_name" placeholder="请输入" />
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

    <div v-loading="tableLoading" element-loading-text="拼命加载中" class="table-wrapper table-wrapper-default">
      <div class="table-title clearfix">
        <div class="table-title__lable">
          <span>
            <i class="el-icon-goods" />
          </span>
          <span>订单审核列表</span>
        </div>
        <div class="add-button-group">
          <el-button class="goods-add btn-h-38" type="primary" @click="handleToggleFreeze">冻结/解冻</el-button>
          <el-button class="goods-add btn-h-38" type="primary" @click="handleOpenSelectIdAuditDialog">审核</el-button>
          <el-button class="goods-add btn-h-38" type="primary" @click="handleOpenQueryOrderAuditDialog">全部审核</el-button>

          <!-- <el-button class="goods-add btn-h-38" type="primary" @click="handlerMuAuditClick"
            >审核通过</el-button
          > -->
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
          <el-table-column prop="opr" label="操作" min-width="60">
            <template slot-scope="scope">
              <el-button v-if="ORDER_STATUS.ERROR === scope.row.order_status" type="text" @click="handleErrorOrder(scope.row.order_id)">处理</el-button>
              <el-button v-if="ORDER_STATUS.ERROR === scope.row.order_status" type="text" class="btn-red" @click="handleDelErrorDialog(scope.row.order_id)">删除</el-button>
              <el-button v-if="ORDER_STATUS.ERROR !== scope.row.order_status" type="text" @click="goOrderinfo(scope.row.order_id)">{{
                ORDER_STATUS.AUDIT_WAIT === scope.row.order_status ? '审单' : '重新审单'
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- table-content end -->

        <!-- 分页 start -->
        <div class="pagination-wrapper clearfix">
          <div class="pagination-total">
            <span>
              共
              <span class="num-text"> {{ pageTotal }}</span>页/ <span class="num-text">{{ total }}</span>条数据
            </span>
          </div>
          <!-- :page-sizes="[10, 20, 40]" -->
          <el-pagination
            class="sl-pagination"
            :current-page.sync="listQuery.page"
            :page-size="audit_list_page_limit"
            layout="prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <!-- 分页 end -->
      </div>
    </div>

    <!-- 冻结/解冻弹窗 -->
    <sl-dialog ref="freezeDialog" class="freeze-dialog" :validate="true" title="冻结/解冻订单" @close="handleFreezeDialogClose" @confirm="handleFreezeDialogConfirm">
      <el-form ref="freezeDialogForm" :model="freezeDialogForm" :rules="freezeDialogFormRules" label-width="130px">
        <el-form-item label="操作" prop="freeze">
          <el-radio v-model="freezeDialogForm.freeze" :label="1">冻结</el-radio>
          <el-radio v-model="freezeDialogForm.freeze" :label="0">解冻</el-radio>
        </el-form-item>
        <el-form-item label="原因" prop="remark">
          <el-input v-model="freezeDialogForm.remark" :rows="3" type="textarea" placeholder="请输入" maxlength="150" show-word-limit />
        </el-form-item>
      </el-form>
    </sl-dialog>

    <!-- 选择订单审核 -->
    <sl-dialog ref="selectIdAuditDialog" class="freeze-dialog" :validate="true" title="审核" @close="handleSelectIdAuditDialogClose" @confirm="handleSelectIdAuditeDialogConfirm">
      <el-form ref="selectIdAuditForm" :model="selectIdAuditForm" :rules="selectIdAuditFormRules" label-width="130px">
        <el-form-item label="操作" prop="pass">
          <el-radio v-model="selectIdAuditForm.pass" :label="1">审核通过</el-radio>
          <el-radio v-model="selectIdAuditForm.pass" :label="0">审核不通过</el-radio>
        </el-form-item>
        <el-form-item label="原因" prop="remark">
          <el-input v-model="selectIdAuditForm.remark" :rows="3" type="textarea" placeholder="请输入" maxlength="150" show-word-limit />
        </el-form-item>
      </el-form>
    </sl-dialog>

    <!-- 查询出来的订单审核 -->
    <sl-dialog ref="queryOrderAuditDialog" class="freeze-dialog" :validate="true" title="查询订单审核" @close="handleQueryOrderAuditDialogClose" @confirm="handleQueryOrderAuditeDialogConfirm">
      <el-form ref="queryOrderAuditForm" :model="queryOrderAuditForm" :rules="queryOrderAuditFormRules" label-width="130px">
        <el-form-item label="操作" prop="pass">
          <el-radio v-model="queryOrderAuditForm.pass" :label="1">审核通过</el-radio>
          <el-radio v-model="queryOrderAuditForm.pass" :label="0">审核不通过</el-radio>
        </el-form-item>
        <el-form-item label="原因" prop="remark">
          <el-input v-model="queryOrderAuditForm.remark" :rows="3" type="textarea" placeholder="请输入" maxlength="150" show-word-limit />
        </el-form-item>
      </el-form>
    </sl-dialog>

    <!-- 处理异常订单 -->
    <sl-dialog ref="handleErrorDialog" title="异常订单处理" width="650px" confirmText="立即处理" @close="handleErrorDialogClose" @confirm="handleErrorDialogConfirm">
      <div class="error-dialog-item">
        <div class="label">订单号</div>
        <div class="value">{{ handle_orderid }}</div>
      </div>
      <div class="error-dialog-item">
        <div class="label">异常说明</div>
        <div class="value">{{ exception_remark }}</div>
      </div>
    </sl-dialog>
  </div>
</template>
<script>
import { orderGet, orderSave } from '@/api/api'
import moment from 'moment'
import { ORDER_STATUS, pickerOptions } from '@/config/cfg'
import SlDialog from '@/components/Dialog/Dialog'
import { mapState } from 'vuex'

export default {
  components: {
    SlDialog
  },
  data() {
    return {
      // search
      searchForm: {
        order_status: '', // 订单状态(1:待审核,2:审核未通过,3:待发货,4:已发货,5:已撤销,6:已退款)
        order_id: '', // 订单id(编号)
        consignee_phone: '', // 收货人手机号码
        business_name: '', // 商户名称
        // salesman: '',              // 业务员(跟单人)
        goods_name: '', // 商品名称
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
          label: ORDER_STATUS.toString(ORDER_STATUS.FREEZE),
          value: ORDER_STATUS.FREEZE
        },
        {
          label: ORDER_STATUS.toString(ORDER_STATUS.ERROR),
          value: ORDER_STATUS.ERROR
        }
        // {
        //   label: '已通过',
        //   value: ORDER_STATUS.DELIVERY_WAIT
        // }
      ],
      ORDER_STATUS,
      pickerOptions,

      freezeDialogForm: {
        freeze: '', // 1:冻结, 0:解冻（必选）
        remark: '' // 操作说明（可以为空）
      },
      freezeDialogFormRules: {
        freeze: [{ required: true, message: '请选择操作' }]
      },

      selectIdAuditForm: {
        pass: '', // 结论(1:审核通过, 0:不通过)
        remark: '' // 原因(不通过时说明原因)
      },
      selectIdAuditFormRules: {
        pass: [{ required: true, message: '请选择操作' }]
      },

      queryOrderAuditForm: {
        pass: '', // 结论(1:审核通过, 0:不通过)
        remark: '' // 原因(不通过时说明原因)
      },

      queryOrderAuditFormRules: {
        pass: [{ required: true, message: '请选择操作' }]
      },

      exception_remark: '',
      handle_orderid: ''
    }
  },
  computed: {
    ...mapState({
      audit_list_page_limit: (state) => state.user.audit_list_page_limit
    }),
    pageTotal() {
      return Math.ceil(this.total / this.audit_list_page_limit)
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
        opr: 'get_audit_order_list',
        page_no: this.listQuery.page,
        page_size: this.audit_list_page_limit
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
      if (this.searchForm.goods_name) {
        data.goods_name = this.searchForm.goods_name
      }
      if (this.searchForm.consignee_person) {
        data.consignee_person = this.searchForm.consignee_person
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

        return item
      })
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.audit_list_page_limit = val
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
    goOrderinfo(id) {
      this.$router.push({
        path: '/manage-order/orderinfo',
        query: {
          orderid: id
        }
      })
    },
    /**
     * 批量审核通过
     */
    // async handlerMuAuditClick() {
    //   const order_id_list = this.multipleSelection.map((item) => {
    //     return item.order_id
    //   })

    //   if (order_id_list.length === 0) {
    //     this.$notify({
    //       title: '警告',
    //       message: '请选择要批量操作的订单',
    //       type: 'warning'
    //     })
    //     return
    //   }

    //   const data = {
    //     opr: 'batch_order_audit',
    //     order_id_list
    //   }

    //   console.log('订单批量审核 req=>', data)
    //   const resp = await orderSave(data)
    //   console.log('订单批量审核 res=>', resp)

    //   if (resp.ret !== 0) return
    //   this.getList()
    //   this.$notify({
    //     title: '成功',
    //     message: '批量操作成功',
    //     type: 'success'
    //   })
    // },

    /**
     * 批量冻结解冻
     */

    async handleToggleFreeze() {
      const order_id_list = this.multipleSelection.map((item) => {
        return item.order_id
      })

      if (order_id_list.length === 0) {
        this.$notify({
          title: '警告',
          message: '请选择要批量操作的订单',
          type: 'warning'
        })
        return
      }

      this.$refs.freezeDialog.show()
    },

    handleFreezeDialogClose() {
      this.$refs.freezeDialogForm.resetFields()
    },
    handleFreezeDialogConfirm() {
      const order_id_list = this.multipleSelection.map((item) => {
        return item.order_id
      })

      this.$refs.freezeDialogForm.validate(async(valid) => {
        if (valid) {
          const data = {
            opr: 'batch_order_freeze',
            order_id_list: order_id_list,
            freeze: this.freezeDialogForm.freeze, // 1:冻结, 0:解冻（必选）
            remark: this.freezeDialogForm.remark // 操作说明（可以为空）
          }

          console.log('冻结', data)
          const resp = await orderSave(data)

          if (resp.ret !== 0) return

          this.$refs.freezeDialog.hide()
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        }
      })
    },

    handleOpenSelectIdAuditDialog() {
      const order_id_list = this.multipleSelection.map((item) => {
        return item.order_id
      })

      if (order_id_list.length === 0) {
        this.$notify({
          title: '警告',
          message: '请选择要批量操作的订单',
          type: 'warning'
        })
        return
      }

      this.$refs.selectIdAuditDialog.show()
    },

    handleSelectIdAuditDialogClose() {
      this.$refs.selectIdAuditForm.resetFields()
    },

    handleSelectIdAuditeDialogConfirm() {
      const order_id_list = this.multipleSelection.map((item) => {
        return item.order_id
      })

      this.$refs.selectIdAuditForm.validate(async(valid) => {
        if (valid) {
          const data = {
            opr: 'batch_order_audit',
            order_id_list: order_id_list,
            pass: this.selectIdAuditForm.pass,
            remark: this.selectIdAuditForm.remark // 操作说明（可以为空）
          }

          console.log('选择订单批量审核', data)
          const resp = await orderSave(data)

          if (resp.ret !== 0) return

          this.$refs.selectIdAuditDialog.hide()
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    handleOpenQueryOrderAuditDialog() {
      this.$refs.queryOrderAuditDialog.show()
    },
    handleQueryOrderAuditDialogClose() {
      this.$refs.queryOrderAuditForm.resetFields()
    },
    handleQueryOrderAuditeDialogConfirm() {
      this.$refs.queryOrderAuditForm.validate(async(valid) => {
        if (valid) {
          const query = {}

          // 订单状态
          if (this.searchForm.order_status) {
            query.order_status = this.searchForm.order_status
          }
          // 订单id(编号)
          if (this.searchForm.order_id) {
            query.order_id = this.searchForm.order_id
          }
          // 收货人手机号码
          if (this.searchForm.consignee_phone) {
            query.consignee_phone = this.searchForm.consignee_phone
          }
          // 商户名称
          if (this.searchForm.business_name) {
            query.business_name = this.searchForm.business_name
          }
          if (this.searchForm.goods_name) {
            query.goods_name = this.searchForm.goods_name
          }
          if (this.searchForm.consignee_person) {
            query.consignee_person = this.searchForm.consignee_person
          }
          // 下单时间
          if (this.searchForm.order_time) {
            query.order_time_begin = parseInt(moment(this.searchForm.order_time[0]).format('X'))
            query.order_time_end = parseInt(moment(this.searchForm.order_time[1]).format('X'))
          }

          const data = {
            opr: 'all_order_audit',
            query,
            pass: this.queryOrderAuditForm.pass,
            remark: this.queryOrderAuditForm.remark // 操作说明（可以为空）
          }

          console.log('操作查询出来的订单', data)

          const resp = await orderSave(data)

          if (resp.ret !== 0) return

          this.$refs.queryOrderAuditDialog.hide()
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    async handleErrorOrder(id) {
      this.handle_orderid = id

      const data = {
        opr: 'get_order_exception_info',
        order_id: id // 订单id
      }
      console.log('取订单异常信息 req=>', data)
      const resp = await orderGet(data)
      console.log('取订单异常信息 res=>', resp)

      if (resp.ret !== 0) return

      this.exception_remark = resp.data.exception_remark
      this.$refs.handleErrorDialog.show()
      // exception_remark: "",   // 异常说明
    },
    handleErrorDialogClose() {
      this.handle_orderid = ''
      this.exception_remark = ''
    },
    async handleErrorDialogConfirm() {
      const data = {
        opr: 'order_retry_save',
        order_id: this.handle_orderid // 订单id（注：其它参数会从后台取）
      }

      const resp = await orderSave(data)

      if (resp.ret === 0) {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        })
        this.handleErrorDialogClose()
        this.getList()
      } else {
        this.exception_remark = (resp.data || {}).exception_remark
      }
    },
    handleDelErrorDialog(id) {
      this.$confirm('确认要删除订单', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const data = {
            opr: 'delete_order',
            order_id: id // 订单id
          }
          const resp = await orderSave(data)
          if (resp.ret !== 0) return
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        })
        .catch(() => {})
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
.freeze-dialog {
  /deep/ .el-textarea {
    width: 450px;
  }
}
.btn-red {
  color: #e33119;
}
.error-dialog-item {
  display: flex;
  font-size: 16px;
  margin: 0 0 15px 30px;
  .label {
    flex-basis: 90px;
    flex-shrink: 0;
    width: 90px;
  }
}
</style>
