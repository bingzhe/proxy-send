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
        <div class="consignee-form-wrapper">
          <el-form :model="consigneeFrom" :inline="true" label-width="140px">
            <el-form-item label="物流选择" prop="type" label-width="140px">
              <el-input v-model="consigneeFrom.company_name" />
            </el-form-item>
            <br>
            <el-form-item label="收件人" prop="type" label-width="140px">
              <el-input v-model="consigneeFrom.person" />
            </el-form-item>
            <el-form-item label="联系电话" prop="type" label-width="140px">
              <el-input v-model="consigneeFrom.phone" />
            </el-form-item>
            <br>
            <el-form-item label="收货人详细地址" prop="type" label-width="140px">
              <el-input v-model="consigneeFrom.address" type="textarea" />
            </el-form-item>
            <br>
            <el-form-item label="省份" prop="type" label-width="140px">
              <el-input v-model="consigneeFrom.province" />
            </el-form-item>
            <el-form-item label="市区" prop="type" label-width="140px">
              <el-input v-model="consigneeFrom.city" />
            </el-form-item>
            <br>
            <el-form-item label="区县" prop="type" label-width="140px">
              <el-input v-model="consigneeFrom.area" />
            </el-form-item>
            <el-form-item label="街道/镇" prop="type" label-width="140px">
              <el-input v-model="consigneeFrom.street" />
            </el-form-item>
            <br>
            <el-form-item label="留言" prop="type" label-width="140px">
              <el-input v-model="consigneeFrom.person" type="textarea" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <shopcart-empty v-if="false" />
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import ShopcartEmpty from './ShopcartEmpty'
import { buycartGet } from '@/api/api'
import { mapState } from 'vuex'

export default {
  components: {
    BaseinfoTitle,
    ShopcartEmpty
  },
  data() {
    return {
      goodsList: [{ num: 1 }, { num: 2 }, { num: 1 }],
      gifsForm: {
        num: 0
      },

      // 收货人信息
      consigneeFrom: {
        person: '李六', // 收货人名
        phone: '13922223333', // 手机号码
        address: '广东省深圳市宝安区西乡街道101号', // 收货地址
        province: '广东省', // 省
        city: '深圳市', // 市
        area: '宝安区', // 区县
        street: '西乡街道101号', // 街道
        company_name: '顺丰'
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

.consignee-form-wrapper {
  max-width: 930px;

  .el-input {
    width: 300px;
  }
  .el-select {
    width: 300px;
  }
  .el-textarea {
    width: 100%;
  }
}
</style>
