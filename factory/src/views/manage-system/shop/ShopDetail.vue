<template>
  <div id="shop-edit-page" class="app-container">
    <div class="title-wrapper">
      <span class="title-text">{{ businessId ? '编辑商户' : '添加商户' }}</span>
      <el-button class="btn-bd-primary" @click="handlerGoBackClick">返回</el-button>
    </div>
    <div class="baseinfo-form-wrapper">
      <div class="baseinfo-title-wrapper">
        <baseinfo-title color="#F348A1" text="基本信息" />
      </div>
      <el-form
        ref="shopEditForm"
        :model="shopEditForm"
        :rules="shopEditFormRules"
        label-width="150px"
      >
        <el-row>
          <el-col :span="11" :xs="20">
            <el-form-item label="账户名" prop="username">
              <el-input v-model="shopEditForm.username" :disabled="!!businessId" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="账户密码" prop="password">
              <el-input v-model="shopEditForm.password" placeholder="请输入" />
            </el-form-item>
          </el-col>

          <el-col :span="11" :xs="20">
            <el-form-item label="手机号" prop="telephone">
              <el-input
                v-model="shopEditForm.telephone"
                v-limit-input-number="shopEditForm.telephone"
                data-dotrange="{0,0}"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="VIP等级" prop="vip_level">
              <el-select v-model="shopEditForm.vip_level" placeholder="请选择">
                <el-option
                  v-for="item in vip_level_list"
                  :key="item.vip_level"
                  :label="item.vip_title"
                  :value="item.vip_level"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="11" :xs="20">
            <el-form-item label="商户姓名" prop="business_name">
              <el-input v-model="shopEditForm.business_name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="业务员" prop="salesman">
              <el-select v-model="shopEditForm.salesman" filterable placeholder="请选择">
                <el-option
                  v-for="item in employee_list"
                  :key="item.employee_id"
                  :label="item.real_name"
                  :value="item.employee_id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="11" :xs="20">
            <el-form-item label="状态" prop="status">
              <el-select v-model="shopEditForm.status" placeholder="请选择">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :xs="20">
            <el-form-item label="可使用DIY设计器" prop="designer_valid">
              <!-- <el-input v-model="shopEditForm.designer_valid" placeholder="请输入"/> -->
              <el-select v-model="shopEditForm.designer_valid" placeholder="请选择">
                <el-option
                  v-for="item in useDesignerOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="22" :xs="20">
            <el-form-item label="联系地址" prop="address">
              <el-input
                v-model="shopEditForm.address"
                class="address"
                type="textarea"
                placeholder="请输入"
                :rows="3"
              />
            </el-form-item>
          </el-col>

          <el-col :span="22" :xs="20">
            <el-form-item label="商铺URL" prop="url">
              <el-input v-model="shopEditForm.url" class="business-url" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="tshop-wrapper">
      <div class="tshop-title-wrapper">
        <baseinfo-title color="#F3C148" text="淘宝店铺" />
        <div class="add-btn-wrapper" @click="handlerAddPicClick">
          <i class="el-icon-circle-plus" />
          <span class="add-btn-text">新增</span>
        </div>
      </div>
      <div class="tshop-table-wrapper default-table-change">
        <el-form ref="tshopForm" :model="tshopForm">
          <el-table :data="tshopForm.tshopList" stripe border>
            <el-table-column prop="num" label="序号" width="80" align="center">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="tshop_id" label="淘宝店铺ID" min-width="80" align="center"></el-table-column>
            <el-table-column prop="tshop_name" label="店铺名称" min-width="80" align="center">
              <template slot-scope="scope">
                <el-form-item
                  class="pictable-form-item"
                  :rules="{required: true, message: '请输入店铺名称', trigger:'blur'}"
                  :prop="'tshopList.' + scope.$index + '.tshop_name'"
                >
                  <el-input v-model.trim="scope.row.tshop_name" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="wdt_account" label="旺店通子账号" min-width="80" align="center">
              <template slot-scope="scope">
                <el-form-item
                  class="pictable-form-item"
                  :rules="{required: true, message: '请输入旺店通子账号', trigger:'blur'}"
                  :prop="'tshopList.' + scope.$index + '.wdt_account'"
                >
                  <el-input v-model.trim="scope.row.wdt_account" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="warehouse_id" label="发货仓库" min-width="80" align="center"></el-table-column>
            <el-table-column prop="opr" label="操作" min-width="45" align="center">
              <template slot-scope="scope">
                <el-button class="text-btn" type="text" @click="handlerDeletePicClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>

    <div class="gray-border-bottom" />

    <div class="button-group-wrapper">
      <el-button class="btn-h-44-w-100 btn-bd-primary" @click="handlerGoBackClick">取消</el-button>
      <el-button
        class="btn-h-44-w-100"
        type="primary"
        @click="handlerSaveBtnClick"
      >{{ businessId ? '保存' : '提交' }}</el-button>
    </div>
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import { businessSave, businessGet } from '@/api/api'
import { BUSINESS_STATUS, CANUSE_DESIGNERDIV } from '@/config/cfg'
import { mapState } from 'vuex'

export default {
  components: {
    BaseinfoTitle
  },
  data() {
    const validatePass = (rule, value, callback) => {
      const reg = /[\u4e00-\u9fa5]/gm

      if (reg.test(value)) {
        return callback(new Error('密码不能为中文'))
      } else {
        callback()
      }
    }
    return {
      businessId: '',

      shopEditForm: {
        username: '', // 登录用户名(同用户表中的)
        password: '',
        telephone: '', // 联系电话
        vip_level: '', // VIP等级
        business_name: '', // 商户姓名（注：不是登录名）
        salesman: '', // 业务员ID(跟单人)
        status: '', // 状态(1:正常,2:停用)
        designer_valid: '', // 可使用DIY设计器(1:可使用,0:不能使用)
        address: '', // 联系地址
        url: '' // 商铺URL
      },

      shopEditFormRules: {
        username: [{ required: true, message: '请输入账户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入账户密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
        ],
        vip_level: [{ required: true, message: '请选择VIP等级', trigger: 'change' }],
        business_name: [{ required: true, message: '请输入商户姓名', trigger: 'blur' }],
        salesman: [{ required: true, message: '请选择业务员', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        designer_valid: [
          { required: true, message: '请选择是否可使用DIY设计器', trigger: 'change' }
        ],
        address: [{ required: true, message: '请输入联系地址', trigger: 'blur' }]
      },

      statusOptions: [
        {
          label: BUSINESS_STATUS.toString(BUSINESS_STATUS.NORMAL),
          value: BUSINESS_STATUS.NORMAL
        },
        {
          label: BUSINESS_STATUS.toString(BUSINESS_STATUS.DISABLE),
          value: BUSINESS_STATUS.DISABLE
        }
      ],

      useDesignerOptions: [
        {
          label: CANUSE_DESIGNERDIV.toString(CANUSE_DESIGNERDIV.YES),
          value: CANUSE_DESIGNERDIV.YES
        },
        {
          label: CANUSE_DESIGNERDIV.toString(CANUSE_DESIGNERDIV.NO),
          value: CANUSE_DESIGNERDIV.NO
        }
      ],

      tshopForm: {
        tshopList: [
          {
            tshop_id: '12', // 淘宝店铺ID(空时为新建)
            tshop_name: '12', // 店铺名称(必填)
            tshop_url: '123', // 店铺url
            business_id: '123', // 店铺所属的商户ID
            wdt_account: '123', // 旺店通子账号(必填)
            warehouse_id: '123' // 特定发货仓库（下拉，单选）（可为空）
          },
          {
            tshop_id: '123', // 淘宝店铺ID(空时为新建)
            tshop_name: '', // 店铺名称(必填)
            tshop_url: '', // 店铺url
            business_id: '', // 店铺所属的商户ID
            wdt_account: '', // 旺店通子账号(必填)
            warehouse_id: '' // 特定发货仓库（下拉，单选）（可为空）
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      vip_level_list: (state) => state.user.vip_level_list,
      employee_list: (state) => state.user.employee_list
    })
  },
  methods: {
    handlerGoBackClick() {
      this.$router.go(-1)
    },
    handlerAddPicClick() {},
    handlerSaveBtnClick() {},
    handlerDeletePicClick() {}
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

.tshop-wrapper {
  max-width: 1035px;
  .tshop-title-wrapper {
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
  .tshop-table-wrapper {
    margin: 0 20px 40px 70px;
    .el-table {
      /deep/ .el-table__body-wrapper {
        td {
          padding: 0;
        }
      }
    }
    .text-btn {
      color: #e33119;
    }
  }
  //   .base-image-wrapper {
  //     display: inline-block;
  //     height: 60px;
  //     width: 44px;
  //     vertical-align: middle;
  //     border: 1px solid #ccc;
  //   }
  .pictable-form-item {
    margin: 16px 0;
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
</style>
