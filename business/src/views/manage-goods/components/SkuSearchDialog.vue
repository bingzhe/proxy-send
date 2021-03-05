<template>
  <sl-dialog ref="skuSearchDialog" title="查询SKU" width="900px" top="8vh" @confirm="handleSkuSearchDialogConfirm" @close="handleSkuSearchDialogClose">
    <div class="search-wrapper sku-search-wrapper">
      <el-form ref="skuSearchForm" class="su-search-form" :model="skuSearchForm" :inline="true">
        <el-form-item label="材质" prop="goods_material" label-width="70px">
          <el-select v-model="skuSearchForm.goods_material" placeholder="请选择" clearable>
            <el-option v-for="item in raw_material_list" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brand" label-width="70px">
          <el-select v-model="skuSearchForm.brand" filterable placeholder="请选择" clearable @change="handlerBrandChange">
            <el-option v-for="item in phone_brand_list" :key="item.brand_id" :label="item.brand_name" :value="item.brand_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="颜色" prop="color_name" label-width="70px">
          <el-input v-model.trim="skuSearchForm.color_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="型号" prop="model" label-width="70px">
          <el-select v-model="skuSearchForm.model" filterable placeholder="请选择" clearable>
            <el-option v-for="item in data_model_list" :key="item.model_id" :label="item.model_name" :value="item.model_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="goods_name" label-width="70px">
          <el-input v-model.trim="skuSearchForm.goods_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button class="btn-h-38" type="primary" @click="getSkuList">查询</el-button>
        </el-form-item>
      </el-form>

      <div v-loading="skuTableLoading" element-loading-text="拼命加载中">
        <div class="table-content default-table-change sku-table">
          <el-table ref="skuTable" :data="skuList" stripe height="350" class="sku-table" @selection-change="handleSkuSelectionChange">
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column align="center" prop="sku" label="sku" />
          </el-table>
        </div>
      </div>
    </div>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import { goodsGet } from '@/api/api'
import { mapState } from 'vuex'

export default {
  components: {
    SlDialog
  },
  data() {
    return {
      skuSearchForm: {
        goods_material: '',
        brand: '',
        model: '',
        goods_name: '',
        color_name: ''
      },

      skuList: [],
      skuTableLoading: false,
      skuMultipleSelection: [],
      data_model_list: []
    }
  },
  computed: {
    ...mapState({
      phone_brand_list: (state) => state.user.phone_brand_list,
      model_list: (state) => state.user.model_list,
      raw_material_list: (state) => state.user.raw_material_list
    })
  },
  methods: {
    show() {
      this.$refs.skuSearchDialog.show()
    },
    handleSkuSearchDialogClose() {
      this.$refs.skuSearchForm.resetFields()
      this.skuList = []
      this.skuMultipleSelection = []
    },
    handleSkuSearchDialogConfirm() {
      if (this.skuMultipleSelection.length === 0) return

      const skuStr = this.skuMultipleSelection
        .map((item) => {
          return item.sku
        })
        .join('\n')

      this.pictureForm.sku_list_str = this.pictureForm.sku_list_str === '' ? skuStr : this.pictureForm.sku_list_str + '\n' + skuStr
      this.handleSkuSearchDialogClose()
      this.$refs.skuSearchDialog.hide()
    },
    handlerBrandChange(brand_id) {
      this.skuSearchForm.model = ''
      this.phone_brand_list.forEach((brand) => {
        if (brand.brand_id === brand_id) {
          this.data_model_list = brand.model_list
        }
      })
    },
    async getSkuList() {
      const data = {
        opr: 'get_goods_sku_list',
        goods_name: this.skuSearchForm.goods_name, // 商品名称
        raw_material: this.skuSearchForm.goods_material, // 材质（见系统管理中参数配置）
        brand: this.skuSearchForm.brand, // 品牌ID
        model: this.skuSearchForm.model, // 型号ID
        color_name: this.skuSearchForm.color_name
      }

      this.skuTableLoading = true

      console.log('get sku data req=>', data)
      const resp = await goodsGet(data)
      console.log('get sku data res=>', resp)

      if (resp.ret !== 0) return
      this.skuTableLoading = false

      this.skuList = resp.data.list

      this.$nextTick(() => {
        this.$refs.skuTable.toggleAllSelection()
      })
    },
    handleSkuSelectionChange(val) {
      this.skuMultipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
.search-wrapper {
  padding-top: 30px;

  .el-input {
    width: 180px;
  }
  .el-select {
    width: 180px;
  }

  &.sku-search-wrapper {
    padding-top: 0;
  }
}
.el-table {
  min-height: 400px;
  /deep/ td {
    padding: 4px 0;
  }

  &.sku-table {
    min-height: 200px;

    /deep/ td {
      padding: 6px 0;
    }
  }
}
</style>

