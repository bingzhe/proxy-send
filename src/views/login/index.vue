<template>
  <div class="login-container">
    <div class="login-center">
      <div class="login-form-contanier">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          label-position="left"
        >
          <div class="login-logo-container">
            <img class="login-logo" src="@/assets/images/login_logo.png">
          </div>

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入用户名称"
              name="username"
              type="text"
              tabindex="1"
              @input.native="clearValidate"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入登录密码"
              name="password"
              tabindex="2"
              @input.native="getMd5Password"
            />
            <!-- <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>-->
            <input v-model="loginForm.password_md5" type="hidden">
          </el-form-item>

          <el-form-item prop="verify_code" class="verify-code">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="verify_code"
              v-model="loginForm.verify_code"
              placeholder="请输入验证码"
              name="verify_code"
              type="text"
              tabindex="3"
              @input.native="clearValidate"
              @keyup.enter.native="handleLogin"
            />
            <div class="check-img">
              <img :src="codeimgurl" alt="验证图片">
            </div>
            <el-checkbox v-model="loginForm.checked" class="remeber-box">记住密码</el-checkbox>
            <el-button class="change-code-img" type="text" @click="getVerifyCodeImg">看不清，换一张</el-button>
          </el-form-item>

          <div class="login-tip">{{ errTipMsg }}</div>

          <el-button
            :loading="loading"
            class="login-btn"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleLogin"
          >登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import Util from '@/utils/util'
import { loginSave, loginGet } from '@/api/api'
import { errcode } from '@/config/cfg'
import { setEmployeeId } from '@/config/global-store'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        password_md5: '',
        verify_code: '',
        checked: false
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
        verify_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },

      codeimgurl: '', // 验证码图片地址

      errTipMsg: '',

      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getRemeberPassword()
  },
  mounted() {
    this.getVerifyCodeImg()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          this.loginOpr()
        }
      })
    },
    async loginOpr() {
      const data = {
        opr: 'login',
        login_name: this.loginForm.username,
        password_md5: this.loginForm.password_md5,
        verify_code: this.loginForm.verify_code
      }

      console.log('登录 req=>', data)
      const resp = await loginSave(data, false)
      console.log('登录 res=>', resp)

      this.loading = false

      if (resp.ret !== 0) {
        this.errTipMsg = errcode.toString(resp.ret)
        return
      }

      /**
       * 存一些登录的信息
       */
      const employeeid = resp.data.employee_id
      setEmployeeId(employeeid)

      this.checkRemeberPassword()

      // this.$router.push({ path: this.redirect || '/' })
      this.$router.push({ path: '/' })
    },
    async getVerifyCode() {
      const data = {
        opr: 'get_login_verify_code'
      }

      console.log('登录验证码图片 req=>', data)
      const resp = await loginGet(data)
      console.log('登录验证码图片 res=>', resp)

      this.codeimgurl = resp.data.verify_code
    },
    // 获取验证码图片地址
    getVerifyCodeImg() {
      const token = Util.creatToken()
      this.codeimgurl = `http://platform.jzzwlcm.com/php/code.php?height=38&width=90&fontsize=16&codelen=4&token=${token}&is_plain=1&${Math.random()}`

      this.clearValidate()
    },
    getMd5Password() {
      this.loginForm.password_md5 = md5(this.loginForm.password)
    },
    clearValidate() {
      this.$refs.loginForm.clearValidate()
      this.errTipMsg = ''
    },
    // 记住密码
    checkRemeberPassword() {
      const LOGINPD = {
        username: this.loginForm.username,
        password: this.loginForm.password_md5
      }
      console.log(1)

      if (this.loginForm.checked) {
        window.Store.SetGlobalData('F_LOGINPD', JSON.stringify(LOGINPD))
      } else {
        window.Store.DeleteGlobalData('F_LOGINPD')
      }
    },
    // 取记住的密码
    getRemeberPassword() {
      let LOGINPD = window.Store.GetGlobalData('F_LOGINPD')

      if (LOGINPD) {
        LOGINPD = JSON.parse(LOGINPD)

        this.loginForm.username = LOGINPD.username
        this.loginForm.password = '默认密码！！'
        this.loginForm.password_md5 = LOGINPD.password
        this.loginForm.checked = true
      }
    }

  }
}
</script>

<style lang="scss" scoped>
$bg: #fff;
$light_gray: #eee;
$cursor: #fff;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  background: url("../../assets/images/login_bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;

  .login-center {
    height: 755px;
    width: 1193px;
    background: url("../../assets/images/login_center.png");
    background-size: cover;
    background-repeat: no-repeat;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  .login-form-contanier {
    width: 300px;
    // max-width: 100%;
    // padding: 160px 25px 0;
    // margin: 0 auto;
    overflow: hidden;
    position: absolute;
    right: 168px;
    top: 50%;
    transform: translateY(-50%);

    .login-logo-container {
      text-align: center;
      margin-bottom: 18px;
      .login-logo {
        width: 234px;
        height: 110px;
      }
    }

    .el-form-item {
      border-bottom: 1px solid #c8c8c8;
      margin-bottom: 20px;
    }

    .el-form-item.password-remeber {
      border-bottom: none;
    }

    .el-form-item.verify-code {
      /deep/ .el-form-item__error {
        padding-top: 28px;
      }
    }

    .login-tip {
      height: 34px;
      font-size: 12px;
      color: #f56c6c;
      padding-top: 5px;
    }

    .el-button.login-btn {
      width: 100%;
      border-radius: 20px;
      font-size: 16px;
      color: #fff;
      background: linear-gradient(
        180deg,
        rgba(62, 159, 249, 1) 0%,
        rgba(25, 126, 240, 1) 100%
      );
    }
  }

  /* reset element-ui css */
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;

    /deep/ input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding-left: 10px;
      color: #333;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .svg-container {
    padding: 0px 5px 0px 10px;
    color: #8a8a8a;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    color: #8a8a8a;
    cursor: pointer;
    user-select: none;
  }
  .check-img {
    position: absolute;
    cursor: pointer;
    top: 0;
    right: 0;
    width: 90px;
    height: 38px;
  }
  .change-code-img {
    position: absolute;
    top: 35px;
    right: 0;
    font-size: 12px;
    color: #197ef0;
  }
  .remeber-box {
    position: absolute;
    top: 35px;
    left: 0;

    /deep/ .el-checkbox__label {
      font-size: 12px;
    }
  }
}

@media screen and (max-width: 1450px) {
  .login-container {
    .login-center {
      height: 604px;
      width: 954px;
    }
    .login-form-contanier {
      width: 280px;
      right: 130px;
    }
  }
}
</style>
