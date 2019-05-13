<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="材质" prop="goods_material" label-width="70px">
          <el-select v-model="searchForm.goods_material" placeholder="请选择">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in goodsMaterialOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品种类" prop="goods_type" label-width="70px">
          <el-select v-model="searchForm.goods_type" placeholder="请选择">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in goodsTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="phone_brand" label-width="70px">
          <el-input v-model.trim="searchForm.phone_brand" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="型号" prop="phone_model" label-width="70px">
          <el-input v-model.trim="searchForm.phone_model" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="商品名称" prop="goods_name" label-width="70px">
          <el-input v-model.trim="searchForm.goods_name" placeholder="请输入" />
        </el-form-item>
        <br>
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
          <el-button class="btn-h-38" type="primary" @click="getGoodsList">查询</el-button>
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
          <router-link to="/manage-goods/goods/edit">
            <el-button class="goods-add btn-h-38" type="primary">新增商品</el-button>
          </router-link>
        </div>
      </div>

      <div class="table-content default-table-change">
        <!-- table-content start -->
        <el-table :data="list" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />

          <el-table-column prop="goods_id" label="商品编号" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="商品名称" min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="材质" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="品牌" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="型号" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="商品种类" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="库存" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="状态" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="opr" label="操作" min-width="120" align="center">
            <template slot-scope="scope">
              <el-button
                class="btn-green"
                type="text"
                @click="handlerOnOffClick(scope.row.goods_id)"
              >上架</el-button>
              <el-button
                class="btn-green"
                type="text"
                @click="handlerOnOffClick(scope.row.goods_id)"
              >下架</el-button>
              <el-button type="text" @click="handlerEditBtnClick(scope.row.goods_id)">编辑</el-button>
              <el-button
                class="btn-red"
                type="text danger"
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
import { GOODS_TYPE, GOODS_MATERIAL } from '@/config/cfg'

export default {
  data() {
    return {

      // search
      searchForm: {
        goods_material: '',   // 材质
        goods_type: '',       // 商品种类
        phone_brand: '',      // 品牌
        phone_model: '',      // 型号
        goods_name: '',       // 商品名称
        goods_id: '',         // 商品编号
        goods_stock_type: '', // 库存类型   （1.大于等于：more 2.小于等于：less）
        goods_stock: ''       // 商品库存
      },

      list: [
        {
          goods_id: '123'
        },
        {},
        {}
      ],
      multipleSelection: [],
      tableLoading: false,
      // 分页
      total: 100, // 分页总条数
      listQuery: {
        page: 1,
        limit: 10
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
      goodsMaterialOptions: [
        {
          value: GOODS_MATERIAL.GLASS,
          label: GOODS_MATERIAL.toString(GOODS_MATERIAL.GLASS)
        },
        {
          value: GOODS_MATERIAL.SILICONE,
          label: GOODS_MATERIAL.toString(GOODS_MATERIAL.SILICONE)
        }
      ]
    }
  },
  computed: {
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  mounted() {
    this.getGoodsList()
  },
  methods: {
    getGoodsList() {
      const data = {}
      // 材质
      if (this.searchForm.goods_material) {
        data.goods_material = this.searchForm.goods_material
      }
      // 商品种类
      if (this.searchForm.goods_type) {
        data.goods_type = this.searchForm.goods_type
      }
      // 品牌
      if (this.searchForm.phone_brand) {
        data.phone_brand = this.searchForm.phone_brand
      }
      // 型号
      if (this.searchForm.phone_model) {
        data.phone_model = this.searchForm.phone_model
      }
      // 商品名称
      if (this.searchForm.goods_name) {
        data.goods_name = this.searchForm.goods_name
      }
      // 商品编号
      if (this.searchForm.goods_id) {
        data.goods_id = this.searchForm.goods_id
      }
      // 商品库存类型
      if (this.searchForm.goods_stock_type) {
        data.goods_stock_type = this.searchForm.goods_stock_type
      }
      // 商品库存
      if (this.searchForm.goods_stock) {
        data.goods_stock = this.searchForm.goods_stock
      }

      /**
       * 掉接口  商品列表
       * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
       */

      console.log('调接口 商品列表 req=>', data)
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
      // this.getList()
      //   PageSize.set(this.$route, val);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      // this.getList()
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
      /**
       * 掉接口  删除商品
       * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
       */
    },
    handlerOnOffClick(id) {
      /**
      * 掉接口  上下架
      * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      */
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
}
.btn-green {
  color: #1a9901;
}
.btn-red {
  color: #e33119;
}
</style>

