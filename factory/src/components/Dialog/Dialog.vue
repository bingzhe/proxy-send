<template>
  <el-dialog
    :title="title"
    :top="top"
    :width="width"
    :visible.sync="dialogVisible"
    :show-close="showClose"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    @close="close"
    @open="open"
  >
    <div class="dialog-content">
      <slot />
    </div>
    <div v-if="showFooter" slot="footer" class="dialog-footer">
      <el-button class="btn-bd-primary" @click="hide">{{ cancelText }}</el-button>
      <el-button type="primary" @click="confirm">{{ confirmText }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '20vh'
    },
    width: {
      type: String,
      default: '780px'
    },
    // 是否显示关闭图标
    showClose: {
      type: Boolean,
      default: true
    },
    // 是否显示按钮栏
    showFooter: {
      type: Boolean,
      default: true
    },
    // 取消按钮文本
    cancelText: {
      type: String,
      default: '取消'
    },
    // 确定按钮文本
    confirmText: {
      type: String,
      default: '确定'
    },
    // 表单验证
    validate: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    confirm() {
      if (!this.validate) {
        this.hide()
      }
      this.$emit('confirm')
    },
    close() {
      this.$emit('close')
    },
    open() {
      this.$emit('open')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #e6e6e6;
  }
  .el-dialog__footer {
    border-top: 1px solid #e6e6e6;
    text-align: center;

    .el-button {
      width: 100px;
    }
    .el-button + .el-button {
      margin-left: 40px;
    }
  }
}
</style>
