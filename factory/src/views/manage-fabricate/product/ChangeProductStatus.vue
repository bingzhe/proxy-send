<template>
  <sl-dialog
    ref="changeProductStatus"
    title="修改生产单状态"
    :validate="true"
    confirm-text="提交"
    @close="handerDialogClose"
    @open="handlerDialogOpen"
    @confirm="handlerDialogConfirm"
  >
    <div class="change-tip">* 调整生产单状态有可能导致重复生产，请谨慎操作。</div>
    <el-form ref="changeStatusForm" :model="changeForm" label-width="130px">
      <el-form-item label="状态" prop="status_txt">
        <el-select v-model="changeForm.status_txt" placeholder="请选择">
          <el-option
            v-for="item in production_order_status_list"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="调整原因" prop="remark">
        <el-input
          v-model="changeForm.remark"
          :rows="2"
          type="textarea"
          placeholder="请输入"
          maxlength="150"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </sl-dialog>
</template>

<script>
import SlDialog from '@/components/Dialog/Dialog'
import { mapState } from 'vuex'
import { productionOrderSave } from '@/api/api'

export default {
  components: {
    SlDialog
  },
  props: {
    productInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      changeForm: {
        status_txt: '',
        remark: ''
      }
    }
  },

  computed: {
    ...mapState({
      production_order_status_list: state => state.user.production_order_status_list
    })
  },
  methods: {
    show() {
      this.$refs.changeProductStatus.show()
    },
    handerDialogClose() {
      this.$refs.changeStatusForm.resetFields()
      this.$emit('clsoe')
    },
    handlerDialogOpen() {
      this.changeForm.status_txt = this.productInfo.status_txt
    },
    async handlerDialogConfirm() {
      const data = {
        opr: 'batch_modify_production_order_status',
        list: [
          {
            production_id: this.productInfo.production_id,   // 生产单ID
            status_txt: this.changeForm.status_txt,           // 生产单状态('未下载', '下载失败', '下载成功', '作废')
            remark: this.changeForm.remark
          }
        ]
      }

      console.log('修改生产单状态 req=>', data)
      const resp = await productionOrderSave(data)
      console.log('修改生产单状态 res=>', resp)

      if (resp.ret !== 0) return

      this.$refs.changeProductStatus.hide()
      this.$emit('on-success')
      this.handerDialogClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 300px;
}
.el-textarea {
  width: 500px;
  margin-bottom: 100px;
}
.change-tip {
  position: relative;
  top: -25px;
  font-size: 12px;
  color: #db0303;
}
</style>
