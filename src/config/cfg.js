/*
 * [Rocky 2017-12-26 11:37:52]
 * 全局错误定义
 */
export const errcode = {
  OK: 0, // 正确
  SYS_ERR: -10001, // 系统出错
  PARAM_ERR: -10002, // 参数出错
  SYS_BUSY: -10003, // 系统忙
  USER_NO_EXIST: -10005, // 用户不存在
  USER_HAD_REG: -10006, // 此用户名已被注册
  USER_PASSWD_ERR: -10007, // 登录密码出错
  DATA_PASSWD_ERR: -10008, // 密码错误

  code: {
    '0': '正确',
    '-10001': '系统出错',
    '-10002': '参数出错',
    '-10003': '系统忙',
    '-10005': '用户不存在',
    '-10006': '登录手机号已被注册',
    // "-10006": "此用户名已被注册",
    '-10007': '账号或登录密码出错',
    // "-10007": "登录密码出错",
    '-10008': '密码错误'
  },
  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
  // /////////////////////////////////////////////////////////////////
  //
  //     无特殊要求，上定义不要改变，新加的出错码写下在，按10递增
  //
  // /////////////////////////////////////////////////////////////////

  // const xxx  = -200010       //出错描述

  /*
        * 注意同步修改 js/cfg.js --> errcode
        */
}

/*
 * 商品材质
 */
export const GOODS_MATERIAL = {
  GLASS: 1,
  SILICONE: 2,

  code: {
    1: '玻璃',
    2: '硅胶'
  },

  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}

/*
 * 商品类型
 */
export const GOODS_TYPE = {
  DIY: 1,
  NORM: 2,
  GIFT: 3,

  code: {
    1: '手机壳-DIY',
    2: '手机壳-标品',
    3: '礼品'
  },

  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}

/**
 *商品打印参数定位角
 */
export const GOODS_PRINT_POSITION = {
  LEFT_TOP: 1,
  LEFT_BOTTOM: 2,
  RIGHT_TOP: 3,
  RIGHT_BOTTOM: 4,

  code: {
    1: '左上',
    2: '左下',
    3: '右上',
    4: '右下'
  },

  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}
