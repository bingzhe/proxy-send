<template>
  <div class="printinfo-wrapper">
    <div class="printinfo-pic-name">{{ picPosition }}</div>
    <el-form ref="printinfoForm" :model="printinfoForm" :rules="printinfoFormRules">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="图像高" label-width="100px" prop="height">
            <el-input
              v-model.trim="printinfoForm.height"
              v-limit-input-number="printinfoForm.height"
              placeholder="请输入"
            >
              <span slot="suffix" class="input-suffix-text">像素</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="图像宽" label-width="100px" prop="width">
            <el-input
              v-model.trim="printinfoForm.width"
              v-limit-input-number="printinfoForm.width"
              placeholder="请输入"
            >
              <span slot="suffix" class="input-suffix-text">像素</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="与横边距离" label-width="100px" prop="x_offset">
            <el-input
              v-model.trim="printinfoForm.x_offset"
              v-limit-input-number="printinfoForm.x_offset"
              placeholder="请输入"
            >
              <span slot="suffix" class="input-suffix-text">像素</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="与纵边距离" label-width="100px" prop="y_offset">
            <el-input
              v-model.trim="printinfoForm.y_offset"
              v-limit-input-number="printinfoForm.y_offset"
              placeholder="请输入"
            >
              <span slot="suffix" class="input-suffix-text">像素</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="四角弧度" label-width="100px" prop="radius">
            <el-input v-model.trim="printinfoForm.radius" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="定位角" label-width="100px" prop="pos">
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
        <el-col v-if="hasPriceItem" :span="6">
          <el-form-item label="打印价" label-width="100px" prop="price">
            <el-input
              v-model.trim="printinfoForm.price"
              v-limit-input-number="printinfoForm.price"
              data-dotrange="{0,2}"
              placeholder="请输入"
            >
              <span slot="suffix" class="input-suffix-text">元</span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { goodsPrintPositoinOptions } from './goods'

export default {
  props: {
    picPosition: {
      type: String,
      required: true
    },
    hasPriceItem: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      printinfoForm: {
        height: '', // 图像高
        width: '', // 图像宽
        radius: '', // 四角弧度
        pos: '', // 定位角
        x_offset: '', // 与横边距离
        y_offset: '', // 与纵边距离
        price: '' // 打印价（元）
      },
      printinfoFormRules: {
        height: [{ required: true, message: '请输入图像高', trigger: 'blur' }],
        width: [{ required: true, message: '请输入图像宽', trigger: 'blur' }],
        radius: [{ required: true, message: '请输入四角弧度', trigger: 'blur' }],
        pos: [{ required: true, message: '请选择定位角', trigger: 'change' }],
        x_offset: [{ required: true, message: '请输入与横边距离', trigger: 'blur' }],
        y_offset: [{ required: true, message: '请输入与纵边距离', trigger: 'blur' }],
        price: [{ required: true, message: '请输入打印价格', trigger: 'blur' }]
      },

      // 定位角选项
      goodsPrintPositoinOptions
    }
  },
  methods: {
    validateForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid) => {
          resolve(valid)
        })
      })
    },
    async getPrintParam() {
      const printinfoValidate = await this.validateForm('printinfoForm')
      if (printinfoValidate) {
        return this.printinfoForm
      }
    },
    setPrintParam(data) {
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          this.printinfoForm[key] = data[key]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.printinfo-wrapper {
  padding-left: 30px;
  padding-right: 60px;
  display: flex;

  .printinfo-pic-name {
    writing-mode: vertical-lr;
    writing-mode: tb-lr;
    text-align: center;
    width: 52px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
    line-height: 50px;
    border-right: 2px solid #eee;
    letter-spacing: 4px;
    margin-bottom: 22px;
  }
}
// .el-input {
//   width: 130px;
// }
// .el-select {
//   width: 130px;
// }
.input-suffix-text {
  color: #333;
  margin-right: 10px;
}
</style>
