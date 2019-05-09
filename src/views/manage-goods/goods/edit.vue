<template>
  <div class="app-container">
    <div class="title-wrapper">
      <span class="title-text">添加新商品</span>
      <el-button class="btn-bd-primary">返回</el-button>
    </div>
    <div class="baseinfo-form-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#F348A1" text="基本信息" />
      </div>
      <el-form ref="baseinfoForm" :model="baseinfoForm" :rules="baseinfoFormRules">
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item label="商品名称" label-width="160px" prop="goods_name">
              <el-input v-model="baseinfoForm.goods_name" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="商品种类" label-width="160px" prop="goods_type">
              <el-select v-model="baseinfoForm.goods_type" placeholder="请选择">
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
            <el-form-item label="材质" label-width="160px" prop="goods_material">
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
            <el-form-item label="品牌" label-width="160px" prop="brand">
              <el-input v-model="baseinfoForm.brand" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item label="型号" label-width="160px" prop="model">
              <el-input v-model="baseinfoForm.model" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="单价" label-width="160px" prop="price">
              <el-input
                v-model.trim="baseinfoForm.price"
                v-limit-input-number="baseinfoForm.price"
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
    <div class="printinfo-form-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#F348A1" text="打印参数" />
      </div>
      <el-form>
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item label="图像高" label-width="160px">
              <el-input placeholder="请输入内容">
                <span slot="suffix" class="input-suffix-text">像素</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="四角弧度" label-width="160px">
              <el-input placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item label="图像宽" label-width="160px">
              <el-input placeholder="请输入内容">
                <span slot="suffix" class="input-suffix-text">像素</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="定位角" label-width="160px">
              <el-select v-model="goodsPrintPositoin" placeholder="请选择">
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
            <el-form-item label="与横边距离" label-width="160px">
              <el-input placeholder="请输入内容">
                <span slot="suffix" class="input-suffix-text">像素</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="与横边距离" label-width="160px">
              <el-input placeholder="请输入内容">
                <span slot="suffix" class="input-suffix-text">像素</span>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="base-pic-wrapper">
      <div class="base-pic-title-wrapper">
        <baseinfo-title color="#F3C148" text="底图颜色" />
        <div class="add-btn-wrapper">
          <!-- <span class="add-btn-icon" /> -->
          <i class="el-icon-circle-plus" />
          <span class="add-btn-text">新增</span>
        </div>
      </div>
      <div class="base-pic-table-wrapper default-table-change">
        <el-table :data="basePicList" stripe border>
          <el-table-column prop="num" label="序号" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="颜色" min-width="80" align="center">
            <template slot-scope="scope">
              <el-input />
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="库存" min-width="80" align="center">
            <template slot-scope="scope">
              <el-input />
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="图片" min-width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="操作" min-width="45" align="center">
            <template slot-scope="scope">
              <el-button class="text-btn" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="gray-border-bottom" />

    <div class="button-group-wrapper">
      <el-button class="btn-h-44-w-100 btn-bd-primary">取消</el-button>
      <el-button class="btn-h-44-w-100" type="primary">提交</el-button>
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
      baseinfoForm: {
        goods_name: '',            // 商品名称
        goods_type: '',            // 商品种类
        goods_material: '',        // 材质
        brand: '',                 // 品牌
        model: '',                 // 型号
        price: '',                 // 单价
        remark: ''                 // 备注
      },

      baseinfoFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_type: [
          { required: true, message: '请选择商品种类', trigger: 'change' }
        ],
        goods_material: [
          { required: true, message: '请选择材质', trigger: 'change' }
        ],
        brand: [
          { required: true, message: '请选择品牌', trigger: 'change' }
        ],
        model: [
          { required: true, message: '请选择型号', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ]
      },

      basePicList: [{}, {}],

      value: '',
      goodsType: '',
      goodsTypeOptions: [{
        value: GOODS_TYPE.DIY,
        label: GOODS_TYPE.toString(GOODS_TYPE.DIY)
      }, {
        value: GOODS_TYPE.NORM,
        label: GOODS_TYPE.toString(GOODS_TYPE.NORM)
      }, {
        value: GOODS_TYPE.GIFT,
        label: GOODS_TYPE.toString(GOODS_TYPE.GIFT)
      }],

      goodsMaterial: '',
      goodsMaterialOptions: [{
        value: GOODS_MATERIAL.GLASS,
        label: GOODS_MATERIAL.toString(GOODS_MATERIAL.GLASS)
      },
      {
        value: GOODS_MATERIAL.SILICONE,
        label: GOODS_MATERIAL.toString(GOODS_MATERIAL.SILICONE)
      }],

      goodsPrintPositoin: '',
      goodsPrintPositoinOptions: [{
        value: GOODS_PRINT_POSITION.LEFT_TOP,
        label: GOODS_PRINT_POSITION.toString(GOODS_PRINT_POSITION.LEFT_TOP)
      }, {
        value: GOODS_PRINT_POSITION.LEFT_BOTTOM,
        label: GOODS_PRINT_POSITION.toString(GOODS_PRINT_POSITION.LEFT_BOTTOM)
      }, {
        value: GOODS_PRINT_POSITION.RIGHT_TOP,
        label: GOODS_PRINT_POSITION.toString(GOODS_PRINT_POSITION.RIGHT_TOP)
      }, {
        value: GOODS_PRINT_POSITION.RIGHT_BOTTOM,
        label: GOODS_PRINT_POSITION.toString(GOODS_PRINT_POSITION.RIGHT_BOTTOM)
      }]

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

