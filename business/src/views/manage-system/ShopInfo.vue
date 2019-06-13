<template>
  <div class="app-container">
    <div class="shopinfo-title-wrapper">
      <baseinfo-title class="shop-info-title" color="#FB7474" text="账户信息" />
    </div>
    <div class="shopinfo-wrapper">
      <el-form
        ref="shopinfoForm"
        :model="shopinfoForm"
        :rules="shopinfoFormRules"
        label-width="80px"
      >
        <el-form-item label="账户名" prop="username">
          <el-input v-model="shopinfoForm.username" disabled placeholder="请输入" />
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model="shopinfoForm.telephone" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="姓名" prop="business_name">
          <el-input v-model="shopinfoForm.business_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="VIP等级" prop="vip_level">
          <el-input v-model="shopinfoForm.vip_level" disabled />
        </el-form-item>
        <el-form-item label="开户时间" prop="create_time">
          <el-input v-model="shopinfoForm.create_time" disabled />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="shopinfoForm.address" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="商铺URL" prop="url">
          <el-input v-model="shopinfoForm.url" placeholder="请输入" />
        </el-form-item>
      </el-form>
    </div>
    <div class="shopinfo-footer-wrapper">
      <el-button type="primary" class="btn-h-44-w-100" @click="handlerSaveClick">提交</el-button>
    </div>
  </div>
</template>

<script>
import BaseinfoTitle from '@/components/BaseinfoTitle/BaseinfoTitle'
import { mapState } from 'vuex'
import moment from 'moment'
import { businessSave } from '@/api/api'

export default {
  components: {
    BaseinfoTitle
  },
  data() {
    return {
      shopinfoForm: {
        business_id: '',     // 商户账户ID
        username: '',        // 用户名(即用户表中的)
        business_name: '',   // 商户名（注：不是登录名）
        vip_level: '',       // vip等级（"普通会员"、"白金会员"...）
        create_time: 0,      // 开户时间
        telephone: '',       // 联系电话
        address: '',         // 联系地址
        url: ''              // 商铺URL
      },
      shopinfoFormRules: {
        username: [{ required: true }],
        vip_level: [{ required: true }],
        create_time: [{ required: true }],
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
        ],
        business_name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      business_info: state => state.user.business_info
    })
  },
  watch: {
    business_info: {
      handler: function(val) {
        this.shopinfoForm.business_id = val.business_id
        this.shopinfoForm.username = val.username
        this.shopinfoForm.business_name = val.business_name
        this.shopinfoForm.vip_level = val.vip_level
        this.shopinfoForm.create_time = moment(val.create_time * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        this.shopinfoForm.telephone = val.telephone
        this.shopinfoForm.address = val.address
        this.shopinfoForm.url = val.url
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handlerSaveClick() {
      this.$refs.shopinfoForm.validate(valid => {
        if (valid) {
          this.saveBusiness()
        }
      })
    },
    async saveBusiness() {
      const data = {
        opr: 'modify_business_info',
        business_id: this.shopinfoForm.business_id,       // 商户账户ID
        business_name: this.shopinfoForm.business_name,   // 商户名（注：不是登录名）
        telephone: this.shopinfoForm.telephone,           // 联系电话
        address: this.shopinfoForm.address,               // 联系地址
        url: this.shopinfoForm.url                        // 商铺URL
      }

      console.log('商户保存 req=>', data)
      const resp = await businessSave(data)
      console.log('商户保存 res=>', resp)

      if (resp.ret !== 0) return

      this.$slnotify({
        message: '提交成功'
      })
      // 更新页面全局数据
      this.$store.dispatch('user/getUserInfo')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
}
.shopinfo-title-wrapper {
  padding: 0 90px;
  line-height: 54px;
  box-shadow: 0px 1px 6px 0px rgba(37, 132, 249, 0.08);
}
.shopinfo-footer-wrapper {
  height: 68px;
  line-height: 68px;
  text-align: center;
  box-shadow: 0px -1px 6px 0px rgba(37, 132, 249, 0.08);
}
.el-form {
  width: 600px;
  margin: 40px auto;
}
</style>

