<template>
  <div class="navbar">
    <!-- <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />-->

    <!-- <breadcrumb class="breadcrumb-container"/> -->

    <div class="right-menu">
      <div class="right-menu-item admin-wrapper">
        <img class="user-icon" src="@/assets/images/user_icon.png">
        <span>{{ username }}</span>
      </div>
      <div class="right-menu-item home-wrapper" @click="goHome">
        <img class="home-icon" src="@/assets/images/home.png">
      </div>
      <div class="right-menu-item logout-wrapper" @click="openLogout">
        <img class="logout-icon" src="@/assets/images/logout.png">
      </div>
      <!-- <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>Home</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'
import { loginSave } from '@/api/api'
import { delEmployeeId } from '@/config/global-store'

export default {
  components: {
    // Breadcrumb,
    // Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'username'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    openLogout() {
      this.$confirm('确定要退出登录吗？', '退出确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logoutOpr()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    async logoutOpr() {
      const resp = await loginSave({ opr: 'logout' })

      if (resp.ret !== 0) return

      /**
       * 清除数据
       */
      delEmployeeId()

      this.$router.push('/login')
    },
    goHome() {
      this.$router.push('/')
    }

  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 66px;
  overflow: hidden;
  position: relative;
  background: #f7f7f7;
  box-shadow: 0px 2px 24px 0px rgba(208, 213, 222, 0.6);

  // .hamburger-container {
  //   line-height: 46px;
  //   height: 100%;
  //   float: left;
  //   cursor: pointer;
  //   transition: background 0.3s;
  //   -webkit-tap-highlight-color: transparent;

  //   &:hover {
  //     background: rgba(0, 0, 0, 0.025);
  //   }
  // }

  // .breadcrumb-container {
  //   float: left;
  // }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 66px;
    text-align: center;
    font-size: 0;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      // display: inline-block;
      height: 100%;
      min-width: 66px;
      font-size: 20px;
      // color: #8a8a8a;
      vertical-align: text-bottom;
      border-left: 1px solid #d3d3d3;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;

      &:first-child {
        border-left: none;
        padding: 0 14px;

        span {
          font-size: 14px;
          color: #333;
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.user-icon {
  margin-right: 10px;
}
</style>
