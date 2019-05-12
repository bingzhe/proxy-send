<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <div class="search-bottom-wrapper clearfix">
        <!-- 主题分类 -->
        <div class="search-item">
          <div class="search-label">
            <span>主题分类</span>
          </div>
          <div class="search-value">
            <el-select v-model="pic_type" placeholder="请选择">
              <el-option key="全部" label="全部" value />
              <el-option v-for="item in picTypeOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
        </div>

        <!-- 状态 -->
        <div class="search-item">
          <div class="search-label">
            <span>状态</span>
          </div>
          <div class="search-value">
            <el-select v-model="pic_status" placeholder="请选择">
              <el-option key="全部" label="全部" value />
              <el-option
                v-for="item in picStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>

        <!-- 素材名称 -->
        <div class="search-item">
          <div class="search-label">
            <span>素材名称</span>
          </div>
          <div class="search-value">
            <el-input v-model="pic_name" placeholder="请输入" />
          </div>
        </div>

        <el-button type="primary" class="btn-h-38" @click="handlerSearchClick">查询</el-button>
      </div>
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

          <el-table-column prop="goods_id" label="素材名称" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="主题分类" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="缩略图" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="上传时间" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="状态" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_id" label="操作" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
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
          <el-form-item label="图片名称" prop="pic_name">
            <el-input v-model="pictureForm.pic_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="主题分类" prop="pic_type">
            <el-select v-model="pictureForm.pic_type" placeholder="请选择">
              <el-option v-for="item in picTypeOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="editPictureId" label="状态" prop="pic_status">
            <el-select v-model="pictureForm.pic_status" placeholder="请选择">
              <el-option
                v-for="item in picStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="图片" prop="pic_img">
            <el-upload
              class="outline-uploader"
              action="http://platform.jzzwlcm.com/php/img_save.php"
              :on-success="handlerOutlineImgSuccess"
              :before-upload="beforeOutlineImgUpload"
              :show-file-list="false"
              :data="{upload:1}"
              name="imgfile"
            >
              <img v-if="pictureForm.pic_img" :src="pictureForm.pic_img" class="upload-preview">
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

export default {
  components: {
    SlDialog
  },
  data() {
    return {

      // search
      pic_type: '',
      pic_status: '',
      pic_name: '',

      list: [
        {
          goods_id: '123'
        }, {}, {}
        // {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
      ],
      multipleSelection: [],
      tableLoading: false,
      // 分页
      total: 100, // 分页总条数
      listQuery: {
        page: 1,
        limit: 10
      },

      // picture dialog
      editPictureId: '',
      pictureForm: {
        pic_name: '',
        pic_type: '',
        pic_status: '',
        pic_img: ''
      },
      pictureFormRules: {
        pic_name: [
          { required: true, message: '请输入图片名称', trigger: 'blur' }
        ],
        pic_type: [
          { required: true, message: '请选择主题分类', trigger: 'change' }
        ],
        pic_status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        pic_img: [
          { required: true, message: '请上传轮廓图' }
        ]
      },
      picTypeOptions: ['美女', '游戏'],
      picStatusOptions: [{
        label: '启用',
        value: 1
      }, {
        label: '停用',
        value: 0
      }]
    }
  },
  computed: {
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  mounted() {
    this.getPictureList()
  },
  methods: {
    getPictureList() {
      const data = {}

      if (this.pic_type) {
        data.pic_type = this.pic_type
      }

      if (this.pic_status || this.pic_status === 0) {
        data.pic_status = this.pic_status
      }

      if (this.pic_name) {
        data.pic_name = this.pic_name
      }
      /**
       * 调接口 图库列表
       * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
       */
      console.log('调接口 图库列表 req=>', data)
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
      this.pictureForm.pic_img = `http://platform.jzzwlcm.com/php/img_get.php?img=1&imgname=${fileName}`
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
    handlerPicEditDialogClose() {
      this.$refs.pictureForm.resetFields()
    },
    savePicture() {
      const data = {
        pic_name: this.pictureForm.pic_name,
        pic_type: this.pictureForm.pic_type,
        pic_img: this.pictureForm.pic_img
      }

      if (this.editPictureId) {
        data.pic_status = this.pictureForm.pic_status
      }

      console.log('保存图片 req=>', data)
      /**
       * 调接口 保存图片
       * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
       */
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

  .search-item {
    float: left;
    margin: 0 20px 20px 0;
    .search-label {
      width: 72px;
      text-align: right;
      color: #333;
      float: left;
      font-size: 14px;
      line-height: 38px;
      padding-right: 12px;
    }
    .search-value {
      float: left;
      width: 180px;
    }
  }
}

.el-table {
  min-height: 400px;
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
</style>

