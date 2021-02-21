<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="材质" prop="goods_material" label-width="70px">
          <el-select v-model="searchForm.goods_material" placeholder="请选择" @change="getGoodsList">
            <el-option key="全部" label="全部" value />
            <el-option v-for="item in raw_material_list" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brand" label-width="70px">
          <el-select v-model="searchForm.brand" placeholder="请选择" @change="getGoodsList">
            <el-option key="全部" label="全部" value />
            <el-option v-for="item in phone_brand_list" :key="item.brand_id" :label="item.brand_name" :value="item.brand_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type" label-width="70px">
          <el-select v-model="searchForm.type" placeholder="请选择" @change="getGoodsList">
            <el-option key="全部" label="全部" value />
            <el-option v-for="item in goodsTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="型号" prop="model" label-width="70px">
          <el-input v-model.trim="searchForm.model" placeholder="请输入" />
        </el-form-item>
        <br />
        <el-form-item label="商品名称" prop="goods_name" label-width="70px">
          <el-input v-model.trim="searchForm.goods_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="商品编号" prop="goods_id" label-width="70px">
          <el-input v-model.trim="searchForm.goods_id" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="颜色" prop="color_name" label-width="70px">
          <el-input v-model.trim="searchForm.color_name" placeholder="请输入" />
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
          <span>商品列表</span>
        </div>
        <div class="add-button-group">
          <el-button class="goods-add btn-h-38" type="primary" @click="handleCheckGoodsClick">检查商品</el-button>
          <el-button class="goods-add btn-h-38" type="primary" @click="handleExportGoodsClick">导出商品</el-button>
        </div>
      </div>

      <div class="table-content default-table-change">
        <!-- table-content start -->
        <el-table :data="list" stripe @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" align="center" width="55" /> -->
          <el-table-column prop="goods_id" label="序号" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="商品编号" min-width="40" />
          <el-table-column prop="goods_name" label="商品名称" min-width="80" />
          <!-- <el-table-column prop="raw_material" label="材质" min-width="60" />
          <el-table-column prop="brand_txt" label="品牌" min-width="60" />
          <el-table-column prop="model_txt" label="型号" min-width="80" /> -->
          <el-table-column prop="sku_list_str" label="sku" min-width="80" />
          <el-table-column prop="type_txt" label="类型" min-width="30" />
          <el-table-column prop="opr" label="操作" min-width="40">
            <template slot-scope="scope">
              <el-button type="text" @click="handlerOrderBtnClick(scope.row)">下单</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- table-content end -->

        <!-- 分页 start -->
        <div class="pagination-wrapper clearfix">
          <div class="pagination-total">
            <span>
              共
              <span class="num-text">{{ pageTotal }}</span
              >页/ <span class="num-text">{{ total }}</span
              >条数据
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
    <GoodsExportDialog ref="goodsExportDialog" :searchForm="searchForm" />
    <CheckGoodsDialog ref="checkGoodsDialog" />
  </div>
</template>
<script>
import { GOODS_TYPE, GOODS_STATUS } from '@/config/cfg'
import { goodsGet, buycartSave } from '@/api/api'
import { mapState } from 'vuex'
import GoodsExportDialog from './components/GoodsExportDialog'
import CheckGoodsDialog from './components/CheckGoodsDialog'

export default {
  components: {
    GoodsExportDialog,
    CheckGoodsDialog
  },
  data() {
    return {
      // search
      searchForm: {
        goods_material: '', // 材质
        type: '', // 类型
        brand: '', // 品牌
        model: '', // 型号
        goods_name: '', // 商品名称
        goods_id: '', // 商品编号
        color_name: ''
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
        { value: GOODS_TYPE.DIY, label: GOODS_TYPE.toString(GOODS_TYPE.DIY) },
        { value: GOODS_TYPE.NORM, label: GOODS_TYPE.toString(GOODS_TYPE.NORM) },
        { value: GOODS_TYPE.GIFT, label: GOODS_TYPE.toString(GOODS_TYPE.GIFT) }
      ],
      GOODS_STATUS
    }
  },
  computed: {
    ...mapState({
      phone_brand_list: (state) => state.user.phone_brand_list,
      model_list: (state) => state.user.model_list,
      raw_material_list: (state) => state.user.raw_material_list,
      orderIsEdit: (state) => state.orderEdit.isEdit,
      buycart_id: (state) => state.user.buycart_id
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
    handleKeydownEvent(e) {
      if (e.keyCode === 13) {
        this.getGoodsList()
      }
    },
    async getGoodsList() {
      const data = {
        opr: 'get_goods_list',
        page_no: this.listQuery.page,
        from: 'buycart'
      }
      // 材质
      if (this.searchForm.goods_material) {
        data.raw_material = this.searchForm.goods_material
      }
      // 类型
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

      // 商品编号
      if (this.searchForm.color_name) {
        data.color_name = this.searchForm.color_name
      }

      this.tableLoading = true

      // console.log('商品列表 req=>', data)
      const resp = await goodsGet(data)
      // console.log('商品列表 res=>', resp)

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
    handlerOrderBtnClick(row) {
      const goodsType = row.type
      const goodsId = row.goods_id
      // const source = this.$route.query.source

      /**
       * source 区分是不是淘宝订单需要添加商品
       */
      if (this.orderIsEdit) {
        if (goodsType === GOODS_TYPE.DIY) {
          this.$router.push({ path: `/manage-goods/tbdiy/${goodsId}` })
        } else if (goodsType === GOODS_TYPE.NORM) {
          this.$router.push({ path: `/manage-goods/tbnorm/${goodsId}` })
        }
      } else {
        if (goodsType === GOODS_TYPE.DIY) {
          // this.$router.push({ path: `/manage-goods/diy/${goodsId}` })
          this.handleDiySelect(row)
        } else if (goodsType === GOODS_TYPE.NORM) {
          // this.$router.push({ path: `/manage-goods/norm/${goodsId}` })
          this.handleNormSelect(row)
        }
      }
    },
    handleExportGoodsClick() {
      this.$refs.goodsExportDialog.show()
    },
    handleCheckGoodsClick() {
      this.$refs.checkGoodsDialog.show()
    },
    async handleDiySelect(row) {
      const data = {
        opr: 'put_to_buycart_diy', // diy品加入购物车
        goods_id: row.goods_id, // 商品编号(ID)
        num: 1 // 订购数量
      }
      if (this.buycart_id) {
        data.buycart_id = this.buycart_id // 购物车id（值为空时是新购物车）
      }

      // console.log('diy加入购物车 req', data)
      await buycartSave(data)
      this.$router.push({ path: `/manage-goods/shopcart` })
    },
    async handleNormSelect(row) {
      const color_name = (row.opt_color_list || [])[0].color_name

      const data = {
        opr: 'put_to_buycart_standard',
        goods_id: row.goods_id, // 商品编号(ID)
        num: 1, // 订购数量
        color: color_name // 颜色分类("红色"、"绿色"...)
      }

      if (this.buycart_id) {
        data.buycart_id = this.buycart_id
      }

      // console.log('标品加入购物车 req', data)
      await buycartSave(data)
      // console.log('标品加入购物车 res', resp)
      this.$router.push({ path: `/manage-goods/shopcart` })
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
</style>

