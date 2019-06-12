<template>
  <el-upload
    :before-upload="beforeOutlineImgUpload"
    :show-file-list="false"
    :http-request="imgUpload"
    :action="url"
  >
    <slot />
  </el-upload>
</template>

<script>
import Http from '@/config/encsubmit'

export default {
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      //   base_url: ,
      url: process.env.VUE_APP_BASEURL + '/img_save.php'
    }
  },
  methods: {
    beforeOutlineImgUpload(file) {
      // console.log('beforeOutlineImgUpload file', file)
      // const isJPG = file.type === 'image/jpeg';
      const isLt5M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt5M) {
        this.$message.error('上传轮廓图大小不能超过 5MB!')
      }
      return isLt5M
    },
    imgUpload({ file }) {
      const data = {
        opr: 'save_img_file',
        type: this.type,
        imgfile: file
      }

      Http.EncSubmit(this.url, data, resp => {
        if (resp.ret !== 0) {
          return this.$message.error(resp.msg)
        }

        this.$emit('on-success', resp.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

