<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="品牌" prop="brand_name" label-width="45px">
          <el-input v-model.trim="searchForm.brand_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="型号" prop="model_name" label-width="70px">
          <el-input v-model.trim="searchForm.model_name" placeholder="请输入" />
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

          <el-table-column prop="brand_name" label="品牌名称" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.brand_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="model_name" label="型号" min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.model_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="outline_img" label="轮廓图" min-width="80" align="center">
            <template slot-scope="scope">
              <img class="table-cell-img" :src="scope.row.outline_img_url">
            </template>
          </el-table-column>
          <el-table-column prop="lastmodtime" label="更新时间" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.lastmodtime_str }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="status" label="状态" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.status_str }}</span>
            </template>
          </el-table-column>-->
          <el-table-column prop="opr" label="操作" width="160" align="center">
            <template slot-scope="scope">
              <!-- <el-button
                v-if="scope.row.status === PHONE_STATUS.DISABLE"
                class="btn-green"
                type="text"
              >启用</el-button>
              <el-button
                v-if="scope.row.status === PHONE_STATUS.NORMAL"
                class="btn-green"
                type="text"
              >停用</el-button>-->
              <el-button type="text" @click="handlerModelEditClick(scope.row)">编辑</el-button>
              <el-button class="btn-red" type="text danger" @click="handlerDelClick(scope.row)">删除</el-button>
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
        <el-form-item label="品牌" prop="brand_id">
          <el-select v-model="modelForm.brand_id" placeholder="请选择">
            <el-option
              v-for="item in phoneBrandOptions"
              :key="item.brand_id"
              :label="item.brand_name"
              :value="item.brand_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="型号名称" prop="model_name">
          <el-input v-model.trim="modelForm.model_name" placeholder="请输入" />
        </el-form-item>
        <!-- <el-form-item label="边框圆角" prop="border_radius">
          <el-input v-model="modelForm.border_radius" placeholder="请输入">
            <span slot="suffix" class="input-suffix-text">像素</span>
          </el-input>
        </el-form-item>-->
        <el-form-item label="轮廓图" prop="outline_img">
          <sl-upload class="outline-uploader" type="3" @on-success="handlerOutlineImgSuccess">
            <img
              v-if="modelForm.outline_img"
              :src="modelForm.outline_img_url"
              class="upload-preview"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </sl-upload>
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
        <el-form-item label="品牌名称" prop="brand_name">
          <el-input
            v-model.trim="brandForm.brand_name"
            placeholder="请输入"
            @input="handlerBrandInput"
          />
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
import {
  phonemodelGet,
  phonemodelSave,
  phonebrandGet,
  phonebrandSave
} from '@/api/api'
import { PHONE_STATUS } from '@/config/cfg'
import moment from 'moment'
import SlUpload from '@/components/upload/index'

export default {
  components: {
    SlDialog,
    SlUpload
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
      token: window.Store.GetGlobalData('token'),

      searchForm: {
        brand_name: '',     // 品牌
        model_name: ''     // 型号
      },

      list: [],
      multipleSelection: [],
      tableLoading: false,
      // 分页
      total: 100, // 分页总条数
      listQuery: {
        page: 1,
        limit: 20
      },

      // modelDilaog
      editModelId: '',
      modelForm: {
        brand_id: '',           // 品牌
        model_name: '',         // 型号
        // border_radius: '',   // 四角弧度
        outline_img: '',        // 轮廓图
        outline_img_url: ''
        // status: ''              // 正常 1 停用 2
      },
      brandForm: {
        brand_name: ''      // 品牌
      },
      modelFormRules: {
        brand_id: [{ required: true, message: '请选择品牌', trigger: 'change' }],
        model_name: [{ required: true, message: '请输入型号名称', trigger: 'blur' }],
        // border_radius: [{ required: true, message: '请输入边框圆角', trigger: 'blur' }],
        outline_img: [{ required: true, message: '请上传轮廓图' }]
      },
      brandFormRules: {
        brand_name: [
          { required: true, message: '请输入品牌', trigger: 'blur' },
          { validator: validateBrand, trigger: 'blur' }
        ]
      },
      phoneBrandOptions: [],
      PHONE_STATUS
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
    async getPhoneModelList() {
      const data = {
        opr: 'get_phone_model_list',
        page_no: this.listQuery.page
      }

      // 品牌
      if (this.searchForm.brand_name) {
        data.brand_name = this.searchForm.brand_name
      }
      // 型号
      if (this.searchForm.model_name) {
        data.model_name = this.searchForm.model_name
      }

      this.tableLoading = true

      console.log('手机型号list req=>', data)
      const resp = await phonemodelGet(data)
      console.log('手机型号list res=>', resp)

      if (resp.ret !== 0) return
      this.tableLoading = false

      this.list = resp.data.list
      this.total = resp.data.total

      this.list = this.list.map(item => {
        if (item.lastmodtime) {
          item.lastmodtime_str = moment(item.lastmodtime * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }

        // if (item.status) {
        //   item.status_str = PHONE_STATUS.toString(item.status)
        // }

        item.outline_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${
          this.token
        }&opr=get_img&type=3&img_name=${item.outline_img}`

        return item
      })
    },
    async getBrandList() {
      const data = {
        opr: 'get_phone_brand_list'
      }

      // console.log('品牌list req=>', data)
      const resp = await phonebrandGet(data)
      console.log('品牌list res=>', resp)

      if (resp.ret !== 0) return

      this.phoneBrandOptions = resp.data.list
    },
    handlerSearchClick() {
      this.listQuery.page = 1
      this.getPhoneModelList()
    },
    // 多选
    handlerSelectionChange(val) {
      this.multipleSelection = val
    },
    handlerSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.getPhoneModelList()
    },
    handlerCurrentChange(val) {
      this.listQuery.page = val
      this.getPhoneModelList()
    },

    // 型号添加弹窗
    handlerModelEditClick(row) {
      this.editModelId = row.model_id
      this.modelForm.model_name = row.model_name
      this.modelForm.outline_img = row.outline_img
      this.modelForm.outline_img_url = row.outline_img_url
      this.modelForm.brand_id = row.brand_id
      this.$refs.modelEditDialog.show()
    },
    handlerAddModelClick() {
      this.$refs.modelEditDialog.show()
    },
    handlerOutlineImgSuccess({ img_name }) {
      this.modelForm.outline_img = img_name
      this.modelForm.outline_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${
        this.token
      }&opr=get_img&type=3&img_name=${img_name}`
    },
    handlerModelEditDialogClose() {
      this.$refs.modelForm.resetFields()
      this.editModelId = ''
      this.modelForm.model_name = ''
      this.modelForm.outline_img = ''
      this.modelForm.outline_img_url = ''
      this.modelForm.brand_id = ''
    },
    handlerModelEditDialogConfirm() {
      this.$refs.modelForm.validate(valid => {
        if (valid) {
          this.savePhoneModel()
        }
      })
    },
    async savePhoneModel() {
      const data = {
        opr: 'save_phone_model',
        brand_id: this.modelForm.brand_id,
        model_name: this.modelForm.model_name,
        // border_radius: this.modelForm.border_radius,
        outline_img: this.modelForm.outline_img
        // status: 1       // 默认启用
      }

      if (this.editModelId) {
        data.model_id = this.editModelId
      }

      console.log('保存手机型号 req=>', data)
      const resp = await phonemodelSave(data)
      console.log('保存手机型号 res=>', resp)

      if (resp.ret !== 0) return

      this.$notify({
        title: '成功',
        message: this.editModelId ? '保存成功' : '提交成功',
        type: 'success'
      })
      this.handlerModelEditDialogClose()
      this.$refs.modelEditDialog.hide()
      this.getPhoneModelList()

      /**
       * 更新页面全局数据
       */
      this.$store.dispatch('user/getUserInfo')
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
          this.saveBrand()
        }
      })
    },
    async saveBrand() {
      const data = {
        opr: 'save_phone_brand',
        brand_name: this.brandForm.brand_name
      }

      // console.log('品牌保存 req=>', data)
      const resp = await phonebrandSave(data)
      // console.log('品牌保存 res=>', resp)

      if (resp.ret !== 0) return

      this.brandForm.brand_name = ''
      this.getBrandList()
      /**
       * 更新页面全局数据
       */
      this.$store.dispatch('user/getUserInfo')
    },
    handlerBrandEditDialogClose() {
      this.$refs.brandForm.resetFields()
    },
    handlerBrandInput() {
      this.$refs.brandForm.clearValidate()
    },
    async handlerBrandDeleteClick(brand) {
      const data = {
        opr: 'delete_phone_brand',
        brand_id: brand.brand_id
      }

      console.log('删除品牌 req=>', data)

      const resp = await phonebrandSave(data)
      if (resp.ret !== 0) return

      this.getBrandList()
    },
    handlerDelClick(row) {
      const model_id = row.model_id
      this.$confirm('确认要删除选中型号？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delOpr(model_id)
      }).catch(() => { })
    },
    async delOpr(id) {
      const data = {
        opr: 'delete_phone_model',
        model_id: id
      }

      const resp = await phonemodelSave(data)
      if (resp.ret !== 0) return
      this.getPhoneModelList()
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success'
      })
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
  /deep/ td {
    padding: 4px 0;

    .table-cell-img {
      width: 44px;
      height: 60px;
      vertical-align: middle;
    }
  }
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
      margin-bottom: 10px;

      &:first-child {
        margin-left: 10px;
      }

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

