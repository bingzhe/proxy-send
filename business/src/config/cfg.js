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
  DATA_CHANGE: -10009, // 数据已有变动（刷新后再修改）
  DATA_OWNER_ERR: -10010, // 不是当前用户的数据
  DATA_KEY_USED: -10011, // key已被使用
  USER_NAME_EMPTY: -10012, // 用户名不能为空
  FILE_NOT_EXIST: -10013, // 文件不存在
  CREATE_ZIPFILE_ERR: -10014, // 创建zip压缩文件出错
  FILE_UPLOAD_ERR: -10015, // 文件上传出错
  OPEN_ZIPFILE_ERR: -10016, // 打开压缩文件出错
  NO_BAK_FILE: -10017, // 文件格式出错（不是备份文件）
  BAKFILE_DATA_ERR: -10018, // 备份文件中数据出错
  BAKFILE_PASSWD_ERR: -10019, // 备份文件密码出错
  USER_NOLOGIN: -10020, // 用户未登录
  USER_LOGINED: -10021, // 用户已经登录过
  DATA_KEY_NOT_EXIST: -10022, // 通讯用key不存在
  DB_OPR_ERR: -10023, // 数据库操作出错
  PHONE_IS_EXIST: -10026, // 手机号已被使用
  USER_SETTING_ERR: -10028, // 设置登录用户出错
  EMAIL_IS_EXIST: -10029, // 邮箱已被使用
  NOT_BIND_PHONE: -10030, // 不是绑定的手机号码
  CFG_NO_EXIST: -20001, // 配置文件不存在
  CFG_WRITE_ERR: -20002, // 配置文件写入出错
  GOODS_SERIAL_USED: -20003, // 货品编号已被使用
  CLASS_NAME_USED: -20004, // 类别名已存在
  GOODS_NOT_EXIST: -20005, // 货品不存在
  USER_OLD_PASSWD_ERR: -20006, // 原密码错误
  FILE_IS_DIR: -20007, // 是个目录
  FILE_BAK_ERR: -20008, // 备份文件出错
  FILE_PATH_ERR: -20009, // 路径出错
  FILE_WRITE_ERR: -20010, // 文件写入出错
  USER_PERMISSION_ERR: -20011, // 操作权限不足
  FILE_NO_EXIST: -20012, // 文件不存在
  LOG_OPR_ERR: -20013, // 日志操作出错
  LOG_NO_EXIST: -20014, // 日志不存在
  DB_ERR: -20030, // 数据库操作出错
  UPDATE_PACK_ERR: -20031, // 升级包出错
  BATCH_FILE_NOT_UNIQ: -20032, // 同批次文件中存在相同文件
  NOT_GROUP_FILE: -20033, // 没有组文件
  NAME_IS_EXIST: -20034, // 名称已存在
  HOTEL_NOT_EXIST: -20035, // 酒店不存在
  PHONE_ERR: -20037, // 手机号码不正确
  EMAIL_ERR: -20038, // 邮箱不正确
  MAIL_CODE_ERR: -20039, // 邮箱密文不正确
  COKE_ERR: -20040, // 验证码不正确
  SHOP_LABEL_ERR: -20041, // 标签名为空
  PHONE_COKE_ERR: -20042, // 手机验证不正确
  PHONE_SEND_FAIL: -20043, // 手机发送失败
  NEWS_NUM_MAX: -20044, // 发送消息数超出限制
  PASSWORD_TWO_SAME: -20045, // 2次输入的密码不一样
  EMAIL_SEND_FAIL: -20046, // 邮箱发送失败
  DEPARTMENT_IS_EXIST: -20047, // 部门名称重复
  IDCARD_ERR: -20048, // 身份证号码不正确
  PHONE_VERIFY_ERR: -20049, // 手机验证过程出错
  USER_NOT_ZC: -20050, // 用户没有注册

  code: {
    '0': '正确',
    '-10001': '系统出错',
    '-10002': '参数出错',
    '-10003': '系统忙',
    '-10005': '用户不存在',
    '-10006': '登录手机号已被注册',
    // "-10006": "此用户名已被注册",
    '-10007': '用户名或密码不正确',
    // "-10007": "登录密码出错",
    '-10008': '密码错误',
    '-10009': '数据已有变动（刷新后再修改）',
    '-10010': '不是当前用户的数据',
    '-10011': 'key已被使用',
    '-10012': '用户名不能为空',
    '-10013': '文件不存在',
    '-10014': '创建zip压缩文件出错',
    '-10015': '文件上传出错',
    '-10016': '打开压缩文件出错',
    '-10017': '文件格式出错（不是备份文件）',
    '-10018': '备份文件中数据出错',
    '-10019': '备份文件密码出错',
    '-10020': '用户未登录',
    '-10021': '用户已经登录过',
    '-10022': '通讯用key不存在',
    '-10023': '数据库操作出错',
    '-10024': '数据不存在',
    '-10026': '手机号已被使用',
    '-10028': '设置登录用户出错',
    '-10029': '邮箱已被使用',
    '-10030': '不是绑定的手机号码',
    '-20001': '配置文件不存在',
    '-20002': '配置文件写入出错',
    '-20003': '货品编号已被使用',
    '-20004': '类别名已存在',
    '-20005': '货品不存在',
    '-20006': '原密码错误',
    '-20007': '是个目录',
    '-20008': '备份文件出错',
    '-20009': '路径出错',
    '-20010': '文件写入出错',
    '-20011': '操作权限不足',
    '-20012': '文件不存在',
    '-20013': '日志操作出错',
    '-20014': '日志不存在',
    '-20030': '数据库操作出错',
    '-20031': '升级包出错',
    '-20032': '同批次文件中存在相同文件',
    '-20033': '没有组文件',
    '-20034': '名称已存在',
    // '-20035': '酒店不存在',
    // '-20037': '电话号码不正确',
    // '-20038': '邮箱不正确',
    // '-20039': '邮箱密文不正确',
    // '-20040': '验证码输入不正确，请重新输入',
    // '-20041': '标签名为空',
    // '-20042': '手机验证码不正确',
    // '-20043': '手机发送失败',
    // '-20044': '发送消息数超出限制',
    // '-20045': '2次输入的密码不一样',
    // '-20046': '邮箱发送失败',
    // '-20047': '部门名称重复',
    // '-20048': '身份证号码不正确',
    // '-20049': '手机验证过程出错',
    // '-20050': '用户没有注册',
    '-20047': '员工不存在',
    '-20049': '客户不存在',
    '-20067': '无权设置权限',
    '-20070': '不能结冻自已',
    '-60100': '登录验证码出错'
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

  /**
   *  注意同步修改 js/cfg.js --> errcode
   */
}

// ================== 商品管理 ============================
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

/**
 * 商品状态
 */
export const GOODS_STATUS = {
  OFF: 1,
  ON: 2,

  code: {
    1: '未上架',
    2: '已上架'
  },

  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}
// ================== 手机型号管理 ============================
/**
 * 手机型号状态
 */
export const PHONE_STATUS = {
  NORMAL: 1,
  DISABLE: 2,

  code: {
    1: '正常',
    2: '停用'
  },

  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}
// ================== 图片素材管理 ============================
/**
 * 图片素材状态
 */
export const PICTURE_STATUS = {
  NORMAL: 1,
  DISABLE: 2,

  code: {
    1: '正常',
    2: '停用'
  },

  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}
// ================== 订单管理 ============================
/**
 * 订单状态
 */
export const ORDER_STATUS = {
  AUDIT_WAIT: 1,
  AUDIT_FAIL: 2,
  DELIVERY_WAIT: 3,
  DELIVERY_SUC: 4,
  REVOCAT: 5,
  REFUND: 6,
  COMPLETE: 7,
  REPLENISH_WAIT: 8,
  FREEZE: 9,
  ERROR: 10,

  code: {
    1: '待审核',
    2: '审核未通过',
    3: '待发货',
    4: '已发货',
    5: '已撤销',
    6: '已退款',
    7: '已完成',
    8: '待处理',
    9: '已冻结',
    10: '异常'
  },

  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}
// ================== 财务 ============================
/**
 *充值状态
 */
export const RECHARGE_STATUS = {
  AUDIT: 1,
  FAIL: 2,
  SUCCESS: 3,

  code: {
    1: '待审核',
    2: '充值失败',
    3: '充值成功'
  },

  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}

/**
 * 充值渠道
 */
export const RECHARGE_CHANNEL = {
  WX: 1,
  ALIPAY: 2,
  OTHER: 3,

  code: {
    1: '微信',
    2: '支付宝',
    3: '其他'
  },

  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}
/**
 * 操作类型
 */
export const OPR_TYPE = {
  RECHARGE: 1,
  ORDER: 2,
  ADJUST_ORDER_FEE: 3,
  ORDER_FAIL_REFUND: 4,
  ADUIT_FAIL_REFUND: 5,
  ADJUST_BALANCE: 6,
  REFUND: 7,

  code: {
    1: '充值',
    2: '下单',
    3: '调整订单金额',
    4: '撤销订单退款',
    5: '审核不通过退款',
    6: '调整账户余额',
    7: '退款'
  },

  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}

// ================== 商户管理 ============================

/**
 * 商户状态
 */
export const BUSINESS_STATUS = {
  NORMAL: 1,
  DISABLE: 2,

  code: {
    1: '正常',
    2: '停用'
  },

  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}

/**
 * 是否可以使DIY设计器
 */
export const CANUSE_DESIGNERDIV = {
  NO: 0,
  YES: 1,

  code: {
    0: '不能使用',
    1: '可使用'
  },

  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}

// ================== 员工管理 ============================

/**
 * 员工状态
 */
export const STAFF_STATUS = {
  NORMAL: 1,
  DISABLE: 2,

  code: {
    1: '正常',
    2: '停用'
  },

  toString: function(code) {
    code = parseInt(code || 0)
    return this.code[code] || '未知[' + code + ']'
  }
}
/**
 * 日期选择配置项
 */
export const pickerOptions = {
  shortcuts: [
    {
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }
  ]
}
