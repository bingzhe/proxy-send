import http from '@/config/encsubmit'
import Vue from 'vue'
// import { errcode } from '@/config/cfg'

/**
 * generate requeset fn
 * @param {string} interfaceFile 接口名
 * @return {Function}
 */
function generateRequestFn(interfaceFile, options = {}) {
  /**
   * 返回的请求函数
   * @param {string} data 请求数据
   * @param {boolean} showErrTip 是否显示全局错误提示
   * @return Promise
   */
  const fn = (data, showErrTip = true) => {
    return new Promise((resolve, reject) => {
      http.DataEncSubmit(
        interfaceFile,
        data,
        (resp) => {
          if (resp.ret !== 0) {
            if (showErrTip) {
              Vue.prototype.$message.error(resp.msg || '')
            }
          }
          resolve(resp)
        },
        options
      )
    })
  }
  return fn
}

// =================== login ======================
// login_get
export const loginGet = generateRequestFn('login_get.php')

// login_save
export const loginSave = generateRequestFn('login_save.php')

// login_save 加密
export const loginSaveEncry = generateRequestFn('login_save.php', { encmode: 'encrypt1' })

// =================== system ======================
// factorycfg_save
export const factorycfgSave = generateRequestFn('factorycfg_save.php')

// factorycfg_get
export const factorycfgGet = generateRequestFn('factorycfg_get.php')

// =================== 商户管理 ======================
// business_save
export const businessSave = generateRequestFn('business_save.php')

// business_get
export const businessGet = generateRequestFn('business_get.php')

// =================== 员工管理 ======================
// employee_save
export const employeeSave = generateRequestFn('employee_save.php')

// employee_get
export const employeeGet = generateRequestFn('employee_get.php')

// =================== 角色管理 ======================
// role_save
export const roleSave = generateRequestFn('role_save.php')

// role_get
export const roleGet = generateRequestFn('role_get.php')

// =================== 商品管理 ======================
// goods_save
export const goodsSave = generateRequestFn('goods_save.php')

// goods_get
export const goodsGet = generateRequestFn('goods_get.php')

// =================== 手机机型管理 ======================
// phonebrand_get
export const phonebrandGet = generateRequestFn('phonebrand_get.php')

// phonebrand_save
export const phonebrandSave = generateRequestFn('phonebrand_save.php')

// phonemodel_get
export const phonemodelGet = generateRequestFn('phonemodel_get.php')

// phonemodel_save
export const phonemodelSave = generateRequestFn('phonemodel_save.php')

// =================== 手机机型管理 ======================
// material_get
export const materialGet = generateRequestFn('material_get.php')

// material_save
export const materialSave = generateRequestFn('material_save.php')

// =================== 订单管理 ======================
// order_get
export const orderGet = generateRequestFn('order_get.php')

// order_save
export const orderSave = generateRequestFn('order_save.php')

// =================== 生产单管理======================
// production_order_get
export const productionOrderGet = generateRequestFn('production_order_get.php')

// production_order_save
export const productionOrderSave = generateRequestFn('production_order_save.php')

// =================== 物流单管理 ======================
// delivery_order_get
export const deliveryOrderGet = generateRequestFn('delivery_order_get.php')

// delivery_order_save
export const deliveryOrderSave = generateRequestFn('delivery_order_save.php')

// =================== 充值申请 ======================
// recharge_get
export const rechargeGet = generateRequestFn('recharge_get.php')

// recharge_save
export const rechargeSave = generateRequestFn('recharge_save.php')

// =================== 对账单 ======================
// accounttrack_get
export const accounttrackGet = generateRequestFn('accounttrack_get.php')

// ==============================  business ================================
// buycart_get
export const buycartGet = generateRequestFn('buycart_get.php')

// buycart_save
export const buycartSave = generateRequestFn('buycart_save.php')

// tshop_get
export const tshopGet = generateRequestFn('tshop_get.php')

// warehouse_get
export const warehouseGet = generateRequestFn('warehouse_get.php')

// progress_get
export const progressGet = generateRequestFn('progress_get.php')

// task_get
export const taskGet = generateRequestFn('task_get.php')

// task_save
export const taskSave = generateRequestFn('task_save.php')
