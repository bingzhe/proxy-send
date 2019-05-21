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
        <el-form-item label="状态" prop="status" label-width="70px">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option key="全部" label="全部" value />
            <el-option
              v-for="item in picStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
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
          <el-table-column prop="goods_id" label="缩略图" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastmodtime" label="上传时间" min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.lastmodtime_str }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="状态" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="opr" label="操作" width="160" align="center">
            <template slot-scope="scope">
              <el-button v-if="false" class="btn-green" type="text">启用</el-button>
              <el-button class="btn-green" type="text">停用</el-button>
              <el-button type="text" @click="handlerMaterialEditClick(scope.row)">编辑</el-button>
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
          <el-form-item v-if="editPictureId" label="状态" prop="status">
            <el-select v-model="pictureForm.status" placeholder="请选择">
              <el-option
                v-for="item in picStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="图片" prop="material_img">
            <el-upload
              class="outline-uploader"
              action="http://platform.jzzwlcm.com/php/img_save.php"
              :on-success="handlerOutlineImgSuccess"
              :before-upload="beforeOutlineImgUpload"
              :show-file-list="false"
              :data="{upload:1}"
              name="imgfile"
            >
              <img
                v-if="pictureForm.material_img"
                :src="pictureForm.material_img"
                class="upload-preview"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
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

export default {
  components: {
    SlDialog
  },
  data() {
    return {

      // search
      searchForm: {
        theme: '',            // 图片分类
        status: '',       // 状态
        material_name: ''     // 素材名
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
        status: '',
        material_img: ''
      },
      pictureFormRules: {
        material_name: [{ required: true, message: '请输入图片名称', trigger: 'blur' }],
        theme: [{ required: true, message: '请选择主题分类', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        material_img: [{ required: true, message: '请上传轮廓图' }]
      },

      picStatusOptions: [
        { label: '正常', value: 1 },
        { label: '停用', value: 2 }
      ]
    }
  },
  computed: {
    ...mapState({
      theme_list: state => state.user.theme_list
    }),
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
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
      // 状态
      if (this.searchForm.status) {
        data.status = this.searchForm.status
      }
      // 素材名
      if (this.searchForm.material_name) {
        data.material_name = this.searchForm.material_name
      }

      console.log('调接口 图库列表 req=>', data)
      const resp = await materialGet(data)
      console.log('调接口 图库列表 res=>', resp)

      if (resp.ret !== 0) return
      this.list = resp.data.list
      this.total = resp.data.total

      this.list.map(item => {
        if (item.lastmodtime) {
          item.lastmodtime_str = moment(item.lastmodtime * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }
        return item
      })
    },
    handlerSearchClick() {
      this.getPictureList()
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      // this.getList()
      //   PageSize.set(this.$route, val);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      // this.getList()
    },

    // 图片编辑弹窗
    handlerAddPicClick() {
      this.$refs.pictureEditDialog.show()
    },
    handlerOutlineImgSuccess(response, file, fileList) {
      const fileName = response.data.filename
      this.pictureForm.material_img = `http://platform.jzzwlcm.com/php/img_get.php?img=1&imgname=${fileName}`
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
    handlerPicEditDialogConfirm() {
      this.$refs.pictureForm.validate(valid => {
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
        material_img: this.pictureForm.material_img
      }

      if (this.editPictureId) {
        data.status = this.pictureForm.status
        data.material_id = this.editPictureId
      }

      console.log('保存图片 req=>', data)
      const resp = await materialSave(data)
      console.log('保存图片 res=>', resp)

      if (resp.ret === 0) return
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
      this.pictureForm.status = row.status
      this.pictureForm.material_img = row.material_img
      this.$refs.pictureEditDialog.show()
    },
    handlerPicEditDialogClose() {
      this.editPictureId = ''
      this.pictureForm.material_name = ''
      this.pictureForm.theme = ''
      this.pictureForm.status = ''
      this.pictureForm.material_img = ''
      this.$refs.pictureForm.resetFields()
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

