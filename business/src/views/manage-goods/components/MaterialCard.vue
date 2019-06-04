<template>
  <div class="material-card">
    <img class="material-pic" :src="material.material_img_url" alt>
    <div class="material-card-hover">
      <div class="material-name">{{ material.material_name }}</div>
      <el-button class="btn-bd-primary" size="mini" @click="handlerSelectClick">选择</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    material: {
      type: Object,
      required: true
    }
  },
  methods: {
    handlerSelectClick() {
      this.$emit('on-select')
    }
  }
}
</script>

<style lang="scss" scoped>
.material-card {
  width: 168px;
  height: 120px;
  position: relative;

  .material-pic {
    width: 100%;
    height: 100%;
  }

  .material-card-hover {
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    text-align: center;

    .material-name {
      font-size: 15px;
      color: #fff;
      margin: 24px 0;
    }
  }

  &:hover {
    .material-card-hover {
      opacity: 1;
    }
  }
}
</style>

