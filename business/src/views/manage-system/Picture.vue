<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="主题分类" prop="theme" label-width="70px">
          <el-select v-model="searchForm.theme" placeholder="请选择">
            <el-option key="全部" label="全部" value />
            <el-option v-for="item in theme_list" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态" prop="status" label-width="70px">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in picStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>-->
        <el-form-item label="素材名称" prop="material_name" label-width="70px">
          <el-input v-model="searchForm.material_name" placeholder="请输入" />
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
          <span>图库列表</span>
        </div>
        <div class="add-button-group">
          <el-button class="add-btn btn-h-38" type="primary" @click="handlerAddPicClick">新增</el-button>
        </div>
      </div>

      <div class="table-content default-table-change">
        <!-- table-content start -->
        <el-table :data="list" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />

          <!-- <el-table-column prop="business_name" label="商户" min-width="60" /> -->
          <el-table-column prop="material_name" label="素材名称" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.material_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="theme" label="主题分类" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.theme }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="material_img" label="缩略图" min-width="60">
            <template slot-scope="scope">
              <img class="table-cell-img" :src="scope.row.material_img_url" />
            </template>
          </el-table-column>
          <el-table-column prop="lastmodtime" label="上传时间" min-width="80">
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
                v-if="scope.row.status === PICTURE_STATUS.DISABLE"
                class="btn-green"
                type="text"
              >启用</el-button>
              <el-button
                v-if="scope.row.status === PICTURE_STATUS.NORMAL"
                class="btn-green"
                type="text"
              >停用</el-button>-->
              <el-button type="text" @click="handlerMaterialEditClick(scope.row)">编辑</el-button>
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <!-- 分页 end -->
      </div>

      <!-- 图片编辑弹窗 start -->
      <sl-dialog
        ref="pictureEditDialog"
        :title="editPictureId ? '编辑图片' : '新增图片'"
        :confirm-text="editPictureId ? '保存': '提交'"
        :validate="true"
        @confirm="handlerPicEditDialogConfirm"
        @close="handlerPicEditDialogClose"
      >
        <el-form
          ref="pictureForm"
          :rules="pictureFormRules"
          :model="pictureForm"
          class="picture-form"
          label-width="130px"
        >
          <el-form-item label="图片名称" prop="material_name">
            <el-input v-model="pictureForm.material_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="主题分类" prop="theme">
            <el-select v-model="pictureForm.theme" placeholder="请选择">
              <el-option v-for="item in theme_list" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item v-if="editPictureId" label="状态" prop="status">
            <el-select v-model="pictureForm.status" placeholder="请选择">
              <el-option
                v-for="item in picStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>-->
          <el-form-item label="图片" prop="material_img">
            <sl-upload class="outline-uploader" @on-success="handlerOutlineImgSuccess">
              <img
                v-if="pictureForm.material_img"
                :src="pictureForm.material_img_url"
                class="upload-preview"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </sl-upload>
          </el-form-item>
        </el-form>
      </sl-dialog>
      <!-- 图片编辑弹窗 end -->
    </div>
  </div>
</template>
<script>
import SlDialog from '@/components/Dialog/Dialog'
import moment from 'moment'
import { mapState } from 'vuex'
import { materialGet, materialSave } from '@/api/api'
import { PICTURE_STATUS } from '@/config/cfg'
import SlUpload from '@/components/upload/index'

export default {
  components: {
    SlDialog,
    SlUpload
  },
  data() {
    return {
      token: window.Store.GetGlobalData('token'),
      // search
      searchForm: {
        theme: '', // 图片分类
        // status: '',       // 状态
        material_name: '' // 素材名
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

      // picture dialog
      editPictureId: '',
      pictureForm: {
        material_name: '',
        theme: '',
        // status: '',
        material_img: '',
        material_img_url: ''
      },
      pictureFormRules: {
        material_name: [{ required: true, message: '请输入图片名称', trigger: 'blur' }],
        theme: [{ required: true, message: '请选择主题分类', trigger: 'change' }],
        // status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        material_img: [{ required: true, message: '请上传轮廓图' }]
      },

      // 图片使用状态 正常：1 停用：2
      picStatusOptions: [
        { label: '正常', value: 1 },
        { label: '停用', value: 2 }
      ],
      PICTURE_STATUS
    }
  },
  computed: {
    ...mapState({
      theme_list: (state) => state.user.theme_list,
      business_info: (state) => state.user.business_info
    }),
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    },
    business_id() {
      return (this.business_info || {}).business_id
    }
  },
  mounted() {
    this.getPictureList()
  },
  methods: {
    async getPictureList() {
      const data = {
        opr: 'get_material_list',
        page_no: this.listQuery.page
      }
      // 图片分类
      if (this.searchForm.theme) {
        data.theme = this.searchForm.theme
      }
      // // 状态
      // if (this.searchForm.status) {
      //   data.status = this.searchForm.status
      // }
      // 素材名
      if (this.searchForm.material_name) {
        data.material_name = this.searchForm.material_name
      }

      this.tableLoading = true

      console.log('图库列表 req=>', data)
      const resp = await materialGet(data)
      console.log('图库列表 res=>', resp)

      if (resp.ret !== 0) return
      this.list = resp.data.list || []
      this.total = resp.data.total

      this.list = this.list.map((item) => {
        if (item.lastmodtime) {
          item.lastmodtime_str = moment(item.lastmodtime * 1000).format('YYYY-MM-DD HH:mm:ss')
        }

        // if (item.status) {
        //   item.status_str = PICTURE_STATUS.toString(item.status)
        // }

        item.material_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=1&width=44&height=64&img_name=${item.material_img}`

        return item
      })
      this.tableLoading = false
    },
    handlerSearchClick() {
      this.listQuery.page = 1
      this.getPictureList()
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.getPictureList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getPictureList()
    },

    // 图片编辑弹窗
    handlerAddPicClick() {
      this.$refs.pictureEditDialog.show()
    },
    handlerOutlineImgSuccess({ img_name }) {
      this.pictureForm.material_img = img_name
      // http://f.pso.rockyshi.cn/php/img_get.php?token=TestToken&opr=get_img&type=1&img_name=d508bf88200289028d152ace532dbc6a.jpg
      this.pictureForm.material_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=1&width=117&height=140&img_name=${img_name}`
    },
    handlerPicEditDialogConfirm() {
      this.$refs.pictureForm.validate((valid) => {
        if (valid) {
          this.savePicture()
        }
      })
    },
    async savePicture() {
      const data = {
        opr: 'save_material',
        material_name: this.pictureForm.material_name,
        theme: this.pictureForm.theme,
        material_img: this.pictureForm.material_img,
        business_id: this.business_id
        // status: 1       // 默认启用
      }

      if (this.editPictureId) {
        // data.status = this.pictureForm.status
        data.material_id = this.editPictureId
      }

      console.log('保存图片 req=>', data)
      const resp = await materialSave(data)
      console.log('保存图片 res=>', resp)

      if (resp.ret !== 0) return

      this.$notify({
        title: '成功',
        message: this.editPictureId ? '保存成功' : '提交成功',
        type: 'success'
      })
      this.handlerPicEditDialogClose()
      this.$refs.pictureEditDialog.hide()
      this.getPictureList()
    },
    handlerMaterialEditClick(row) {
      this.editPictureId = row.material_id
      this.pictureForm.material_name = row.material_name
      this.pictureForm.theme = row.theme
      // this.pictureForm.status = row.status
      this.pictureForm.material_img = row.material_img
      this.pictureForm.material_img_url = row.material_img_url
      this.$refs.pictureEditDialog.show()
    },
    handlerPicEditDialogClose() {
      this.$refs.pictureForm.resetFields()
      this.editPictureId = ''
      this.pictureForm.material_name = ''
      this.pictureForm.theme = ''
      // this.pictureForm.status = ''
      this.pictureForm.material_img = ''
      this.pictureForm.material_img_url = ''
    },
    handlerDelClick(row) {
      const material_id = row.material_id
      this.$confirm('确认要删除选中素材？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delOpr(material_id)
        })
        .catch(() => {})
    },
    async delOpr(id) {
      const data = {
        opr: 'delete_material',
        material_id: id
      }

      const resp = await materialSave(data)
      if (resp.ret !== 0) return
      this.getPictureList()
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
  }
  .table-cell-img {
    width: 44px;
    height: 60px;
    vertical-align: middle;
  }
}
.picture-form {
  width: 430px;
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

