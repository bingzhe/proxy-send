<template>
  <div>
    <el-form ref="searchForm" :model="searchForm" :inline="true">
      <el-form-item label="主题分类" prop="theme" label-width="70px">
        <el-input v-model.trim="searchForm.theme" placeholder="请输入" />
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
        <material-card v-for="item in list" :key="item.material_id" :material="item" />
      </div>
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
  </div>
</template>

<script>
import MaterialCard from './MaterialCard'

export default {
  components: {
    MaterialCard
  },
  data() {
    return {
      searchForm: {
        theme: '',
        material_name: ''
      },

      // 分页
      total: 100, // 分页总条数
      listQuery: {
        page: 1,
        limit: 20
      },

      list: [
        {
          material_id: '1',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        },
        {
          material_id: '2',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        },
        {
          material_id: '3',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        },
        {
          material_id: '3',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        },
        {
          material_id: '2',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        },
        {
          material_id: '3',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        },
        {
          material_id: '3',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        },
        {
          material_id: '3',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        },
        {
          material_id: '3',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        },
        {
          material_id: '2',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        },
        {
          material_id: '3',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        },
        {
          material_id: '3',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        }, {
          material_id: '3',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        },
        {
          material_id: '3',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        },
        {
          material_id: '2',
          material_name: '123123',
          material_img: '',
          material_img_url: 'http://f.pso.rockyshi.cn/php/img_get.php?token=T19QNDetEUVtCvfJ&opr=get_img&type=1&img_name=0e709824a0a9c3c023d94237ad11ee29.png'
        }
      ]

    }
  },
  computed: {
    pageTotal() {
      return Math.ceil(this.total / this.listQuery.limit)
    }
  },
  methods: {
    handlerSearchClick() { },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      //   this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      //   this.getGoodsList()
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

