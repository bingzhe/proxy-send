<template>
  <el-dialog
    :title="title"
    :top="top"
    :width="width"
    :visible.sync="dialogVisible"
    :show-close="showClose"
    @close="close"
    @open="open"
  >
    <div
      class="dialog-content"
      :class="{
        'undo-wrapper': type === 'undo',
        'delete-wrapper': type === 'delete'
      }"
    >
      <div v-if="showFooter" class="dialog-footer">
        <el-button class="btn-bd-primary confirm-btn" @click="confirm">{{ confirmText }}</el-button>
        <el-button class="btn-bd-primary cancel-btn" @click="hide">{{ cancelText }}</el-button>
      </div>
      <img v-if="type === 'undo'" class="background-img" src="@/assets/images/undo.png">
      <img v-if="type === 'delete'" class="background-img" src="@/assets/images/delete.png">
      <div class="tip-wrapper">{{ tipText }}</div>
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
      default: '360px'
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
    // 1 undo 2 delete
    type: {
      type: String,
      default: 'undo'
    },
    tipText: {
      type: String,
      default: ''
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
  .el-dialog__body {
    padding: 0;
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
.dialog-content {
  height: 330px;
  position: relative;
  .background-img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .dialog-footer {
    position: absolute;
    width: 100%;
    height: 38px;
    left: 0;
    bottom: 64px;
    text-align: center;
    z-index: 2;
    .el-button {
      width: 100px;
    }
    .el-button + .el-button {
      margin-left: 28px;
    }
    .cancel-btn {
      color: #c0c7d1;
      border-color: #e6eaef;
      &:hover {
        background: rgba(230, 234, 239, 0.2);
      }
    }
  }
  .tip-wrapper {
    position: absolute;
    width: 100%;
    text-align: center;
    left: 0;
    font-size: 14px;
    bottom: 155px;
  }
}
.dialog-content.undo-wrapper {
  .dialog-footer {
    .confirm-btn {
      color: #2dbc6a;
      border-color: #2dbc6a;
      &:hover {
        background: rgba(45, 188, 106, 0.2);
      }
    }
  }
  .tip-wrapper {
    color: #2dbc6a;
  }
}

.dialog-content.delete-wrapper {
  .dialog-footer {
    .confirm-btn {
      color: #fd7474;
      border-color: #fd7474;
      &:hover {
        background: rgba(253, 116, 116, 0.2);
      }
    }
  }
  .tip-wrapper {
    color: #fd7474;
  }
}
</style>
