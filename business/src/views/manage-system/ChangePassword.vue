<template>
  <div class="app-container">
    <div class="shopinfo-title-wrapper">
      <baseinfo-title class="shop-info-title" color="#FB7474" text="修改密码" />
    </div>
    <div class="shopinfo-wrapper">
      <div class="logo-wrapper">
        <img src="@/assets/images/change-password.png">
      </div>
      <el-form
        ref="passwrodForm"
        :model="passwrodForm"
        :rules="passwrodFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="passwrodForm.username" disabled placeholder="请输入" />
        </el-form-item>
        <el-form-item label="旧密码" prop="old_passwd">
          <el-input v-model="passwrodForm.old_passwd" type="password" placeholder="请输入" />
        </el-form-item>
        <el-form-item class="new_passwd" label="新密码" prop="new_passwd">
          <el-input v-model="passwrodForm.new_passwd" type="password" placeholder="请输入" />
          <div class="passwd-tip">密码长度大于6位</div>
        </el-form-item>
        <el-form-item label="确认密码" prop="new_passwd_repeat">
          <el-input v-model="passwrodForm.new_passwd_repeat" type="password" placeholder="请输入" />
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
import { businessSave } from '@/api/api'

export default {
  components: {
    BaseinfoTitle
  },
  data() {
    const validatePass = (rule, value, callback) => {
      const reg = /[\u4e00-\u9fa5]/gm

      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          return callback(new Error('密码长度少于6位'))
        } else {
          if (reg.test(value)) {
            return callback(new Error('密码不能为中文'))
          } else {
            if (this.passwrodForm.new_passwd_repeat !== '') {
              this.$refs.passwrodForm.validateField('new_passwd_repeat')
            }
            callback()
          }
        }
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwrodForm.new_passwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwrodForm: {
        business_id: '',                    // 商户账户ID
        username: '',                       // 用户名
        old_passwd: '',                     // 原密码
        new_passwd: '',                     // 新密码
        new_passwd_repeat: ''               // 新密码重复
      },
      passwrodFormRules: {
        username: [{ required: true }],
        old_passwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        new_passwd: [{ required: true, validator: validatePass, trigger: 'blur' }],
        new_passwd_repeat: [{ required: true, validator: validatePass2, trigger: 'blur' }]
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
        this.passwrodForm.business_id = val.business_id
        this.passwrodForm.username = val.username
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handlerSaveClick() {
      this.$refs.passwrodForm.validate(valid => {
        if (valid) {
          this.savePassword()
        }
      })
    },
    async savePassword() {
      const data = {
        opr: 'modify_business_passwd',
        business_id: this.passwrodForm.business_id,                 // 商户账户ID
        old_passwd: this.passwrodForm.old_passwd,                   // 原密码
        new_passwd: this.passwrodForm.new_passwd                    // 新密码
      }

      console.log('密码修改 req=>', data)
      const resp = await businessSave(data)
      console.log('密码修改 res=>', resp)

      if (resp.ret !== 0) return

      this.passwrodForm.old_passwd = ''
      this.passwrodForm.new_passwd = ''
      this.passwrodForm.new_passwd_repeat = ''

      this.$slnotify({
        message: '修改成功'
      })
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
  margin: 0 auto 70px;
}
.logo-wrapper {
  text-align: center;
  margin: 40px 0;
  img {
    width: 70px;
    height: 70px;
  }
}
.new_passwd{
  position: relative;

  .passwd-tip{
    position: absolute;
    top: 0;
    right: -114px;
    line-height:40px;
    color: #6D7585;
    font-size: 12px;
  }
}
</style>

