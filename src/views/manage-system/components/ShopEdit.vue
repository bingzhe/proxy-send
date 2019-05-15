<template>
  <sl-dialog>1</sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'

export default {
  components: {
    SlDialog
  },

  props: {
    businessId: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      shopEditForm: {

      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

