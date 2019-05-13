<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="品牌" prop="phone_brand" label-width="70px">
          <el-input v-model.trim="searchForm.phone_brand" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="型号" prop="phone_model" label-width="70px">
          <el-input v-model.trim="searchForm.phone_model" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button class="btn-h-38" type="primary" @click="handlerSearchClick">查询</el-button>
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
          <span>手机机型列表</span>
        </div>
        <div class="add-button-group">
          <el-button class="add-btn btn-h-38" type="primary" @click="handlerAddBrandClick">新增品牌</el-button>
          <el-button class="add-btn btn-h-38" type="primary" @click="handlerAddModelClick">新增型号</el-button>
        </div>
      </div>

      <div class="table-content default-table-change">
        <!-- table-content start -->
        <el-table :data="list" stripe @selection-change="handlerSelectionChange">
          <el-table-column type="selection" align="center" width="55" />

          <el-table-column prop="goods_id" label="品牌名称" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="型号" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="轮廓图" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="更新时间" min-width="60">
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
              <el-button class="btn-green" type="text">启用</el-button>
              <el-button class="btn-green" type="text">停用</el-button>
              <el-button type="text">编辑</el-button>
              <el-button class="btn-red" type="text danger">删除</el-button>
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
            @size-change="handlerSizeChange"
            @current-change="handlerCurrentChange"
          />
        </div>
        <!-- 分页 end -->
      </div>
    </div>

    <!-- 型号添加弹窗 -->
    <sl-dialog
      ref="modelEditDialog"
      :title="editModelId ? '编辑型号': '新增型号'"
      :confirm-text="editModelId ? '保存': '提交'"
      :validate="true"
      @confirm="handlerModelEditDialogConfirm"
      @close="handlerModelEditDialogClose"
    >
      <el-form
        ref="modelForm"
        :rules="modelFormRules"
        :model="modelForm"
        class="model-form"
        label-width="130px"
      >
        <el-form-item label="品牌" prop="phone_brand">
          <el-select v-model="modelForm.phone_brand" placeholder="请选择">
            <el-option
              v-for="item in phoneBrandOptions"
              :key="item.brand_id"
              :label="item.brand_name"
              :value="item.brand_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="型号名称" prop="phone_model">
          <el-input v-model="modelForm.phone_model" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="边框圆角" prop="border_radius">
          <el-input v-model="modelForm.border_radius" placeholder="请输入">
            <span slot="suffix" class="input-suffix-text">像素</span>
          </el-input>
        </el-form-item>
        <el-form-item label="轮廓图" prop="outline_img">
          <el-upload
            class="outline-uploader"
            action="http://platform.jzzwlcm.com/php/img_save.php"
            :on-success="handlerOutlineImgSuccess"
            :before-upload="beforeOutlineImgUpload"
            :show-file-list="false"
            :data="{upload:1}"
            name="imgfile"
          >
            <img v-if="modelForm.outline_img" :src="modelForm.outline_img" class="upload-preview">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
    </sl-dialog>

    <!-- 品牌信息维护弹窗 -->
    <sl-dialog
      ref="brandEditDialog"
      title="品牌信息维护"
      :show-footer="false"
      @close="handlerBrandEditDialogClose"
    >
      <el-form
        ref="brandForm"
        class="brand-form"
        :inline="true"
        :model="brandForm"
        :rules="brandFormRules"
      >
        <el-form-item label="品牌名称" prop="phone_brand">
          <el-input v-model="brandForm.phone_brand" placeholder="请输入" @input="handlerBrandInput" />
        </el-form-item>
        <el-form-item>
          <el-button class="btn-h-38" type="primary" @click="handlerDialogAddBrandClick">新增</el-button>
        </el-form-item>
      </el-form>
      <div class="brand-wrapper">
        <div class="brand-wrapper-title">已有品牌</div>
        <div class="brand-wrapper-list">
          <el-button v-for="brand in phoneBrandOptions" :key="brand.brand_id">
            {{ brand.brand_name }}
            <i
              class="el-icon--right el-icon-close"
              @click="handlerBrandDeleteClick(brand)"
            />
          </el-button>
        </div>
      </div>
    </sl-dialog>
  </div>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'

export default {
  components: {
    SlDialog
  },
  data() {
    /**
     * 校验品牌名重复
     */
    const validateBrand = (rule, value, callback) => {
      const brandList = this.phoneBrandOptions.map(brand => brand.brand_name)
      if (brandList.indexOf(value) !== -1) {
        callback(new Error('品牌名重复'))
      } else {
        callback()
      }
    }

    return {

      searchForm: {
        phone_brand: '',     // 品牌
        phone_model: ''     // 型号
      },

      list: [
        {
          goods_id: '123'
        }, {}, {}
      ],
      multipleSelection: [],
      tableLoading: false,
      // 分页
      total: 100, // 分页总条数
      listQuery: {
        page: 1,
        limit: 10
      },

      // modelDilaog
      editModelId: '',
      modelForm: {
        phone_brand: '',     // 品牌
        phone_model: '',     // 型号
        border_radius: '',   // 四角弧度
        outline_img: ''      // 轮廓图
      },
      brandForm: {
        phone_brand: ''      // 品牌
      },
      modelFormRules: {
        phone_brand: [
          { required: true, message: '请选择品牌', trigger: 'change' }
        ],
        phone_model: [
          { required: true, message: '请输入型号名称', trigger: 'blur' }
        ],
        border_radius: [
          { required: true, message: '请输入边框圆角', trigger: 'blur' }
        ],
        outline_img: [
          { required: true, message: '请上传轮廓图' }
        ]
      },
      brandFormRules: {
        phone_brand: [
          { required: true, message: '请输入品牌', trigger: 'blur' },
          { validator: validateBrand, trigger: 'blur' }
        ]
      },
      phoneBrandOptions: [{
        brand_name: '华为',
        brand_id: '1'
      }, {
        brand_name: '苹果',
        brand_id: '2'
      }, {
        brand_name: '小米',
        brand_id: '3'
      }, {
        brand_name: 'OPPO',
        brand_id: '4'
      }]
    }
  },
  computed: {
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  mounted() {
    this.getPhoneModelList()
    this.getBrandList()
  },
  methods: {
    getPhoneModelList() {
      const data = {}

      // 品牌
      if (this.searchForm.phone_brand) {
        data.phone_brand = this.searchForm.phone_brand
      }
      // 型号
      if (this.searchForm.phone_model) {
        data.phone_model = this.searchForm.phone_model
      }

      /**
       * 调接口 手机型号list
       * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
       */
      console.log('调接口 手机型号list req=>', data)
    },
    getBrandList() {
      /**
       * 调接口 品牌list
       * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
       */
      console.log('调接口 品牌list')
    },
    handlerSearchClick() {
      this.getPhoneModelList()
    },
    // 多选
    handlerSelectionChange(val) {
      this.multipleSelection = val
    },
    handlerSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      // this.getList()
      //   PageSize.set(this.$route, val);
    },
    handlerCurrentChange(val) {
      this.listQuery.page = val
      // this.getList()
    },

    // 型号添加弹窗
    handlerAddModelClick() {
      this.$refs.modelEditDialog.show()
    },
    handlerOutlineImgSuccess(response, file, fileList) {
      const fileName = response.data.filename
      this.modelForm.outline_img = `http://platform.jzzwlcm.com/php/img_get.php?img=1&imgname=${fileName}`
    },
    beforeOutlineImgUpload(file) {
      // console.log('beforeOutlineImgUpload file', file)
      // const isJPG = file.type === 'image/jpeg';
      const isLt5M = file.size / 1024 / 1024 < 5

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt5M) {
        this.$message.error('上传轮廓图大小不能超过 5MB!')
      }
      return isLt5M
    },
    handlerModelEditDialogClose() {
      this.$refs.modelForm.resetFields()
    },
    handlerModelEditDialogConfirm() {
      this.$refs.modelForm.validate(valid => {
        if (valid) {
          this.savePhoneModel()
        }
      })
    },
    savePhoneModel() {
      const data = {
        phone_brand: this.modelForm.phone_brand,
        phone_model: this.modelForm.phone_model,
        border_radius: this.modelForm.border_radius,
        outline_img: this.modelForm.outline_img
      }

      console.log('保存手机型号 req=>', data)
      /**
       * 调接口 保存手机型号
       * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
       */
    },
    /**
     *  品牌维护弹窗
     */
    handlerAddBrandClick() {
      this.$refs.brandEditDialog.show()
    },
    handlerDialogAddBrandClick() {
      this.$refs.brandForm.validate(valid => {
        if (valid) {
          const data = {
            phone_brand: this.brandForm.phone_brand
          }

          console.log('保存品牌 req=>', data)

          /**
           * 调接口 保存品牌
           * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
           */
          this.getBrandList()
        }
      })
    },
    handlerBrandEditDialogClose() {
      this.$refs.brandForm.resetFields()
    },
    handlerBrandInput() {
      this.$refs.brandForm.clearValidate()
    },
    handlerBrandDeleteClick(brand) {
      const data = {
        brand_id: brand.brand_id
      }

      console.log('删除品牌 req=>', data)
      /**
       * 调接口 删除品牌
       * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
       */
      this.getBrandList()
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
}
.el-table {
  min-height: 400px;
}
.model-form {
  width: 430px;
}
.input-suffix-text {
  color: #333;
  margin-right: 10px;
}
.brand-form {
  text-align: center;
  .el-input {
    width: 300px;
  }
}

.brand-wrapper {
  margin: 10px 60px 0;

  .brand-wrapper-title {
    font-size: 14px;
    color: #333;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .brand-wrapper-list {
    min-height: 150px;
    /deep/ .el-button {
      padding: 11px 11px 11px 19px;
      cursor: auto;
      .el-icon-close {
        cursor: pointer;
      }
      .el-icon--right {
        margin-left: 18px;
      }
      &:hover {
        background: #ffffff;
        color: #333;
        border-color: #dcdfe6;

        .el-icon-close {
          color: #2584f9;
        }
      }
      &:focus {
        background: #ffffff;
        color: #333;
        border-color: #dcdfe6;
      }
    }
  }
}
/deep/ .outline-uploader {
  .el-upload {
    border: 1px dashed #e6e6e6;
    border-radius: 6px;
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
    width: 117px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }
  .upload-preview {
    width: 117px;
    height: 140px;
    display: block;
  }
}
// 图片没有上传提示
// .el-form-item.is-error {
//   .outline-uploader {
//     /deep/ .el-upload {
//       border-color: #f56c6c;
//     }
//   }
// }
.btn-green {
  color: #1a9901;
}
.btn-red {
  color: #e33119;
}
</style>

