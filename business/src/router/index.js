import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/manage-goods/goodslist'
  },

  // 商品管理
  {
    path: '/manage-goods',
    component: Layout,
    name: 'manage-goods',
    meta: { title: '商品管理', icon: 'shangpinguanli' },
    hidden: false,
    alwaysShow: true,
    children: [
      {
        path: 'goodslist',
        name: 'goodslist',
        component: () => import('@/views/manage-goods/goodslist'),
        meta: { title: '商品列表', icon: 'shangpingliebiao' }
      },
      {
        path: 'shopcart',
        name: 'shopcart',
        component: () => import('@/views/manage-goods/shopcart/shopcart'),
        meta: { title: '我的购物车', icon: 'shoujijixing' }
      },
      {
        path: 'picture',
        name: 'picture',
        component: () => import('@/views/manage-system/Picture'),
        meta: { title: '图库管理', icon: 'tukuguanli' }
      },
      {
        path: 'norm/:goods_id',
        name: 'goodsnorm',
        hidden: true,
        component: () => import('@/views/manage-goods/SkuNorm'),
        meta: { title: '标品下单', activeMenu: '/manage-goods/goodslist' }
      },
      {
        path: 'diy/:goods_id',
        name: 'goodsdiy',
        hidden: true,
        component: () => import('@/views/manage-goods/SkuDiy'),
        meta: { title: 'DIY下单', activeMenu: '/manage-goods/goodslist' }
      },
      {
        path: 'tbnorm/:goods_id',
        name: 'tbgoodsnorm',
        hidden: true,
        component: () => import('@/views/manage-goods/SkuNormTb'),
        meta: { title: '标品下单', activeMenu: '/manage-goods/goodslist' }
      },
      {
        path: 'tbdiy/:goods_id',
        name: 'tbgoodsdiy',
        hidden: true,
        component: () => import('@/views/manage-goods/SkuDiyTb'),
        meta: { title: 'DIY下单', activeMenu: '/manage-goods/goodslist' }
      }
    ]
  },

  // 订单管理
  {
    path: '/manage-order',
    component: Layout,
    name: 'manage-order',
    hidden: false,
    alwaysShow: true,
    meta: { title: '订单管理', icon: 'dingdanguagnli' },
    children: [
      {
        path: 'list',
        name: 'orderList',
        component: () => import('@/views/manage-order/list'),
        meta: { title: '订单列表', icon: 'dingdanshenhe' }
      },
      {
        path: 'orderinfo',
        name: 'orderinfo',
        hidden: true,
        component: () => import('@/views/manage-order/orderinfo/orderinfo'),
        meta: { title: '订单详情', icon: 'dingdanchaxun', activeMenu: '/manage-order/list' }
      },
      {
        path: 'orderedit/:order_id',
        name: 'orderedit',
        hidden: true,
        component: () => import('@/views/manage-order/edit/shopcart'),
        meta: { title: '订单编辑', icon: 'dingdanchaxun', activeMenu: '/manage-order/list' }
      },
      {
        path: 'tborderedit/:order_id',
        name: 'tborderedit',
        hidden: true,
        component: () => import('@/views/manage-order/edit/ShopCartTB'),
        meta: { title: '订单编辑', icon: 'dingdanchaxun', activeMenu: '/manage-order/list' }
      }
    ]
  },

  // 财务管理
  {
    path: '/manage-finance',
    component: Layout,
    name: 'manage-finance',
    hidden: false,
    alwaysShow: true,
    meta: { title: '财务', icon: 'caiwu' },
    children: [
      {
        path: 'recharge',
        name: 'financeRecharge',
        component: () => import('@/views/manage-finance/recharge/recharge'),
        meta: { title: '账户充值', icon: 'chongzhishouli' }
      },
      {
        path: 'bill',
        name: 'financeBill',
        component: () => import('@/views/manage-finance/bill/bill'),
        meta: { title: '对账单', icon: 'duizhangdan' }
      }
    ]
  },

  // 系统管理
  {
    path: '/manage-system',
    component: Layout,
    name: 'manage-system',
    hidden: false,
    alwaysShow: true,
    meta: { title: '系统', icon: 'system' },
    children: [
      {
        path: 'backtask',
        name: 'backtask',
        component: () => import('@/views/manage-system/task/task'),
        meta: { title: '后台任务', icon: 'task' }
      },
      {
        path: 'shop',
        name: 'shop',
        component: () => import('@/views/manage-system/ShopInfo'),
        meta: { title: '账户信息', icon: 'shagnhuguanli' }
      },
      {
        path: 'changepassword',
        name: 'changepassword',
        component: () => import('@/views/manage-system/ChangePassword'),
        meta: { title: '修改密码', icon: 'canshupeizhi' }
      }
    ]
  },
  // { path: '/diy', component: () => import('@/views/manage-goods/DiyDesigner'), hidden: true },
  { path: '/test', component: () => import('@/views/test/test'), hidden: true },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
