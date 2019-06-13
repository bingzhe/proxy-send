<template>
  <div v-if="visible" class="sl-errtip" :class="{'forever':forever}">
    <div class="sl-dialog-content" :class="{'sl-dialog-big':big}">
      {{ message }}
    </div>
  </div>
</template>

<script>
// this.$slnotify({
//   message: "注册失败"
// });
export default {
  data() {
    return {
      visible: false,
      message: '',
      duration: 2000,
      big: false,
      timer: null,
      forever: false
    }
  },
  mounted() {
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        this.visible = false
      }, this.duration)
    }
    if (this.forever) {
      window.clearInterval(this.timer)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.sl-errtip {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
}
.sl-dialog-content {
  width: 360px;
  opacity: 0.8;
  background: #000000;
  color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999999;
  border-radius: 2px;
  text-align: center;
  font-size: 14px;
  padding: 35px 16px;
}
.sl-dialog-big {
  height: 250px;
  top: 58%;
  line-height: 250px;
}
.sl-errtip.forever {
  opacity: 0.8;
  background: #000;
  .sl-dialog-content {
    opacity: unset;
    background: #fff;
    color: #000;
  }
}
</style>

