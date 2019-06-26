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
              <el-input v-model="baseinfoForm.goods_name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="商品种类" label-width="160px" prop="type">
              <el-select
                v-model="baseinfoForm.type"
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
              v-if="goodsType === GOODS_TYPE.DIY || goodsType === GOODS_TYPE.NORM"
              label="材质"
              label-width="160px"
              prop="raw_material"
            >
              <el-select v-model="baseinfoForm.raw_material" placeholder="请选择">
                <el-option
                  v-for="item in raw_material_list"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item
              v-if="goodsType === GOODS_TYPE.DIY || goodsType === GOODS_TYPE.NORM"
              label="品牌"
              label-width="160px"
              prop="brand"
            >
              <el-select
                v-model="baseinfoForm.brand"
                placeholder="请选择"
                @change="handlerBrandChange"
              >
                <el-option
                  v-for="item in phone_brand_list"
                  :key="item.brand_id"
                  :label="item.brand_name"
                  :value="item.brand_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item
              v-if="goodsType === GOODS_TYPE.DIY || goodsType === GOODS_TYPE.NORM"
              label="型号"
              label-width="160px"
              prop="model"
            >
              <el-select v-model="baseinfoForm.model" placeholder="请选择">
                <el-option
                  v-for="item in model_list"
                  :key="item.model_id"
                  :label="item.model_name"
                  :value="item.model_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="goodsType === GOODS_TYPE.GIFT"
              label="库存"
              label-width="160px"
              prop="inventory"
            >
              <el-input
                v-model.trim="baseinfoForm.inventory"
                v-limit-input-number="baseinfoForm.inventory"
                data-dotrange="{0,0}"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="单价" label-width="160px" prop="price">
              <el-input
                v-model.trim="baseinfoForm.price"
                v-limit-input-number="baseinfoForm.price"
                data-dotrange="{0,2}"
                placeholder="请输入"
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
                placeholder="请输入"
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
            <el-form-item label="图像高" label-width="160px" prop="height">
              <el-input
                v-model.trim="printinfoForm.height"
                v-limit-input-number="printinfoForm.height"
                placeholder="请输入"
              >
                <span slot="suffix" class="input-suffix-text">像素</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="四角弧度" label-width="160px" prop="radius">
              <el-input v-model.trim="printinfoForm.radius" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item label="图像宽" label-width="160px" prop="width">
              <el-input
                v-model.trim="printinfoForm.width"
                v-limit-input-number="printinfoForm.width"
                placeholder="请输入"
              >
                <span slot="suffix" class="input-suffix-text">像素</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="定位角" label-width="160px" prop="pos">
              <el-select v-model="printinfoForm.pos" placeholder="请选择">
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
            <el-form-item label="与横边距离" label-width="160px" prop="x_offset ">
              <el-input
                v-model.trim="printinfoForm.x_offset "
                v-limit-input-number="printinfoForm.x_offset "
                placeholder="请输入"
              >
                <span slot="suffix" class="input-suffix-text">像素</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="与纵边距离" label-width="160px" prop="y_offset ">
              <el-input
                v-model.trim="printinfoForm.y_offset "
                v-limit-input-number="printinfoForm.y_offset "
                placeholder="请输入"
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
          <el-table :data="basePicForm.opt_color_list" stripe border>
            <el-table-column prop="num" label="序号" width="80" align="center">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="color_name" label="颜色" min-width="80" align="center">
              <template slot-scope="scope">
                <el-form-item
                  class="pictable-form-item"
                  :rules="{
                    required: true, message: '颜色不能为空', trigger: 'blur'
                  }"
                  :prop="'opt_color_list.' + scope.$index + '.color_name'"
                >
                  <el-input v-model="scope.row.color_name" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="inventory" label="库存" min-width="80" align="center">
              <template slot-scope="scope">
                <el-form-item
                  class="pictable-form-item"
                  :rules="{validator: checkInventory,trigger: 'blur'}"
                  :prop="'opt_color_list.' + scope.$index + '.inventory'"
                >
                  <el-input v-model.trim="scope.row.inventory" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="color_img"
              :label="goodsType === GOODS_TYPE.DIY ? '底图' : '图片' "
              min-width="80"
              align="center"
            >
              <template slot-scope="scope">
                <el-form-item
                  class="pictable-form-item"
                  :rules="{required: true, message: `${goodsType === GOODS_TYPE.DIY ? '底图' : '图片'}不能为空`}"
                  :prop="'opt_color_list.' + scope.$index + '.color_img'"
                >
                  <sl-upload
                    class="outline-uploader"
                    :type="7"
                    @on-success="(res) => {return handlerOutlineImgSuccess(res,scope.row)}"
                  >
                    <img
                      v-if="scope.row.color_img"
                      :src="scope.row.color_img_url"
                      class="upload-preview"
                    >
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </sl-upload>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="goodsType === GOODS_TYPE.DIY"
              prop="outline_img"
              label="轮廓图"
              min-width="80"
              align="center"
            >
              <template slot-scope="scope">
                <el-form-item
                  class="pictable-form-item"
                  :rules="{required: true, message: '轮廓图不能为空'}"
                  :prop="'opt_color_list.' + scope.$index + '.outline_img'"
                >
                  <sl-upload
                    class="outline-uploader"
                    :type="3"
                    @on-success="(res) => {return handlerOutlineImgSuc(res,scope.row)}"
                  >
                    <img
                      v-if="scope.row.outline_img"
                      :src="scope.row.outline_img_url"
                      class="upload-preview"
                    >
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </sl-upload>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="opr" label="操作" min-width="45" align="center">
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
      <el-button class="btn-h-44-w-100 btn-bd-primary" @click="handlerGoBackClick">取消</el-button>
      <el-button
        class="btn-h-44-w-100"
        type="primary"
        @click="handlerSaveBtnClick"
      >{{ goods_id ? '保存' : '提交' }}</el-button>
    </div>
  </div>
</template>
<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import { GOODS_TYPE, GOODS_PRINT_POSITION } from '@/config/cfg'
import { goodsSave, goodsGet } from '@/api/api'
import { mapState } from 'vuex'
import SlUpload from '@/components/upload/index'

export default {
  components: {
    BaseinfoTitle,
    SlUpload
  },
  data() {
    const checkInventory = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('库存不能为空'))
      }
      const reg = /^\d+$/

      if (!reg.test(value)) {
        callback(new Error('库存只能为数字'))
      } else {
        callback()
      }
    }
    return {
      token: window.Store.GetGlobalData('token'),

      goods_id: '',
      goodsType: 1,

      baseinfoForm: {
        goods_name: '', // 商品名称
        type: '', // 商品种类
        raw_material: '', // 材质
        brand: '', // 品牌
        model: '', // 型号
        price: '', // 单价
        remark: '', // 备注
        inventory: '' // 商品库存
      },
      printinfoForm: {
        height: '', // 图像高
        width: '', // 图像宽
        radius: '', // 四角弧度
        pos: '', // 定位角
        x_offset: '', // 与横边距离
        y_offset: '' // 与纵边距离
      },

      // opt_color_list : [{ color_name: '', inventory: '', color_img: '', outline_img: '', } ]
      basePicForm: {
        opt_color_list: []
      },

      baseinfoFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择商品种类', trigger: 'change' }
        ],
        raw_material: [
          { required: true, message: '请选择材质', trigger: 'change' }
        ],
        brand: [{ required: true, message: '请选择品牌', trigger: 'change' }],
        model: [{ required: true, message: '请选择型号', trigger: 'change' }],
        price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
        inventory: [
          { required: true, message: '请输入商品库存', trigger: 'blur' }
        ]
      },

      printinfoFormRules: {
        height: [{ required: true, message: '请输入图像高', trigger: 'blur' }],
        width: [{ required: true, message: '请输入图像宽', trigger: 'blur' }],
        radius: [
          { required: true, message: '请输入四角弧度', trigger: 'blur' }
        ],
        pos: [{ required: true, message: '请选择定位角', trigger: 'change' }],
        x_offset: [
          { required: true, message: '请输入与横边距离', trigger: 'blur' }
        ],
        y_offset: [
          { required: true, message: '请输入与纵边距离', trigger: 'blur' }
        ]
      },

      GOODS_TYPE,
      model_list: [], // 手机型号 list

      // 商品种类
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

      // 定位角选项
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
      ],

      checkInventory
    }
  },
  computed: {
    ...mapState({
      phone_brand_list: state => state.user.phone_brand_list,
      raw_material_list: state => state.user.raw_material_list
    })
  },
  created() {
    if (this.$route.query.goodsid) {
      this.goods_id = this.$route.query.goodsid
      this.getGoodsInfo()
    }
  },
  methods: {
    handlerAddPicClick() {
      this.basePicForm.opt_color_list.push({
        color_name: '',
        inventory: '',
        color_img: '',
        outline_img: ''
      })
    },
    handlerDeletePicClick(item) {
      const index = this.basePicForm.opt_color_list.indexOf(item)
      if (index !== -1) {
        this.basePicForm.opt_color_list.splice(index, 1)
      }
    },
    handlerGoBackClick() {
      this.$router.go(-1)
    },
    handlerGoodsTypeChagne(val) {
      this.goodsType = val
    },
    validateForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate(valid => {
          resolve(valid)
        })
      })
    },
    async getGoodsInfo() {
      const data = {
        opr: 'get_goods_info',
        goods_id: this.goods_id
      }

      const resp = await goodsGet(data)
      console.log('商品信息 res=>', resp)

      if (resp.ret !== 0) return

      const info = resp.data.info

      this.goodsType = info.type

      this.baseinfoForm.goods_name = info.goods_name
      this.baseinfoForm.type = info.type
      this.baseinfoForm.raw_material = info.raw_material || ''
      this.baseinfoForm.brand = info.brand || ''
      // this.baseinfoForm.model = info.model || ''
      this.baseinfoForm.price = info.price
      this.baseinfoForm.remark = info.remark || ''
      this.baseinfoForm.inventory = info.inventory || ''

      if (this.goodsType === GOODS_TYPE.DIY) {
        this.printinfoForm.height = info.img_print_param.height
        this.printinfoForm.width = info.img_print_param.width
        this.printinfoForm.radius = info.img_print_param.radius
        this.printinfoForm.pos = info.img_print_param.pos
        this.printinfoForm.x_offset = info.img_print_param.x_offset
        this.printinfoForm.y_offset = info.img_print_param.y_offset
      }

      if (
        this.goodsType === GOODS_TYPE.DIY ||
        this.goodsType === GOODS_TYPE.NORM
      ) {
        this.basePicForm.opt_color_list = info.opt_color_list || []

        this.basePicForm.opt_color_list.forEach(item => {
          item.color_img_url = `${
            process.env.VUE_APP_BASEURL
          }/img_get.php?token=${this.token}&opr=get_img&width=44&height=64&type=7&img_name=${
            item.color_img
          }`
          item.outline_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${
            this.token
          }&opr=get_img&width=44&height=64&type=3&img_name=${item.outline_img}`
        })
      }

      this.handlerBrandChange(this.baseinfoForm.brand)
      this.baseinfoForm.model = info.model || ''
    },
    async handlerSaveBtnClick() {
      const data = {
        opr: 'save_goods_info'
      }

      if (this.goodsType === GOODS_TYPE.DIY) {
        const baseinfoValidate = await this.validateForm('baseinfoForm')
        const printinfoValidate = await this.validateForm('printinfoForm')
        const basePicValidate = await this.validateForm('basePicForm')

        if (!baseinfoValidate || !printinfoValidate || !basePicValidate) return

        data.goods_name = this.baseinfoForm.goods_name
        data.type = this.baseinfoForm.type
        data.raw_material = this.baseinfoForm.raw_material
        data.brand = this.baseinfoForm.brand
        data.model = this.baseinfoForm.model
        data.price = this.baseinfoForm.price
        data.remark = this.baseinfoForm.remark

        data.img_print_param = this.printinfoForm
        data.opt_color_list = this.basePicForm.opt_color_list
      } else if (this.goodsType === GOODS_TYPE.NORM) {
        const baseinfoValidate = await this.validateForm('baseinfoForm')
        const basePicValidate = await this.validateForm('basePicForm')

        if (!baseinfoValidate || !basePicValidate) return

        data.goods_name = this.baseinfoForm.goods_name
        data.type = this.baseinfoForm.type
        data.raw_material = this.baseinfoForm.raw_material
        data.brand = this.baseinfoForm.brand
        data.model = this.baseinfoForm.model
        data.price = this.baseinfoForm.price
        data.remark = this.baseinfoForm.remark
        data.opt_color_list = this.basePicForm.opt_color_list
      } else if (this.goodsType === GOODS_TYPE.GIFT) {
        const baseinfoValidate = await this.validateForm('baseinfoForm')

        if (!baseinfoValidate) return

        data.goods_name = this.baseinfoForm.goods_name
        data.type = this.baseinfoForm.type
        data.inventory = this.baseinfoForm.inventory
        data.price = this.baseinfoForm.price
        data.remark = this.baseinfoForm.remark
      }

      // 是否编辑
      if (this.goods_id) {
        data.goods_id = this.goods_id
      }

      console.log('商品保存 req=>', data)
      const resp = await goodsSave(data)
      console.log('商品保存 res=>', resp)

      if (resp.ret !== 0) return

      this.$notify({
        title: '成功',
        message: this.goods_id ? '保存成功' : '提交成功',
        type: 'success',
        duration: 2000
      })
      setTimeout(() => {
        this.$router.go(-1)
      }, 2000)
    },

    handlerOutlineImgSuccess({ img_name }, row) {
      row.color_img = img_name
      row.color_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${
        this.token
      }&opr=get_img&width=44&height=64&type=7&img_name=${img_name}`
    },
    handlerOutlineImgSuc({ img_name }, row) {
      row.outline_img = img_name
      row.outline_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${
        this.token
      }&opr=get_img&width=44&height=64&type=3&img_name=${img_name}`
    },
    handlerBrandChange(brand_id) {
      this.baseinfoForm.model = ''
      this.phone_brand_list.forEach(brand => {
        if (brand.brand_id === brand_id) {
          this.model_list = brand.model_list
        }
      })
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
    .el-table {
      /deep/ .el-table__body-wrapper {
        td {
          padding: 0;
        }
      }
    }
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
/deep/ .outline-uploader {
  line-height: 0;
  .el-upload {
    border: 1px dashed #e6e6e6;
    border-radius: 1px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #2584f9;
  }
  .avatar-uploader-icon {
    font-size: 30px;
    color: #2584f9;
    width: 44px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .upload-preview {
    width: 44px;
    height: 60px;
    display: block;
  }
}
</style>
