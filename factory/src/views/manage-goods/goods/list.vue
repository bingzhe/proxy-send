<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="材质" prop="goods_material" label-width="70px">
          <el-select
            v-model="searchForm.goods_material"
            placeholder="请选择"
            @change="getGoodsList"
          >
            <el-option key="全部" label="全部" value />
            <el-option v-for="item in raw_material_list" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品种类" prop="type" label-width="70px">
          <el-select v-model="searchForm.type" placeholder="请选择" @change="getGoodsList">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in goodsTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brand" label-width="70px">
          <el-select v-model="searchForm.brand" placeholder="请选择" @change="getGoodsList">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in phone_brand_list"
              :key="item.brand_id"
              :label="item.brand_name"
              :value="item.brand_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="model" label-width="70px">
          <el-select
            v-model="searchForm.model"
            filterable
            placeholder="请选择"
            @change="getGoodsList"
          >
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in model_list"
              :key="item.model_id"
              :label="item.model_name"
              :value="item.model_id"
            />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="商品名称" prop="goods_name" label-width="70px">
          <el-input v-model.trim="searchForm.goods_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="商品编号" prop="goods_id" label-width="70px">
          <el-input v-model.trim="searchForm.goods_id" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="库存量" prop="goods_stock_type" label-width="70px">
          <el-select
            v-model="searchForm.goods_stock_type"
            class="goods-stock-type"
            placeholder="请选择"
          >
            <el-option key="全部" label="全部" value />
            <el-option key="more" label="大于等于" value="more" />
            <el-option key="less" label="小于等于" value="less" />
          </el-select>
        </el-form-item>
        <el-form-item prop="goods_stock">
          <el-input
            v-model.trim="searchForm.goods_stock"
            v-limit-input-number="searchForm.goods_stock"
            class="goods-stock"
            placeholder="请输入"
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
          <el-button
            class="goods-add btn-h-38"
            type="primary"
            @click="handleUploadGoodsClick"
          >导入商品</el-button>
          <el-button class="goods-add btn-h-38" type="primary" @click="handleExportGoodsClick">导出商品</el-button>
          <router-link to="/manage-goods/goods/edit">
            <el-button class="goods-add btn-h-38" type="primary">新增商品</el-button>
          </router-link>
        </div>
      </div>

      <div class="table-content default-table-change">
        <!-- table-content start -->
        <el-table :data="list" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />

          <el-table-column prop="goods_id" label="商品编号" min-width="60" />
          <el-table-column prop="goods_name" label="商品名称" min-width="80" />
          <el-table-column prop="raw_material" label="材质" min-width="60" />
          <el-table-column prop="brand_txt" label="品牌" min-width="60" />
          <el-table-column prop="model_txt" label="型号" min-width="80" />
          <el-table-column prop="sku_list_str" label="sku" min-width="80" />
          <el-table-column prop="type_txt" label="商品种类" min-width="60" />
          <el-table-column prop="inventory" label="库存" min-width="60" />
          <el-table-column prop="status_str" label="状态" min-width="60" />
          <el-table-column prop="opr" label="操作" width="160" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status === GOODS_STATUS.OFF"
                class="btn-green"
                type="text"
                @click="handlerOnOffClick(scope.row.goods_id, 'on')"
              >上架</el-button>
              <el-button
                v-if="scope.row.status === GOODS_STATUS.ON"
                class="btn-green"
                type="text"
                @click="handlerOnOffClick(scope.row.goods_id, 'off')"
              >下架</el-button>
              <el-button
                type="text"
                @click="handlerEditBtnClick(scope.row.goods_id)"
              >编辑</el-button>
              <el-button
                class="btn-red"
                type="text"
                @click="handlerDeleteBtnClick(scope.row.goods_id)"
              >删除</el-button>
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

    <GoodsExeclUploadDialog ref="goodsExeclUploadDialog" @close-dialog="handleExeclUploadClose" />
    <GoodsExportDialog ref="goodsExportDialog" :searchForm="searchForm" />
  </div>
</template>
<script>
import { GOODS_TYPE, GOODS_STATUS } from '@/config/cfg'
import { goodsSave, goodsGet } from '@/api/api'
import { mapState } from 'vuex'
import GoodsExeclUploadDialog from './GoodsExeclUploadDialog'
import GoodsExportDialog from './GoodsExportDialog'

export default {
  components: {
    GoodsExeclUploadDialog,
    GoodsExportDialog
  },
  data() {
    return {
      // search
      searchForm: {
        goods_material: '', // 材质
        type: '', // 商品种类
        brand: '', // 品牌
        model: '', // 型号
        goods_name: '', // 商品名称
        goods_id: '', // 商品编号
        goods_stock_type: '', // 库存类型   （1.大于等于：more 2.小于等于：less）
        goods_stock: '' // 商品库存
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
      GOODS_STATUS
    }
  },
  computed: {
    ...mapState({
      phone_brand_list: (state) => state.user.phone_brand_list,
      model_list: (state) => state.user.model_list,
      raw_material_list: (state) => state.user.raw_material_list
    }),
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  mounted() {
    this.getGoodsList()
    document.addEventListener('keydown', this.handleKeydownEvent, false)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeydownEvent, false)
  },
  methods: {
    async getGoodsList() {
      const data = {
        opr: 'get_goods_list',
        page_no: this.listQuery.page
      }
      // 材质
      if (this.searchForm.goods_material) {
        data.raw_material = this.searchForm.goods_material
      }
      // 商品种类
      if (this.searchForm.type) {
        data.type = this.searchForm.type
      }
      // 品牌
      if (this.searchForm.brand) {
        data.brand = this.searchForm.brand
      }
      // 型号
      if (this.searchForm.model) {
        data.model = this.searchForm.model
      }
      // 商品名称
      if (this.searchForm.goods_name) {
        data.goods_name = this.searchForm.goods_name
      }
      // 商品编号
      if (this.searchForm.goods_id) {
        data.goods_id = this.searchForm.goods_id
      }
      // 商品库存 查找
      if (this.searchForm.goods_stock_type === 'more') {
        data.inventory_gte = this.searchForm.goods_stock
      } else if (this.searchForm.goods_stock_type === 'less') {
        data.inventory_lte = this.searchForm.goods_stock
      }

      this.tableLoading = true

      console.log('商品列表 req=>', data)
      const resp = await goodsGet(data)
      console.log('商品列表 res=>', resp)

      if (resp.ret !== 0) return

      this.list = resp.data.list
      this.total = resp.data.total

      this.list = this.list.map((goods) => {
        goods.status = goods.status || 2
        goods.status_str = GOODS_STATUS.toString(goods.status)

        return goods
      })
      this.tableLoading = false
    },
    handlerSearchClick() {
      this.listQuery.page = 1
      this.getGoodsList()
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getGoodsList()
    },
    handlerEditBtnClick(id) {
      this.$router.push({
        path: '/manage-goods/goods/edit',
        query: {
          goodsid: id
        }
      })
    },
    handlerDeleteBtnClick(id) {
      this.$confirm('确认要删除选中商品？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          this.delOpr(id)
        })
        .catch(() => {})
    },
    async delOpr(id) {
      const data = {
        opr: 'delete_goods',
        goods_id: id
      }

      const resp = await goodsSave(data)
      if (resp.ret !== 0) return
      this.getGoodsList()
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success'
      })
    },
    async handlerOnOffClick(id, type) {
      const data = {
        opr: 'save_goods_status',
        goods_id: id // 商品编号(ID)
        // status          : 2,            // 状态(1:未上架, 2:已上架)
      }
      if (type === 'on') {
        data.status = 2
      } else if (type === 'off') {
        data.status = 1
      }
      const resp = await goodsSave(data)
      if (resp.ret !== 0) return
      this.getGoodsList()
      this.$notify({
        title: '成功',
        message: type === 'on' ? '上架成功' : '下架成功',
        type: 'success'
      })
    },
    handleUploadGoodsClick() {
      this.$refs.goodsExeclUploadDialog.show()
    },
    handleExeclUploadClose() {
      this.getGoodsList()
    },
    handleKeydownEvent(e) {
      if (e.keyCode === 13) {
        this.getGoodsList()
      }
    },
    handleExportGoodsClick() {
      this.$refs.goodsExportDialog.show()
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
  .goods-stock.el-input {
    width: 120px;
  }
  .goods-stock-type.el-select {
    width: 120px;
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

.el-button.btn-h-38{
  margin-left: 0;
}
</style>
