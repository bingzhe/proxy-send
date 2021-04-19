<template>
  <div>
    <el-form ref="searchForm" :model="searchForm" :inline="true">
      <el-form-item label="主题分类" prop="theme" label-width="70px">
        <el-select v-model="searchForm.theme" placeholder="请选择">
          <el-option key="全部" label="全部" value />
          <el-option v-for="item in theme_list" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="素材名称" prop="material_name" label-width="70px">
        <el-input v-model.trim="searchForm.material_name" placeholder="请输入" />
      </el-form-item>
      <el-form-item>
        <el-button class="btn-h-38" type="primary" @click="handlerSearchClick">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="material-list-wrapper">
      <div class="material-list clearfix">
        <material-card
          v-for="item in list"
          :key="item.material_id"
          :material="item"
          @on-select="handlerImageSelect(item)"
        />
      </div>
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
  </div>
</template>

<script>
/**
 * 下单素材 list
 */
import MaterialCard from './MaterialCard'
import { materialGet } from '@/api/api'
import { mapState } from 'vuex'

export default {
  components: {
    MaterialCard
  },
  data() {
    return {
      token: window.Store.GetGlobalData('token'),

      searchForm: {
        theme: '',
        material_name: ''
      },

      // 分页
      total: 100, // 分页总条数
      listQuery: {
        page: 1,
        limit: 15
      },

      list: []
    }
  },
  computed: {
    ...mapState({
      theme_list: (state) => state.user.theme_list
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
        page_no: this.listQuery.page,
        page_size: this.listQuery.limit
      }
      // 图片分类
      if (this.searchForm.theme) {
        data.theme = this.searchForm.theme
      }
      // 素材名
      if (this.searchForm.material_name) {
        data.material_name = this.searchForm.material_name
      }

      console.log('图库列表 req=>', data)
      const resp = await materialGet(data)
      console.log('图库列表 res=>', resp)

      if (resp.ret !== 0) return
      this.list = resp.data.list || []
      this.total = resp.data.total

      this.list = this.list.map((item) => {
        item.material_img_url = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=1&width=168&height=120&img_name=${item.material_img}`
        item.material_img_back = item.material_img
        item.material_img_back_url_ori = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=1&img_name=${item.material_img}`
        item.material_img_left_url_ori = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=1&img_name=${item.material_img_left}`
        item.material_img_right_url_ori = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=1&img_name=${item.material_img_right}`
        item.material_img_top_url_ori = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=1&img_name=${item.material_img_top}`
        item.material_img_bottom_url_ori = `${process.env.VUE_APP_BASEURL}/img_get.php?token=${this.token}&opr=get_img&type=1&img_name=${item.material_img_bottom}`

        return item
      })
    },
    handlerSearchClick() {
      this.listQuery.page = 1
      this.getPictureList()
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
    handlerImageSelect(item) {
      this.$emit('on-select', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.material-list-wrapper {
  position: relative;
  box-shadow: 0px 0px 6px 0px rgba(37, 132, 249, 0.15);
  width: 936px;
  height: 466px;
  border-radius: 2px;
  padding: 16px 0 0 16px;
}

.material-list {
  .material-card {
    float: left;
    margin: 0 16px 16px 0;
  }
}
.pagination-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 36px;
  padding: 0 10px 8px;
  .pagination-total {
    float: left;
    color: #888888;
    font-size: 14px;
    line-height: 31px;
    padding: 0 0 0 10px;

    .num-text {
      color: #e33119;
    }
  }
  .sl-pagination {
    float: right;
  }
}
</style>

