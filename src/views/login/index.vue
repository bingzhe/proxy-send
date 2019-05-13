<template>
  <div class="login-container">
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
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
          <input v-model="loginForm.password_md5">
        </el-form-item>

        <el-form-item prop="verify_code">
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
          />
          <div class="check-img">
            <!--  @click="changeCheckImg" -->
            <img :src="codeimgurl" alt="验证图片">
          </div>
        </el-form-item>

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
</template>

<script>
import { validUsername } from '@/utils/validate'
import Util from '@/utils/util'

export default {
  name: 'Login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        username: '',
        password: '',
        password_md5: '',
        verify_code: ''
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      codeimgurl: '', // 图片地址
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
    this.changeCheckImg()
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
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 更换code图片地址
    changeCheckImg() {
      const token = Util.creatToken()

      this.codeimgurl = `http://platform.jzzwlcm.com/php/code.php?height=40&width=90&fontsize=16&codelen=4&token=${token}&is_plain=1&${Math.random()}`
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

// $bg: #283443;
// $light_gray: #fff;
// $cursor: #fff;

// @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
//   .login-container .el-input input {
//     color: $cursor;
//   }
// }
</style>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;
$light_gray: #eee;
$cursor: #fff;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form-contanier {
    width: 350px;
    max-width: 100%;
    padding: 160px 25px 0;
    margin: 0 auto;
    overflow: hidden;

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
      // padding: 12px 5px 12px 15px;
      // color: $light_gray;
      color: #333;
      // height: 47px;
      // caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  // .login-form {
  //   position: relative;
  //   width: 350px;
  //   max-width: 100%;
  //   padding: 160px 25px 0;
  //   margin: 0 auto;
  // }

  // .tips {
  //   font-size: 14px;
  //   color: #fff;
  //   margin-bottom: 10px;

  //   span {
  //     &:first-of-type {
  //       margin-right: 16px;
  //     }
  //   }
  // }

  .svg-container {
    padding: 0px 5px 0px 15px;
    color: #8a8a8a;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .check-img {
    cursor: pointer;
    position: absolute;
    top: 4px;
    right: 4px;
    width: 90px;
    height: 40px;
    margin-left: 10px;
  }
}
</style>
