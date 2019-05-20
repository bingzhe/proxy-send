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
        resp => {
          if (resp.ret !== 0) {
            if (showErrTip) {
              Vue.prototype.$message.error(resp.msg)
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
