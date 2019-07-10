<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="物流单状态" prop="status_txt" label-width="84px">
          <el-select v-model="searchForm.status_txt" placeholder="请选择">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="(item,key) in delivery_order_status_list"
              :key="key"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号" prop="order_id" label-width="70px">
          <el-input v-model.trim="searchForm.order_id" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone" label-width="70px">
          <el-input v-model.trim="searchForm.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="收货人" prop="person" label-width="70px">
          <el-input v-model.trim="searchForm.person" placeholder="请输入" />
        </el-form-item>
        <br>
        <el-form-item label="物流单号" prop="delivery_number" label-width="84px">
          <el-input v-model.trim="searchForm.delivery_number" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="材质" prop="goods_material" label-width="70px">
          <el-select v-model="searchForm.goods_material" placeholder="请选择">
            <el-option key="全部" label="全部" value />
            <el-option v-for="item in raw_material_list" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品种类" prop="type" label-width="70px">
          <el-select v-model="searchForm.type" placeholder="请选择">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in goodsTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
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
          <span>物流单列表</span>
        </div>
        <div class="add-button-group">
          <el-button class="goods-add btn-h-38" type="primary" @click="handlerDeliverSucClick">发货成功</el-button>
          <el-button
            v-if="multipleSelectionLength === 0"
            class="goods-add btn-h-38"
            type="primary"
            @click="handelrNoSelectExportClick"
          >导出</el-button>
          <a v-else :href="exportOrderListUrl" target="_black" style="margin-left: 10px;">
            <el-button class="goods-add btn-h-38" type="primary">导出</el-button>
          </a>
          <!-- target="_blank" -->
          <a :href="exportOrderAllUrl" target="_black">
            <el-button class="goods-add btn-h-38" type="primary">全部导出</el-button>
          </a>
          <el-button class="goods-add btn-h-38" type="primary" @click="handlerImportClick">导入</el-button>
          <input
            ref="uploadFile"
            style="display:none"
            type="file"
            accept=".xlsx"
            @change="uploadFile($event.target)"
          >
        </div>
      </div>

      <div class="table-content default-table-change">
        <!-- table-content start -->
        <el-table :data="list" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column prop="order_id" label="订单编号" min-width="60" />
          <el-table-column prop="type_liststr" label="商品种类" min-width="60" />
          <el-table-column prop="raw_material_liststr" label="材质" min-width="60" />
          <el-table-column prop="person" label="收货人" min-width="60" />
          <el-table-column prop="phone" label="手机号码" min-width="60" />
          <el-table-column prop="delivery_number" label="物流单号" min-width="60" />
          <el-table-column prop="create_time_txt" label="下单时间" min-width="60" />
          <el-table-column prop="order_status_txt" label="订单状态" min-width="60" />
          <el-table-column prop="status_txt" label="物流单状态" min-width="60" />
          <el-table-column prop="opr" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="goSearchOrderinfo(scope.row.order_id)">订单详情</el-button>
              <el-button type="text" @click="openChangeDelivery(scope.row)">修改物流单号</el-button>
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

    <change-deliverynum
      ref="changeDeliveryDialog"
      :delivery="curDialog"
      @close="handlerChangeDeliverClose"
      @on-success="handlerChagneDeliverSuccess"
    />
  </div>
</template>
<script>
import { deliveryOrderGet, deliveryOrderSave } from '@/api/api'
import { GOODS_TYPE, pickerOptions } from '@/config/cfg'
import ChangeDeliverynum from './ChangeDeliverynum'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  components: {
    ChangeDeliverynum
  },
  data() {
    return {
      token: window.Store.GetGlobalData('token'),
      base_url: process.env.VUE_APP_BASEURL,
      // search
      searchForm: {
        status_txt: '',            // 物流单状态('未导出', '成功导出', '成功导入', '导出失败', '导入失败', '作废')
        order_id: '',              // 订单id(编号)
        phone: '',                 // 手机号码
        person: '',                // 收货人
        goods_material: '',        // 材质
        type: '',                  // 商品种类
        create_time: '',
        delivery_number: '',       // 物流单号（发货的单号）
        // factory_id: '',            // 厂商id
        create_time_begin: 0,      // 创建时间（开始）（时间戳，秒）
        create_time_end: 0         // 创建时间（终止）（时间戳，秒）
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

      // statusList: ['未导出', '成功导出', '成功导入', '导出失败', '导入失败', '作废'],
      pickerOptions,
      goodsTypeOptions: [
        {
          value: GOODS_TYPE.DIY,
          label: GOODS_TYPE.toString(GOODS_TYPE.DIY)
        },
        {
          value: GOODS_TYPE.NORM,
          label: GOODS_TYPE.toString(GOODS_TYPE.NORM)
        },
        {
          value: GOODS_TYPE.GIFT,
          label: GOODS_TYPE.toString(GOODS_TYPE.GIFT)
        }
      ],
      curDialog: {}, // 打开弹窗处理的物流单
      exportOrderListUrl: ''
    }
  },
  computed: {
    ...mapState({
      delivery_order_status_list: state => state.user.delivery_order_status_list,
      raw_material_list: state => state.user.raw_material_list
    }),
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    },
    exportOrderAllUrl() {
      return `${this.base_url}/delivery_order_get.php?token=${this.token}&opr=export_delivery_order_list_all`
    },
    multipleSelectionLength() {
      return this.multipleSelection.length
    }

  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const data = {
        opr: 'get_delivery_order_list',
        page_no: this.listQuery.page
      }

      // 物流单状态
      if (this.searchForm.status_txt) {
        data.status_txt = this.searchForm.status_txt
      }
      // 订单id
      if (this.searchForm.order_id) {
        data.order_id = this.searchForm.order_id
      }
      // 手机号码
      if (this.searchForm.phone) {
        data.phone = this.searchForm.phone
      }
      // 收货人
      if (this.searchForm.person) {
        data.person = this.searchForm.person
      }
      // 材质
      if (this.searchForm.goods_material) {
        data.goods_material = this.searchForm.goods_material
      }
      // 商品种类
      if (this.searchForm.type) {
        data.type = this.searchForm.type
      }
      // 物流单号（发货的单号）
      if (this.searchForm.delivery_number) {
        data.delivery_number = this.searchForm.delivery_number
      }

      // 下单时间
      if (this.searchForm.create_time) {
        data.create_time_begin = parseInt(moment(this.searchForm.create_time[0]).format('X'))
        data.create_time_end = parseInt(moment(this.searchForm.create_time[1]).format('X'))
      }

      this.tableLoading = true

      console.log('物流单列表 req=>', data)
      const resp = await deliveryOrderGet(data)
      console.log('物流单列表 res=>', resp)

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

      const multipSelectId = this.multipleSelection.map(item => {
        return item.delivery_id
      })
      const encodeId = encodeURIComponent(multipSelectId)
      this.exportOrderListUrl = `${this.base_url}/delivery_order_get.php?token=${this.token}&opr=export_delivery_order_list&list=${encodeId}`
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
    openChangeDelivery(row) {
      this.curDialog = row
      this.$refs.changeDeliveryDialog.show()
    },
    handlerChangeDeliverClose() {
      this.curDialog = {}
    },
    handlerChagneDeliverSuccess() {
      this.getList()
    },
    handelrNoSelectExportClick() {
      this.$message.error('请选择需要导出的物流单')
    },
    async uploadFile(target) {
      if (target.files.length === 0) return

      const data = {
        opr: 'import_delivery_order',
        file: target.files[0]
      }

      console.log('导入文件 req=>', data)
      const resp = await deliveryOrderGet(data)
      console.log('导入文件 resp=>', resp)
      this.$refs.uploadFile.value = ''

      if (resp.ret !== 0) return

      const okNum = resp.data.ok_num
      const errNum = resp.data.err_num
      const idStr = (resp.data.err_order_id_list || []).join('，')

      const tipOptions = {
        title: '提示',
        message: `导入成功 <strong>${okNum}</strong> 条<br>`,
        dangerouslyUseHTMLString: true,
        type: 'info',
        duration: 0
      }

      if (errNum) {
        tipOptions.message = `导入成功 <strong>${okNum}</strong> 条<br> 导入出错 <strong>${errNum}</strong> 条<br> 导入出错订单 ${idStr}`
      }

      this.$notify(tipOptions)
    },
    handlerImportClick() {
      this.$refs.uploadFile.click()
    },
    goSearchOrderinfo(id) {
      this.$router.push({
        path: '/manage-order/searchorderinfo',
        query: {
          orderid: id
        }
      })
    },
    async handlerDeliverSucClick() {
      const delivery_id_list = this.multipleSelection.map(item => {
        return item.delivery_id
      })

      if (delivery_id_list.length === 0) {
        this.$notify({
          title: '警告',
          message: '请选择要批量操作的物流单',
          type: 'warning'
        })
        return
      }

      const data = {
        opr: 'batch_modify_delivery_status',
        delivery_id_list
      }

      console.log('订单批量发货成功 req=>', data)
      const resp = await deliveryOrderSave(data)
      console.log('订单批量发货成功 res=>', resp)

      if (resp.ret !== 0) return
      this.getList()
      this.$notify({
        title: '成功',
        message: '批量操作成功',
        type: 'success'
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
    width: 160px;
  }
  .el-select {
    width: 160px;
  }
}
.el-table {
  min-height: 400px;
  /deep/ td {
    padding: 4px 0;
  }
}
</style>

