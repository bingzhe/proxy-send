<template>
  <div id="goods-edit-page" class="app-container">
    <div class="title-wrapper">
      <span class="title-text">{{ goods_id ? '编辑商品' : '添加新商品' }}</span>
      <el-button class="btn-bd-primary" @click="handlerGoBackClick">返回</el-button>
    </div>
    <div class="baseinfo-form-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#F348A1" text="基本信息" />
      </div>
      <el-form
        ref="baseinfoForm"
        :model="baseinfoForm"
        :rules="baseinfoFormRules"
        :validate-on-rule-change="false"
      >
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item label="商品名称" label-width="160px" prop="goods_name">
              <el-input v-model="baseinfoForm.goods_name" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="商品种类" label-width="160px" prop="goods_type">
              <el-select
                v-model="baseinfoForm.goods_type"
                placeholder="请选择"
                @change="handlerGoodsTypeChagne"
              >
                <el-option
                  v-for="item in goodsTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item
              v-show="goodsType === GOODS_TYPE.DIY || goodsType === GOODS_TYPE.NORM"
              label="材质"
              label-width="160px"
              prop="goods_material"
            >
              <el-select v-model="baseinfoForm.goods_material" placeholder="请选择">
                <el-option
                  v-for="item in goodsMaterialOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item
              v-show="goodsType === GOODS_TYPE.DIY || goodsType === GOODS_TYPE.NORM"
              label="品牌"
              label-width="160px"
              prop="brand"
            >
              <el-input v-model="baseinfoForm.brand" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item
              v-show="goodsType === GOODS_TYPE.DIY || goodsType === GOODS_TYPE.NORM"
              label="型号"
              label-width="160px"
              prop="model"
            >
              <el-input v-model="baseinfoForm.model" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item
              v-show="goodsType === GOODS_TYPE.GIFT"
              label="库存"
              label-width="160px"
              prop="goods_stock"
            >
              <el-input v-model="baseinfoForm.goods_stock" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="单价" label-width="160px" prop="price">
              <el-input
                v-model.trim="baseinfoForm.price"
                v-limit-input-number="baseinfoForm.price"
                data-dotrange="{0,2}"
                placeholder="请输入内容"
              >
                <!-- type="number" -->
                <span slot="suffix" class="input-suffix-text">元</span>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" label-width="160px">
              <el-input
                v-model="baseinfoForm.remark"
                :rows="3"
                type="textarea"
                placeholder="请输入内容"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-show="goodsType === GOODS_TYPE.DIY" class="printinfo-form-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#F348A1" text="打印参数" />
      </div>
      <el-form ref="printinfoForm" :model="printinfoForm" :rules="printinfoFormRules">
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item label="图像高" label-width="160px" prop="pic_height">
              <el-input
                v-model.trim="printinfoForm.pic_height"
                v-limit-input-number="printinfoForm.pic_height"
                placeholder="请输入内容"
              >
                <span slot="suffix" class="input-suffix-text">像素</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="四角弧度" label-width="160px" prop="pic_radius">
              <el-input v-model.trim="printinfoForm.pic_radius" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item label="图像宽" label-width="160px" prop="pic_width">
              <el-input
                v-model.trim="printinfoForm.pic_width"
                v-limit-input-number="printinfoForm.pic_width"
                placeholder="请输入内容"
              >
                <span slot="suffix" class="input-suffix-text">像素</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="定位角" label-width="160px" prop="pic_position">
              <el-select v-model="printinfoForm.pic_position" placeholder="请选择">
                <el-option
                  v-for="item in goodsPrintPositoinOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item label="与横边距离" label-width="160px" prop="horizontal_distance">
              <el-input
                v-model.trim="printinfoForm.horizontal_distance"
                v-limit-input-number="printinfoForm.horizontal_distance"
                placeholder="请输入内容"
              >
                <span slot="suffix" class="input-suffix-text">像素</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="与纵边距离" label-width="160px" prop="vertical_distance">
              <el-input
                v-model.trim="printinfoForm.vertical_distance"
                v-limit-input-number="printinfoForm.vertical_distance"
                placeholder="请输入内容"
              >
                <span slot="suffix" class="input-suffix-text">像素</span>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div
      v-show="goodsType === GOODS_TYPE.DIY || goodsType === GOODS_TYPE.NORM"
      class="base-pic-wrapper"
    >
      <div class="base-pic-title-wrapper">
        <baseinfo-title color="#F3C148" text="底图颜色" />
        <div class="add-btn-wrapper" @click="handlerAddPicClick">
          <!-- <span class="add-btn-icon" /> -->
          <i class="el-icon-circle-plus" />
          <span class="add-btn-text">新增</span>
        </div>
      </div>
      <div class="base-pic-table-wrapper default-table-change">
        <el-form ref="basePicForm" :model="basePicForm">
          <el-table :data="basePicForm.base_pic_list" stripe border>
            <el-table-column prop="num" label="序号" width="80" align="center">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="goods_id" label="颜色" min-width="80" align="center">
              <template slot-scope="scope">
                <el-form-item
                  class="pictable-form-item"
                  :rules="{
                    required: true, message: '颜色不能为空', trigger: 'blur'
                  }"
                  :prop="'base_pic_list.' + scope.$index + '.color'"
                >
                  <el-input v-model="scope.row.color" placeholder="请输入内容" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="goods_id" label="库存" min-width="80" align="center">
              <template slot-scope="scope">
                <el-form-item
                  class="pictable-form-item"
                  :rules="{
                    required: true, message: '库存不能为空', trigger: 'blur'
                  }"
                  :prop="'base_pic_list.' + scope.$index + '.stock'"
                >
                  <el-input v-model.trim="scope.row.stock" placeholder="请输入内容" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="goods_id" label="图片" min-width="80" align="center">
              <template slot-scope="scope">
                <div class="base-image-wrapper">{{ scope.row.picture }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="goods_id" label="操作" min-width="45" align="center">
              <template slot-scope="scope">
                <el-button class="text-btn" type="text" @click="handlerDeletePicClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>

    <div class="gray-border-bottom" />

    <div class="button-group-wrapper">
      <el-button class="btn-h-44-w-100 btn-bd-primary">取消</el-button>
      <el-button
        class="btn-h-44-w-100"
        type="primary"
        @click="handlerSaveBtnClick"
      >{{ goods_id ? '保存' : '提交' }}</el-button>
    </div>
  </div>
</template>
<script>
import BaseinfoTitle from '../components/BaseinfoTitle/BaseinfoTitle'
import { GOODS_TYPE, GOODS_MATERIAL, GOODS_PRINT_POSITION } from '@/config/cfg'

export default {
  components: {
    BaseinfoTitle
  },
  data() {
    return {
      goods_id: '',
      goodsType: 1,

      baseinfoForm: {
        goods_name: '', // 商品名称
        goods_type: '', // 商品种类
        goods_material: '', // 材质
        brand: '', // 品牌
        model: '', // 型号
        price: '', // 单价
        remark: '', // 备注
        goods_stock: '' // 商品库存
      },
      printinfoForm: {
        pic_height: '', // 图像高
        pic_width: '', // 图像宽
        pic_radius: '', // 四角弧度
        pic_position: '', // 定位角
        horizontal_distance: '', // 与横边距离
        vertical_distance: '' // 与纵边距离
      },

      basePicForm: {
        base_pic_list: [
          // {
          //   color: '',
          //   stock: '',
          //   picture: ''
          // }
        ]
      },

      baseinfoFormRules: {},
      phoneShellRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_type: [
          { required: true, message: '请选择商品种类', trigger: 'change' }
        ],
        goods_material: [
          { required: true, message: '请选择材质', trigger: 'change' }
        ],
        brand: [{ required: true, message: '请选择品牌', trigger: 'change' }],
        model: [{ required: true, message: '请选择型号', trigger: 'change' }],
        price: [{ required: true, message: '请输入单价', trigger: 'blur' }]
      },
      giftInfoRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_type: [
          { required: true, message: '请选择商品种类', trigger: 'change' }
        ],
        goods_stock: [
          { required: true, message: '请输入商品库存', trigger: 'blur' }
        ],
        price: [{ required: true, message: '请输入单价', trigger: 'blur' }]
      },
      printinfoFormRules: {
        pic_height: [
          { required: true, message: '请输入图像高', trigger: 'blur' }
        ],
        pic_width: [
          { required: true, message: '请输入图像宽', trigger: 'blur' }
        ],
        pic_radius: [
          { required: true, message: '请输入四角弧度', trigger: 'blur' }
        ],
        pic_position: [
          { required: true, message: '请选择定位角', trigger: 'change' }
        ],
        horizontal_distance: [
          { required: true, message: '请输入与横边距离', trigger: 'blur' }
        ],
        vertical_distance: [
          { required: true, message: '请输入与纵边距离', trigger: 'blur' }
        ]
      },

      GOODS_TYPE,
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
      ],

      goodsPrintPositoinOptions: [
        {
          value: GOODS_PRINT_POSITION.LEFT_TOP,
          label: GOODS_PRINT_POSITION.toString(GOODS_PRINT_POSITION.LEFT_TOP)
        },
        {
          value: GOODS_PRINT_POSITION.LEFT_BOTTOM,
          label: GOODS_PRINT_POSITION.toString(GOODS_PRINT_POSITION.LEFT_BOTTOM)
        },
        {
          value: GOODS_PRINT_POSITION.RIGHT_TOP,
          label: GOODS_PRINT_POSITION.toString(GOODS_PRINT_POSITION.RIGHT_TOP)
        },
        {
          value: GOODS_PRINT_POSITION.RIGHT_BOTTOM,
          label: GOODS_PRINT_POSITION.toString(
            GOODS_PRINT_POSITION.RIGHT_BOTTOM
          )
        }
      ]
    }
  },
  created() {
    this.baseinfoFormRules = this.phoneShellRules
    this.goods_id = this.$route.query.goodsid

    // if (this.goods_id) {

    // }
  },
  methods: {
    handlerAddPicClick() {
      this.basePicForm.base_pic_list.push({
        color: '',
        stock: '',
        picture: ''
      })
    },
    handlerDeletePicClick(item) {
      const index = this.basePicForm.base_pic_list.indexOf(item)
      if (index !== -1) {
        this.basePicForm.base_pic_list.splice(index, 1)
      }
    },
    handlerGoBackClick() {
      this.$router.go(-1)
    },
    handlerGoodsTypeChagne(val) {
      this.goodsType = val

      if (this.goodsType === GOODS_TYPE.GIFT) {
        this.baseinfoFormRules = this.giftInfoRules
      } else {
        this.baseinfoFormRules = this.phoneShellRules
      }
    },
    validateForm(formName) {
      return new Promise((resolve, reject) => {
        // console.log('promise')
        this.$refs[formName].validate((valid) => {
          resolve(valid)
        })
      })
    },
    async handlerSaveBtnClick() {
      const data = {

      }

      if (this.goodsType === GOODS_TYPE.DIY) {
        const baseinfoValidate = await this.validateForm('baseinfoForm')
        const printinfoValidate = await this.validateForm('printinfoForm')
        const basePicValidate = await this.validateForm('basePicForm')

        if (baseinfoValidate && printinfoValidate && basePicValidate) {
          data.goods_name = this.baseinfoForm.goods_name
          data.goods_type = this.baseinfoForm.goods_type
          data.goods_material = this.baseinfoForm.goods_material
          data.brand = this.baseinfoForm.brand
          data.model = this.baseinfoForm.model
          data.price = this.baseinfoForm.price
          data.remark = this.baseinfoForm.remark
          data.pic_height = this.printinfoForm.pic_height
          data.pic_width = this.printinfoForm.pic_width
          data.pic_radius = this.printinfoForm.pic_radius
          data.pic_position = this.printinfoForm.pic_position
          data.horizontal_distance = this.printinfoForm.horizontal_distance
          data.vertical_distance = this.printinfoForm.vertical_distance
          data.pic_list = this.basePicForm.base_pic_list
        }
      } else if (this.goodsType === GOODS_TYPE.NORM) {
        const baseinfoValidate = await this.validateForm('baseinfoForm')
        const basePicValidate = await this.validateForm('basePicForm')

        if (baseinfoValidate && basePicValidate) {
          data.goods_name = this.baseinfoForm.goods_name
          data.goods_type = this.baseinfoForm.goods_type
          data.goods_material = this.baseinfoForm.goods_material
          data.brand = this.baseinfoForm.brand
          data.model = this.baseinfoForm.model
          data.price = this.baseinfoForm.price
          data.remark = this.baseinfoForm.remark
          data.pic_list = this.basePicForm.base_pic_list
        }
      } else if (this.goodsType === GOODS_TYPE.GIFT) {
        const baseinfoValidate = await this.validateForm('baseinfoForm')

        if (baseinfoValidate) {
          data.goods_name = this.baseinfoForm.goods_name
          data.goods_type = this.baseinfoForm.goods_type
          data.goods_stock = this.baseinfoForm.goods_stock
          data.price = this.baseinfoForm.price
          data.remark = this.baseinfoForm.remark
        }
      }
      console.log('提交数据 req=>', data)
    }

  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
}
.title-wrapper {
  height: 54px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  align-items: center;
  .title-text {
    font-size: 16px;
    color: #666;
  }
}

.baseinfo-form-wrapper {
  max-width: 1035px;
  .baseinfo-title-wrapper {
    padding: 24px 30px;
  }
}
.printinfo-form-wrapper {
  max-width: 1035px;
  .baseinfo-title-wrapper {
    padding: 24px 30px;
  }
}

.base-pic-wrapper {
  max-width: 1035px;
  .base-pic-title-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 24px 20px 24px 30px;
    .add-btn-wrapper {
      color: #2584f9;
      cursor: pointer;
      .el-icon-circle-plus {
        font-size: 20px;
      }
      .add-btn-text {
        font-size: 16px;
        vertical-align: text-bottom;
      }
    }
  }
  .base-pic-table-wrapper {
    margin: 0 20px 40px 70px;
    .text-btn {
      color: #e33119;
    }
  }
  .base-image-wrapper {
    display: inline-block;
    height: 60px;
    width: 44px;
    vertical-align: middle;
    border: 1px solid #ccc;
  }
  .pictable-form-item {
    margin: 16px 0;
  }
}
.gray-border-bottom {
  border-bottom: 1px solid #e6e6e6;
}
.button-group-wrapper {
  padding: 24px 0 32px;
  text-align: center;

  .el-button:first-child {
    margin-right: 40px;
  }
}
.input-suffix-text {
  color: #333;
  margin-right: 10px;
}
</style>

<style lang="scss">
#goods-edit-page {
  .base-pic-table-wrapper {
    .el-table {
      .el-table__body-wrapper {
        td {
          padding: 0;
        }
      }
    }
  }
}
</style>
