<template>
  <SlDialog
    ref="warehouseEditDialog"
    :title="warehouse_id ? '编辑仓库信息' : '新增仓库信息'"
    :confirm-text="warehouse_id ? '保存' : '提交'"
    :validate="true"
    width="850px"
    top="8vh"
    @confirm="handleWarehouseEditConfirm"
    @close="handleWarehouseClose"
    @open="handleWarehouseOpen"
  >
    <el-form
      ref="warehouseEditForm"
      :model="warehouseForm"
      :rules="warehouseFormRules"
      label-width="150px"
    >
      <el-form-item label="仓库名称" prop="warehouse_name">
        <el-input v-model.trim="warehouseForm.warehouse_name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="仓库所在城市" prop="city_id">
        <el-cascader
          ref="cityCascader"
          v-model="warehouseForm.city_id"
          :options="regionList"
          clearable
          :show-all-levels="false"
          filterable
        />
      </el-form-item>
      <el-form-item label="仓库详细地址" prop="address">
        <el-input v-model.trim="warehouseForm.address" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="可发货城市" prop="send_area_id_list">
        <el-cascader
          ref="cityListCascader"
          v-model="warehouseForm.send_area_id_list"
          :options="regionList"
          clearable
          :show-all-levels="false"
          :props="{ multiple: true }"
          filterable
        />
      </el-form-item>
      <div class="add-btn-wrapper" @click="handleAddPriceClick">
        <!-- <span class="add-btn-icon" /> -->
        <i class="el-icon-circle-plus" />
        <span class="add-btn-text">新增</span>
      </div>
      <div class="delivery-price-table default-table-change">
        <el-table :data="warehouseForm.delivery_company_list" stripe border>
          <el-table-column prop="num" label="序号" width="55" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="快递" min-width="60" align="center">
            <template slot-scope="scope">
              <el-form-item
                class="table-form-item"
                :prop="'delivery_company_list.' + scope.$index + '.company_name'"
                :rules="{
                  required: true,
                  trigger: 'blur',
                  message: '请输入快递公司'
                }"
              >
                <el-input
                  v-model.trim="scope.row.company_name"
                  placeholder="请输入"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="发货数量" min-width="100" align="center">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.price_list" :key="index">
                <el-form-item
                  class="table-form-item"
                  :prop="`delivery_company_list.${scope.$index}.price_list[${index}].from`"
                  :rules="{
                    required: true,
                    trigger: 'blur',
                    message: '请输入开始数量'
                  }"
                >
                  <el-input
                    v-model.trim="item.from"
                    v-limit-input-morenum="item.from"
                    :data-expression="
                      `warehouseForm.delivery_company_list[${
                        scope.$index
                      }].price_list[${index}].from`
                    "
                    class="delivary-input"
                    size="mini"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <span>-</span>
                <el-form-item
                  class="table-form-item"
                  :prop="`delivery_company_list.${scope.$index}.price_list[${index}].to`"
                  :rules="{
                    required: true,
                    trigger: 'blur',
                    message: '请输入结束数量'
                  }"
                >
                  <el-input
                    v-model="item.to"
                    v-limit-input-morenum="item.to"
                    :data-expression="
                      `warehouseForm.delivery_company_list[${scope.$index}].price_list[${index}].to`
                    "
                    class="delivary-input"
                    size="mini"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="发货费用" min-width="60" align="center">
            <template slot-scope="scope">
              <el-row v-for="(item, index) in scope.row.price_list" :key="index">
                <el-col :span="18">
                  <el-form-item
                    class="table-form-item"
                    :prop="`delivery_company_list.${scope.$index}.price_list[${index}].price`"
                    :rules="{
                      required: true,
                      trigger: 'blur',
                      message: '请输入发货费用'
                    }"
                  >
                    <el-input
                      v-model="item.price"
                      v-limit-input-morenum="item.price"
                      :data-expression="
                        `warehouseForm.delivery_company_list[${
                          scope.$index
                        }].price_list[${index}].price`
                      "
                      data-dotrange="{0,2}"
                      class="delivary-price-input"
                      size="mini"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="company-price-btn-wrapper">
                  <i
                    v-if="index === 0"
                    class="el-icon-circle-plus"
                    @click="handlePriceAddClick(scope.$index)"
                  />
                  <i
                    v-if="index !== 0"
                    class="el-icon-remove"
                    @click="handlePriceRemoveClick(scope.$index, index)"
                  />
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="操作" width="60" align="center">
            <template slot-scope="scope">
              <el-button class="text-btn" type="text" @click="handleDelPriceClick(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
  </SlDialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import { warehouseSave, warehouseGet } from '@/api/api'

export default {
  components: {
    SlDialog
  },
  props: {
    warehouse_id: {
      type: String,
      default: ''
    },
    regionList: {
      type: Array,
      required: true
    },
    areaMap: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      warehouseForm: {
        warehouse_name: '', // 仓库名称
        city_id: [], // ['1', '12']
        city: '', // 仓库所在位置(城市)
        address: '', // 仓库详细地址
        send_area_id_list: [], // [['1','12'], ['2', '22']]
        send_area_list: [], // 可向哪些城市发货
        delivery_price_list: [], // 发货阶梯价 {from :"", to: "", price:""}
        delivery_company_list: [] // 物流公司发货阶梯价
        //         {
        //     company_name : "顺风",    // 快递公司名称
        //     price_list : [          // 发货阶梯价列表
        //         {
        //             from: 1.0,      // 发货量从from到to
        //             to: 9.99,
        //             price: 5.0,     // 收费price（元）
        //         }
        //     ]
        // }
      },
      warehouseFormRules: {
        warehouse_name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
        city_id: [
          { type: 'array', required: true, message: '请选择仓库所在城市', trigger: 'change' }
        ],
        address: [{ required: true, message: '请输入仓库详细地址', trigger: 'blur' }],
        send_area_id_list: [
          { type: 'array', required: true, message: '请选择可发货城市', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    show() {
      this.$refs.warehouseEditDialog.show()
    },

    handleWarehouseEditConfirm() {
      this.$refs.warehouseEditForm.validate((valid) => {
        if (valid) {
          this.saveWarehose()
        }
      })
    },
    handleWarehouseClose() {
      this.$refs.warehouseEditForm.resetFields()
      this.warehouseForm.delivery_company_list = []
      this.$emit('on-close')
    },
    handleWarehouseOpen() {
      if (this.warehouse_id) {
        this.getWarehouseInfo()
      }
    },
    async getWarehouseInfo() {
      const data = {
        opr: 'get_warehouse_info',
        warehouse_id: this.warehouse_id // 仓库ID
      }

      // console.log('仓库详情 req=>', data)
      const resp = await warehouseGet(data)
      // console.log('仓库详情 res=>', resp)
      if (resp.ret !== 0) return

      const info = resp.data || {}

      this.warehouseForm.warehouse_name = info.warehouse_name
      this.warehouseForm.address = info.address
      this.warehouseForm.city_id = (this.areaMap[info.city] || {}).path || []
      this.warehouseForm.send_area_id_list = (info.send_area_list || []).map((item) => {
        return (this.areaMap[item] || {}).path || []
      })
      // this.warehouseForm.delivery_price_list = info.delivery_price_list || []
      this.warehouseForm.delivery_company_list = info.delivery_company_list || []
    },
    async saveWarehose() {
      const citySelect = this.$refs.cityCascader.getCheckedNodes()
      const sendCitySelect = this.$refs.cityListCascader.getCheckedNodes(true)

      const city = citySelect.map((item) => item.value).join('')
      const sendCity = sendCitySelect.map((item) => item.value)

      const data = {
        opr: 'save_warehouse',
        warehouse_name: this.warehouseForm.warehouse_name, // 仓库名称
        address: this.warehouseForm.address, // 仓库详细地址
        city: city, // 仓库所在位置(城市)
        send_area_list: sendCity, // 可向哪些城市发货
        // delivery_price_list: this.warehouseForm.delivery_price_list
        delivery_company_list: this.warehouseForm.delivery_company_list
      }

      if (this.warehouse_id) {
        data.warehouse_id = this.warehouse_id
      }

      // console.log('仓库保存 req=>', data)
      const resp = await warehouseSave(data)
      // console.log('仓库保存 res=>', resp)
      if (resp.ret !== 0) return

      this.handleWarehouseClose()
      this.$emit('on-success')
      this.$refs.warehouseEditDialog.hide()
      this.$notify({
        title: '成功',
        message: this.warehouse_id ? '保存成功' : '提交成功',
        type: 'success'
      })
    },
    handleAddPriceClick() {
      // this.warehouseForm.delivery_price_list.push({
      //   from: '',
      //   to: '',
      //   price: ''
      // })

      this.warehouseForm.delivery_company_list.push({
        company_name: '', // 快递公司名称
        price_list: [
          {
            from: '', // 发货量从from到to
            to: '',
            price: '' // 收费price（元）
          }
        ]
      })
    },
    handleDelPriceClick(i) {
      this.warehouseForm.delivery_company_list.splice(i, 1)
    },
    // 发货数量新增
    handlePriceAddClick(i) {
      this.warehouseForm.delivery_company_list[i].price_list.push({
        from: '', // 发货量从from到to
        to: '',
        price: '' // 收费price（元）
      })
    },
    // 删除发货数量
    handlePriceRemoveClick(i, j) {
      this.warehouseForm.delivery_company_list[i].price_list.splice(j, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-right: 150px;
}
.el-cascader {
  width: 100%;
}
.el-form-item {
  margin-bottom: 18px;
}
.delivery-price-table {
  margin-right: -110px;
  margin-left: 20px;
}
.table-form-item {
  display: inline-block;
  margin-bottom: 0;
  /deep/ .el-form-item__content {
    margin-left: 0 !important;
    line-height: 28px;
  }

  /deep/ .el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
  }

  .delivary-input {
    width: 100px;
  }
}
.add-btn-wrapper {
  color: #2584f9;
  cursor: pointer;
  text-align: right;
  margin: 0 -110px 10px 0;
  .el-icon-circle-plus {
    font-size: 20px;
  }
  .add-btn-text {
    font-size: 16px;
    vertical-align: text-bottom;
  }
}
.text-btn {
  color: #e33119;
}

.company-price-btn-wrapper {
  font-size: 24px;
  line-height: 28px;
  .el-icon-circle-plus {
    color: #2584f9;
    cursor: pointer;
  }

  .el-icon-remove {
    color: #e33119;
    cursor: pointer;
  }
}
</style>
