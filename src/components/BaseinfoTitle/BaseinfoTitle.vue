<template>
  <div class="baseinfo-title">
    <span class="color-piece" :style="{backgroundColor: color}" />
    <span class="text">{{ text }}</span>
  </div>
</template>

<script>
/**
 * 商品编辑title
 */
export default {
  props: {
    color: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.color-piece {
  display: inline-block;
  width: 8px;
  height: 16px;
  border-radius: 2px;
  margin-right: 1px;
  vertical-align: text-top;
}
.text {
  color: #333;
  font-size: 16px;
  font-weight: bold;
}
</style>

