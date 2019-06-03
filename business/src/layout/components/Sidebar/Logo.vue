<template>
  <div class="sidebar-logo-wrapper">
    <div class="sidebar-logo-container" :class="{'collapse':collapse}">
      <transition name="sidebarLogoFade">
        <router-link key="expand" class="sidebar-logo-link" to="/">
          <img src="@/assets/images/logo.png" class="sidebar-logo">
        </router-link>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-wrapper {
  width: 100%;
  height: 66px;
  line-height: 66px;
  background: #f7f7f7;
}
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 66px;
  line-height: 66px;
  // background: #075ec0;
  background: #2584f9;
  text-align: center;
  overflow: hidden;
  border-radius: 0px 33px 0px 0px;

  .sidebar-logo {
    margin-top: 14px;
    width: 147px;
    height: 38px;
  }
}
</style>
