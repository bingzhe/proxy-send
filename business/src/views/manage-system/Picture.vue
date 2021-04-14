<template>
  <div class="app-container">
    <!-- search start -->
    <div class="search-wrapper">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label="主题分类" prop="theme" label-width="70px">
          <el-select v-model="searchForm.theme" placeholder="请选择" @change="getPictureList">
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
          <el-button
            class="add-btn btn-h-38"
            type="primary"
            @click="handleUploadClick"
          >导入sku组合</el-button>
          <el-button
            class="add-btn btn-h-38"
            type="primary"
            @click="handlerAddPicClick"
          >新增</el-button>
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
              <el-button
                class="btn-red"
                type="text danger"
                @click="handlerDelClick(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- table-content end -->

        <!-- 分页 start -->
        <div class="pagination-wrapper clearfix">
          <div class="pagination-total">
            <span>
              共
              <span class="num-text">{{ pageTotal }}</span>页/ <span class="num-text">{{ total }}</span>条数据
            </span>
          </div>
          <el-pagination
            class="sl-pagination"
            :current-page.sync="listQuery.page"
            :page-sizes="[10, 20, 40]"
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
        :confirm-text="editPictureId ? '保存' : '提交'"
        :validate="true"
        top="6vh"
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
          <el-form-item label="图片编码" prop="material_code">
            <el-input v-model="pictureForm.material_code" placeholder="请输入" />
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
          <el-form-item label="组合sku" prop="sku_list_str" class="sku-form-item">
            <el-input
              v-model="pictureForm.sku_list_str"
              :rows="5"
              type="textarea"
              placeholder="请输入"
            />
            <el-button
              class="search-sku-btn"
              size="mini"
              type="primary"
              @click="handleOpenSkuSearchDialog"
            >查询sku</el-button>
          </el-form-item>
          <el-form-item label="图片" prop="material_img">
            <div class="meterial-img-upload-wrapper">
              <sl-upload
                class="outline-uploader outline-uploader-left"
                @on-success="handlerOutlineImgSuccess($event, 'left')"
              >
                <img
                  v-if="pictureForm.material_img_left"
                  class="upload-preview"
                  :src="pictureForm.material_img_left_url"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </sl-upload>
              <sl-upload
                class="outline-uploader outline-uploader-right"
                @on-success="handlerOutlineImgSuccess($event, 'right')"
              >
                <img
                  v-if="pictureForm.material_img_right"
                  class="upload-preview"
                  :src="pictureForm.material_img_right_url"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </sl-upload>
              <sl-upload
                class="outline-uploader outline-uploader-top"
                @on-success="handlerOutlineImgSuccess($event, 'top')"
              >
                <img
                  v-if="pictureForm.material_img_top"
                  class="upload-preview"
                  :src="pictureForm.material_img_top_url"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </sl-upload>
              <sl-upload
                class="outline-uploader outline-uploader-bottom"
                @on-success="handlerOutlineImgSuccess($event, 'bottom')"
              >
                <img
                  v-if="pictureForm.material_img_bottom"
                  class="upload-preview"
                  :src="pictureForm.material_img_bottom_url"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </sl-upload>
              <sl-upload class="outline-uploader" @on-success="handlerOutlineImgSuccess">
                <img
                  v-if="pictureForm.material_img"
                  :src="pictureForm.material_img_url"
                  class="upload-preview"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </sl-upload>
            </div>
          </el-form-item>
        </el-form>
      </sl-dialog>
      <!-- 图片编辑弹窗 end -->

      <sl-dialog
        ref="skuSearchDialog"
        title="查询SKU"
        width="900px"
        top="8vh"
        @confirm="handleSkuSearchDialogConfirm"
        @close="handleSkuSearchDialogClose"
      >
        <div class="search-wrapper sku-search-wrapper">
          <el-form ref="skuSearchForm" class="su-search-form" :model="skuSearchForm" :inline="true">
            <el-form-item label="材质" prop="goods_material" label-width="70px">
              <el-select v-model="skuSearchForm.goods_material" placeholder="请选择" clearable>
                <el-option
                  v-for="item in raw_material_list"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="品牌" prop="brand" label-width="70px">
              <el-select
                v-model="skuSearchForm.brand"
                filterable
                placeholder="请选择"
                clearable
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
            <el-form-item label="颜色" prop="color_name" label-width="70px">
              <el-input v-model.trim="skuSearchForm.color_name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="型号" prop="model" label-width="70px">
              <el-select v-model="skuSearchForm.model" filterable placeholder="请选择" clearable>
                <el-option
                  v-for="item in data_model_list"
                  :key="item.model_id"
                  :label="item.model_name"
                  :value="item.model_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_name" label-width="70px">
              <el-input v-model.trim="skuSearchForm.goods_name" placeholder="请输入" />
            </el-form-item>
            <el-form-item>
              <el-button class="btn-h-38" type="primary" @click="getSkuList">查询</el-button>
            </el-form-item>
          </el-form>

          <div v-loading="skuTableLoading" element-loading-text="拼命加载中">
            <div class="table-content default-table-change sku-table">
              <el-table
                ref="skuTable"
                :data="skuList"
                stripe
                height="350"
                class="sku-table"
                @selection-change="handleSkuSelectionChange"
              >
                <el-table-column type="selection" align="center" width="55" />
                <el-table-column align="center" prop="sku" label="sku" />
              </el-table>
            </div>
          </div>
        </div>
      </sl-dialog>
    </div>

    <TaskDialog ref="uploadSkuDialog" :type="10" title="导入sku组合" />
  </div>
</template>
<script>
import SlDialog from '@/components/Dialog/Dialog'
import moment from 'moment'
import { mapState } from 'vuex'
import { materialGet, materialSave, goodsGet } from '@/api/api'
import { PICTURE_STATUS } from '@/config/cfg'
import SlUpload from '@/components/upload/index'
import TaskDialog from '@/components/TaskDialog/TaskDialog'

export default {
  components: {
    SlDialog,
    SlUpload,
    TaskDialog
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
        material_code: '',
        theme: '',
        // status: '',
        material_img: '',
        material_img_url: '',
        sku_list_str: '',
        material_img_left: '', // 左面图片文件名
        material_img_left_url: '',
        material_img_right: '', // 右面图片文件名
        material_img_right_url: '',
        material_img_top: '', // 上面（顶部）图片文件名
        material_img_top_url: '',
        material_img_bottom: '', // 下面（底部）图片文件名
        material_img_bottom_url: ''
      },
      pictureFormRules: {
        material_name: [{ required: true, message: '请输入图片名称', trigger: 'blur' }],
        // material_code: [{ required: true, message: '请输入图片编码', trigger: 'blur' }],
        // theme: [{ required: true, message: '请选择主题分类', trigger: 'change' }],
        // status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        material_img: [{ required: true, message: '请上传轮廓图' }]
      },

      // 图片使用状态 正常：1 停用：2
      picStatusOptions: [
        { label: '正常', value: 1 },
        { label: '停用', value: 2 }
      ],
      PICTURE_STATUS,

      skuSearchForm: {
        goods_material: '',
        brand: '',
        model: '',
        goods_name: '',
        color_name: ''
      },

      skuList: [],
      skuMultipleSelection: [],
      skuTableLoading: false,

      data_model_list: []
    }
  },
  computed: {
    ...mapState({
      theme_list: (state) => state.user.theme_list,
      business_info: (state) => state.user.business_info,
      phone_brand_list: (state) => state.user.phone_brand_list,
      model_list: (state) => state.user.model_list,
      raw_material_list: (state) => state.user.raw_material_list
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
    document.addEventListener('keydown', this.handleKeydownEvent, false)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeydownEvent, false)
  },
  methods: {
    handleKeydownEvent(e) {
      if (e.keyCode === 13) {
        this.getPictureList()
      }
    },
    async getPictureList() {
      const data = {
        opr: 'get_material_list',
        page_no: this.listQuery.page,
        business_id: this.business_id
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

        item.material_img_url = this.getImgUrl(234, 280, item.material_img)
        item.material_img_left_url = this.getImgUrl(234, 280, item.material_img_left)
        item.material_img_right_url = this.getImgUrl(234, 280, item.material_img_right)
        item.material_img_top_url = this.getImgUrl(234, 280, item.material_img_top)
        item.material_img_bottom_url = this.getImgUrl(234, 280, item.material_img_bottom)
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
    getImgUrl(width, height, img_name) {
      return `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=1&width=${width}&height=${height}&img_name=${img_name}`
    },
    handlerOutlineImgSuccess(e, type) {
      const img_name = e.img_name

      switch (type) {
        case 'left':
          this.pictureForm.material_img_left = img_name
          this.pictureForm.material_img_left_url = this.getImgUrl(100, 280, img_name)
          break
        case 'right':
          this.pictureForm.material_img_right = img_name
          this.pictureForm.material_img_right_url = this.getImgUrl(100, 280, img_name)
          break
        case 'top':
          this.pictureForm.material_img_top = img_name
          this.pictureForm.material_img_top_url = this.getImgUrl(234, 100, img_name)
          break
        case 'bottom':
          this.pictureForm.material_img_bottom = img_name
          this.pictureForm.material_img_bottom_url = this.getImgUrl(234, 100, img_name)
          break
        default:
          this.pictureForm.material_img = img_name
          this.pictureForm.material_img_url = this.getImgUrl(234, 280, img_name)
          break
      }
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
        material_code: this.pictureForm.material_code,
        sku_list_str: this.pictureForm.sku_list_str,
        theme: this.pictureForm.theme,
        material_img: this.pictureForm.material_img,
        business_id: this.business_id,
        material_img_left: this.pictureForm.material_img_left,
        material_img_right: this.pictureForm.material_img_right,
        material_img_top: this.pictureForm.material_img_top,
        material_img_bottom: this.pictureForm.material_img_bottom
        // status: 1       // 默认启用
      }

      if (this.editPictureId) {
        // data.status = this.pictureForm.status
        data.material_id = this.editPictureId
      }

      console.log('保存图片 req=>', data)
      const resp = await materialSave(data, true, true)
      console.log('保存图片 res=>', resp)

      if (resp.ret !== 0) return

      // this.$notify({
      //   title: '成功',
      //   message: this.editPictureId ? '保存成功' : '提交成功',
      //   type: 'success'
      // })
      this.handlerPicEditDialogClose()
      this.$refs.pictureEditDialog.hide()
      this.getPictureList()
    },
    handlerMaterialEditClick(row) {
      this.editPictureId = row.material_id
      this.pictureForm.material_name = row.material_name
      this.pictureForm.material_code = row.material_code
      this.pictureForm.theme = row.theme
      // this.pictureForm.status = row.status
      this.pictureForm.material_img = row.material_img
      this.pictureForm.material_img_url = row.material_img_url
      this.pictureForm.material_img_left = row.material_img_left
      this.pictureForm.material_img_left_url = row.material_img_left_url
      this.pictureForm.material_img_right = row.material_img_right
      this.pictureForm.material_img_right_url = row.material_img_right_url
      this.pictureForm.material_img_top = row.material_img_top
      this.pictureForm.material_img_top_url = row.material_img_top_url
      this.pictureForm.material_img_bottom = row.material_img_bottom
      this.pictureForm.material_img_bottom_url = row.material_img_bottom_url
      this.pictureForm.sku_list_str = row.sku_list_str
      this.$refs.pictureEditDialog.show()
    },
    handlerPicEditDialogClose() {
      this.$refs.pictureForm.resetFields()
      this.editPictureId = ''
      this.pictureForm.material_name = ''
      this.pictureForm.material_code = ''
      this.pictureForm.theme = ''
      // this.pictureForm.status = ''
      this.pictureForm.material_img = ''
      this.pictureForm.material_img_url = ''
      this.pictureForm.material_img_left = ''
      this.pictureForm.material_img_left_url = ''
      this.pictureForm.material_img_right = ''
      this.pictureForm.material_img_right_url = ''
      this.pictureForm.material_img_top = ''
      this.pictureForm.material_img_top_url = ''
      this.pictureForm.material_img_bottom = ''
      this.pictureForm.material_img_bottom_url = ''
      this.pictureForm.sku_list_str = ''
    },
    handlerDelClick(row) {
      const material_id = row.material_id
      this.$confirm('确认要删除选中素材？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        closeOnPressEscape: false
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
    },

    handleSkuSelectionChange(val) {
      this.skuMultipleSelection = val
    },
    // sku选择
    handleOpenSkuSearchDialog() {
      this.$refs.skuSearchDialog.show()
    },
    handleSkuSearchDialogClose() {
      this.$refs.skuSearchForm.resetFields()
      this.skuList = []
      this.skuMultipleSelection = []
    },
    handleSkuSearchDialogConfirm() {
      if (this.skuMultipleSelection.length === 0) return

      const skuStr = this.skuMultipleSelection
        .map((item) => {
          return item.sku
        })
        .join('\n')

      this.pictureForm.sku_list_str =
        this.pictureForm.sku_list_str === ''
          ? skuStr
          : this.pictureForm.sku_list_str + '\n' + skuStr
      this.handleSkuSearchDialogClose()
      this.$refs.skuSearchDialog.hide()
    },
    async getSkuList() {
      const data = {
        opr: 'get_goods_sku_list',
        goods_name: this.skuSearchForm.goods_name, // 商品名称
        raw_material: this.skuSearchForm.goods_material, // 材质（见系统管理中参数配置）
        brand: this.skuSearchForm.brand, // 品牌ID
        model: this.skuSearchForm.model, // 型号ID
        color_name: this.skuSearchForm.color_name
      }

      this.skuTableLoading = true

      console.log('get sku data req=>', data)
      const resp = await goodsGet(data)
      console.log('get sku data res=>', resp)

      if (resp.ret !== 0) return
      this.skuTableLoading = false

      this.skuList = resp.data.list

      this.$nextTick(() => {
        this.$refs.skuTable.toggleAllSelection()
      })
    },
    handlerBrandChange(brand_id) {
      this.skuSearchForm.model = ''
      this.phone_brand_list.forEach((brand) => {
        if (brand.brand_id === brand_id) {
          this.data_model_list = brand.model_list
        }
      })
    },
    handleUploadClick() {
      this.$refs.uploadSkuDialog.show()
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

  &.sku-search-wrapper {
    padding-top: 0;
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
  &.sku-table {
    min-height: 200px;

    /deep/ td {
      padding: 6px 0;
    }
  }
}
.picture-form {
  width: 530px;
}
.meterial-img-upload-wrapper {
  position: relative;
  height: 285px;
}
/deep/ .outline-uploader {
  position: absolute;
  left: 70px;
  top: 70px;
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
  &.outline-uploader-left {
    left: 0;
    top: 70px;
    .avatar-uploader-icon {
      width: 50px;
      height: 140px;
      line-height: 140px;
      font-size: 20px;
    }
    .upload-preview {
      width: 50px;
      height: 140px;
    }
  }

  &.outline-uploader-right {
    left: 207px;
    top: 70px;
    .avatar-uploader-icon {
      width: 50px;
      height: 140px;
      line-height: 140px;
      font-size: 20px;
    }
    .upload-preview {
      width: 50px;
      height: 140px;
    }
  }
  &.outline-uploader-top {
    left: 70px;
    top: 0;
    .avatar-uploader-icon {
      height: 50px;
      line-height: 50px;
      font-size: 20px;
    }
    .upload-preview {
      width: 117px;
      height: 50px;
    }
  }

  &.outline-uploader-bottom {
    left: 70px;
    top: 230px;
    .avatar-uploader-icon {
      height: 50px;
      line-height: 50px;
      font-size: 20px;
    }
    .upload-preview {
      width: 117px;
      height: 50px;
    }
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

.sku-form-item {
  position: relative;
  .search-sku-btn {
    position: absolute;
    bottom: 0;
    right: -85px;
  }
}
</style>
