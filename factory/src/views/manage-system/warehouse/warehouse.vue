<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="仓库ID" prop="warehouse_id" label-width="70px">
          <el-input v-model.trim="searchForm.warehouse_id" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouse_name" label-width="70px">
          <el-input v-model.trim="searchForm.warehouse_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button class="btn-h-38" type="primary" @click="handlerSearchClick">查询</el-button>
        </el-form-item>
      </el-form>
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
            <span>仓库列表</span>
          </div>
          <div class="add-button-group">
            <el-button
              class="goods-add btn-h-38"
              type="primary"
              @click="handleAddWarehouseClick"
            >新增仓库</el-button>
          </div>
        </div>

        <div class="table-content default-table-change">
          <!-- table-content start -->
          <el-table :data="list" stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column prop="warehouse_id" label="仓库ID" min-width="60" />
            <el-table-column prop="warehouse_name" label="仓库名称" min-width="60" />
            <el-table-column prop="cityText" label="仓库位置" min-width="60" />
            <el-table-column prop="address" label="地址" min-width="60" />
            <el-table-column prop="sendCityText" label="可城市发货" min-width="100" />
            <el-table-column prop="opr" label="操作" min-width="60" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="handleWarehouseEditClick(scope.row)">编辑</el-button>
                <el-button class="btn-red" type="text" @click="handleDelClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- table-content end -->

          <!-- 分页 start -->
          <div class="pagination-wrapper clearfix">
            <div class="pagination-total">
              <span>
                共
                <span class="num-text">{{ total }}</span>条数据
              </span>
            </div>
          </div>
          <!-- 分页 end -->
        </div>
      </div>
    </div>
    <WarehouseEdit
      ref="warehouseEdit"
      :warehouse_id="editWarehouseId"
      :regionList="regionList"
      :areaMap="areaMap"
      @on-close="handleWarehouseEditClose"
      @on-success="getWarehouseList"
    />
  </div>
</template>

<script>
import { warehouseGet, regionGet } from '@/api/api'
import WarehouseEdit from './WarehouseEdit'

export default {
  components: {
    WarehouseEdit
  },
  data() {
    return {
      searchForm: {
        warehouse_id: '', // 仓库ID
        warehouse_name: '' // 仓库名称
      },

      list: [],
      tableLoading: false,
      // 分页
      total: 100, // 分页总条数
      listQuery: {
        page: 1,
        limit: 20
      },

      editWarehouseId: '', // 编辑的仓库id

      regionList: [
        {
          value: '1',
          label: '广东省',
          children: [
            { value: '11', label: '广州市' },
            { value: '12', label: '深圳市' }
          ]
        },
        {
          value: '2',
          label: '陕西省',
          children: [
            { value: '21', label: '西安市' },
            { value: '22', label: '宝鸡市' }
          ]
        }
      ],
      areaMap: {}
    }
  },
  computed: {},
  async mounted() {
    await this.getRegionGet()
    await this.getWarehouseList()
    document.addEventListener('keydown', this.handleKeydownEvent, false)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeydownEvent, false)
  },
  methods: {
    handleKeydownEvent(e) {
      if (e.keyCode === 13) {
        this.getWarehouseList()
      }
    },
    async getWarehouseList() {
      const data = {
        opr: 'get_warehouse_list',
        page_no: this.listQuery.page
      }
      // 仓库ID
      if (this.searchForm.warehouse_id) {
        data.warehouse_id = this.searchForm.warehouse_id
      }
      //  仓库名称
      if (this.searchForm.warehouse_name) {
        data.warehouse_name = this.searchForm.warehouse_name
      }
      this.tableLoading = true

      console.log('仓库列表 req=>', data)
      const resp = await warehouseGet(data)
      console.log('仓库列表 res=>', resp)

      if (resp.ret !== 0) return
      this.tableLoading = false

      this.list = resp.data.list || []
      this.total = this.list.length

      this.list = this.list.map((item) => {
        item.sendCityText = (item.send_area_list || [])
          .map((city) => (this.areaMap[city] || {}).label)
          .join('，')
        item.cityText = (this.areaMap[item.city] || {}).label
        return item
      })
    },
    handlerSearchClick() {
      this.listQuery.page = 1
      this.getWarehouseList()
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleAddWarehouseClick() {
      this.$refs.warehouseEdit.show()
    },
    handleWarehouseEditClick(row) {
      this.editWarehouseId = row.warehouse_id
      this.$refs.warehouseEdit.show()
    },
    handleWarehouseEditClose() {
      this.editWarehouseId = ''
    },
    handleDelClick(row) {
      const warehouse_id = row.warehouse_id
      this.$confirm('确认要删除选中仓库？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          this.delOpr(warehouse_id)
        })
        .catch(() => {})
    },
    async delOpr(id) {
      const data = {
        opr: 'del',
        warehouse_id: id
      }

      console.log('删除操作 req=>', data)
      // const resp = await warehouseSave(data)
      // if (resp.ret !== 0) return
      // this.getWarehouseList()
      // this.$notify({
      //   title: '成功',
      //   message: '删除成功',
      //   type: 'success'
      // })
    },
    async getRegionGet() {
      const resp = await regionGet({ opr: 'get_region_list' })
      console.log(resp)

      this.areaMap = resp.data.area_map
      this.regionList = (resp.data.list || []).map((province) => {
        province.children = (province.children || []).map((city) => {
          const item = {
            value: city.value,
            label: city.label,
            parent: city.parent
          }
          return item
        })
        return province
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
.btn-green {
  color: #1a9901;
}
.btn-red {
  color: #e33119;
}
</style>
