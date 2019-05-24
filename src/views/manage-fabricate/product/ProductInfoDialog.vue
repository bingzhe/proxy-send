<template>
  <sl-dialog
    ref="prodeuctInfoDialog"
    width="900px"
    top="12vh"
    :show-footer="false"
    title="生产单详情"
  >生产当详情</sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'

export default {
  components: {
    SlDialog
  },
  methods: {
    show() {
      this.$refs.prodeuctInfoDialog.show()
    }
  }
}
</script>
