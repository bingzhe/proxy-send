<template>
  <div class="app-container">
    <div class="shopcart-wrapper">
      <div class="goods-wrapper">
        <div class="baseinfo-title-wrapper clearfix">
          <baseinfo-title class="select-shop-title" color="#FB7474" text="已选商品" />
          <el-button class="continue-shop" type="primary" plain>继续选购</el-button>
        </div>
        <div class="select-goods-table-wrapper">
          <el-table class="select-goods-table" border :data="goodsList">
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column prop="goods_id" label="图片" min-width="50" />
            <el-table-column prop="goods_id" label="商品类型" min-width="50" />
            <el-table-column prop="goods_id" label="材质_品牌_型号_边框_商品编号" width="250" />
            <el-table-column prop="goods_id" label="数量" width="150">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.num" :min="1" size="small" label="描述文字" />
              </template>
            </el-table-column>
            <el-table-column prop="goods_id" label="单价" min-width="50" />
            <el-table-column prop="goods_id" label="小计" min-width="50" />
            <el-table-column prop="goods_id" label="操作" min-width="50" />
          </el-table>
        </div>
      </div>
      <div class="gifs-wrapper">
        <div class="baseinfo-title-wrapper">
          <baseinfo-title color="#74BAFB" text="配送礼品" />
        </div>
        <div class="gifs-form-wrapper">
          <el-form :model="gifsForm" :inline="true">
            <el-form-item label="商品种类" prop="type" label-width="70px">
              <el-input-number v-model="gifsForm.num" controls-position="right" :min="0" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="consignee-wrapper">
        <div class="baseinfo-title-wrapper">
          <baseinfo-title color="#FBBD74" text="配送信息" />
        </div>
      </div>
    </div>
    <div v-if="false" class="empty-shopcart">
      <div class="empty-pic">
        <img src="@/assets/images/empty-shopcart.png">
      </div>
      <div class="empty-tip">
        <span>你的购物车还是空的～～</span>
      </div>
      <div>
        <el-button type="primary" plain>前往选购</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import { buycartGet } from '@/api/api'
import { mapState } from 'vuex'

export default {
  components: {
    BaseinfoTitle
  },
  data() {
    return {
      goodsList: [{ num: 1 }, { num: 2 }, { num: 1 }],
      gifsForm: {
        num: 0
      }
    }
  },
  computed: {
    ...mapState({
      buycart_id: state => state.user.buycart_id
    })
  },
  mounted() {
    this.getBuycart()
  },
  methods: {
    async getBuycart() {
      const data = {
        opr: 'get_buycart_info', // 标品加入购物车
        buycart_id: this.buycart_id // 购物车id
      }

      console.log('购物车 req=>', data)
      const resp = await buycartGet(data)
      console.log('购物车 res=>', resp)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  min-height: 700px;
}
.baseinfo-title-wrapper {
  padding: 24px 140px 24px 90px;
}
.select-shop-title {
  float: left;
  line-height: 34px;
}
.el-button.continue-shop {
  font-size: 16px;
  float: right;
  padding: 8px 12px;
}

.select-goods-table-wrapper {
  margin: 0 140px;
}
.gifs-form-wrapper {
  margin: 0 140px;

  .el-input-number {
    width: 130px;
  }
}

.select-goods-table-wrapper {
  /deep/ .select-goods-table {
    td {
      padding: 4px 0;
    }
    thead {
      tr {
        background: rgba(245, 248, 251, 1);
        th {
          background: none;
        }
      }
    }
    &.el-table--border th,
    &.el-table--border td {
      border-right: none;
    }
    .el-table__header-wrapper {
      box-shadow: 0px 2px 6px 0px rgba(37, 132, 249, 0.1);
    }
    .el-input--small .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
    .el-input-number--small .el-input-number__increase,
    .el-input-number--small .el-input-number__decrease {
      background-color: #2584f9;
      color: #fff;
      border-color: #2584f9;
    }
    .el-input-number--small .el-input-number__decrease {
      border-radius: 2px 0 0 2px;
    }
    .el-input-number--small .el-input-number__increase {
      border-radius: 0 2px 2px 0;
    }
  }
}

.empty-shopcart {
  text-align: center;
  .empty-pic {
    padding-top: 120px;
    img {
      width: 280px;
      height: 252px;
    }
  }
  .empty-tip {
    margin: 24px 0 31px;
    font-size: 14px;
    color: #8e9cac;
  }

  .el-button {
    font-size: 18px;
    width: 120px;
  }
}
</style>
