<template>
  <div class="goodslist-search-wrapper">
    <div class="table-wrapper table-wrapper-default">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <!-- <el-form-item label="材质" prop="goods_material" label-width="45px">
          <el-select v-model="searchForm.goods_material" clearable placeholder="请选择" @change="getGoodsList">
            <el-option key="全部" label="全部" value />
            <el-option v-for="item in raw_material_list" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="品牌" prop="brand" label-width="45px">
          <el-select v-model="searchForm.brand" clearable placeholder="请选择" @change="getGoodsList">
            <el-option key="全部" label="全部" value />
            <el-option v-for="item in phone_brand_list" :key="item.brand_id" :label="item.brand_name" :value="item.brand_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type" label-width="45px">
          <el-select v-model="searchForm.type" clearable placeholder="请选择" @change="getGoodsList">
            <el-option key="全部" label="全部" value />
            <el-option v-for="item in goodsTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="model" label-width="45px">
          <el-input v-model.trim="searchForm.model" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="商品名称" prop="goods_name" label-width="70px">
          <el-input v-model.trim="searchForm.goods_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="颜色" prop="color_name" label-width="45px">
          <el-input v-model.trim="searchForm.color_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button class="btn-h-38" type="primary" @click="getGoodsList">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="raw-material-wrapper">
        <el-button size="mini" :type="searchForm.goods_material === '' ? 'primary' : ''" :plain="searchForm.goods_material !== ''" @click="handleMaterialSelect('')"> 全部</el-button>
        <el-button
          v-for="item in raw_material_list"
          :key="item"
          size="mini"
          :type="searchForm.goods_material === item ? 'primary' : ''"
          :plain="searchForm.goods_material !== item"
          @click="handleMaterialSelect(item)"
          >{{ item }}</el-button
        >
      </div>

      <div class="table-content default-table-change">
        <el-table :data="list" stripe>
          <el-table-column prop="goods_id" label="序号" width="60" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="商品编号" min-width="40" />
          <el-table-column prop="goods_name" label="商品名称" min-width="80" />
          <el-table-column prop="sku_list_str" label="sku" min-width="80" />
          <el-table-column prop="type_txt" label="类型" min-width="40" />
          <el-table-column prop="opr" label="操作" min-width="40" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleSelectClick(scope.row)">选购</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

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
</template>

<script>
import { GOODS_TYPE } from '@/config/cfg'
import { goodsGet, buycartSave } from '@/api/api'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      searchForm: {
        goods_material: '', // 材质
        type: '', // 类型
        brand: '', // 品牌
        model: '', // 型号
        goods_name: '', // 商品名称
        color_name: '' // 颜色
      },
      list: [],
      // 分页
      total: 100, // 分页总条数
      listQuery: {
        page: 1,
        limit: 5
      },

      goodsTypeOptions: [
        { value: GOODS_TYPE.DIY, label: GOODS_TYPE.toString(GOODS_TYPE.DIY) },
        { value: GOODS_TYPE.NORM, label: GOODS_TYPE.toString(GOODS_TYPE.NORM) },
        { value: GOODS_TYPE.GIFT, label: GOODS_TYPE.toString(GOODS_TYPE.GIFT) }
      ]
    }
  },
  computed: {
    ...mapState({
      phone_brand_list: (state) => state.user.phone_brand_list,
      raw_material_list: (state) => state.user.raw_material_list,
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
        page_size: this.listQuery.limit,
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
      // 颜色
      if (this.searchForm.color_name) {
        data.color_name = this.searchForm.color_name
      }

      // console.log('商品列表 req=>', data)
      const resp = await goodsGet(data)
      // console.log('商品列表 res=>', resp)

      if (resp.ret !== 0) return

      this.list = resp.data.list
      this.total = resp.data.total
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
    handleSelectClick(row) {
      if (row.type === GOODS_TYPE.DIY) {
        this.handleDiySelect(row)
      } else if (row.type === GOODS_TYPE.NORM) {
        this.handleNormSelect(row)
      }
    },
    async handleDiySelect(row) {
      const color_name = (row.opt_color_list || [])[0].color_name

      const data = {
        opr: 'put_to_buycart_diy', // diy品加入购物车
        goods_id: row.goods_id, // 商品编号(ID)
        num: 1, // 订购数量
        color: color_name
      }
      if (this.buycart_id) {
        data.buycart_id = this.buycart_id // 购物车id（值为空时是新购物车）
      }

      // console.log('diy加入购物车 req', data)
      const resp = await buycartSave(data)
      if (resp.ret !== 0) return
      this.$store.dispatch('user/getUserInfo')
      this.$emit('goodslist-diy-select-suc', row)
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
      const resp = await buycartSave(data)
      if (resp.ret !== 0) return
      // console.log('标品加入购物车 res', resp)
      this.$store.dispatch('user/getUserInfo')
      this.$emit('goodslist-norm-select-suc')
    },

    handleMaterialSelect(item) {
      this.searchForm.goods_material = item
      this.getGoodsList()
    }
  }
}
</script>

<style lang="scss" scoped>
.goodslist-search-wrapper {
  margin: 0 90px;
}
.table-wrapper {
  padding: 18px 5px 0 5px;
}

.el-input {
  width: 150px;
}
.el-select {
  width: 150px;
}
/deep/ .raw-material-wrapper {
  padding: 0 45px;
  max-height: 114px;
  overflow-y: auto;
  .el-button.is-plain {
    margin-bottom: 10px;
    color: #2584f9;
    border-color: #2584f9;
  }
}
</style>
