<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
    <div class="app-footer">
      <div>Copyright © All Rights Reserved.</div>
      <div>客服信息：QQ:XXXXXXXXX； 交流群：143434343443</div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  /* min-height: calc(100vh - 66px); */
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #e6e6e6;
}
.fixed-header + .app-main {
  padding-top: 66px;
}
.app-footer {
  position: absolute;
  bottom: 13px;
  line-height: 16px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 12px;
  color: #888888;
}
</style>
