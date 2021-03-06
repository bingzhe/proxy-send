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
    redirect: '/manage-goods/goods'
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
        path: 'goods',
        name: 'goods',
        redirect: '/manage-goods/goods/list',
        access: '1',
        component: () => import('@/views/manage-goods/goods'),
        meta: { title: '商品列表', icon: 'shangpingliebiao' },
        children: [
          {
            path: 'list',
            name: 'list',
            hidden: true,
            component: () => import('@/views/manage-goods/goods/list'),
            meta: { title: '商品列表', activeMenu: '/manage-goods/goods' }
          },
          {
            path: 'edit',
            name: 'edit',
            hidden: true,
            component: () => import('@/views/manage-goods/goods/edit'),
            meta: { title: '商品编辑', activeMenu: '/manage-goods/goods' }
          }
        ]
      },
      {
        path: 'phone',
        name: 'goodsPhone',
        access: '2',
        component: () => import('@/views/manage-goods/phone'),
        meta: { title: '手机机型管理', icon: 'shoujijixing' }
      },
      {
        path: 'picture',
        name: 'goodsPicture',
        access: '3',
        component: () => import('@/views/manage-goods/picture'),
        meta: { title: '图库管理', icon: 'tukuguanli' }
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
        access: '4',
        meta: { title: '订单审核', icon: 'dingdanshenhe' }
      },
      {
        path: 'search',
        name: 'orderSearch',
        component: () => import('@/views/manage-order/search'),
        access: '5',
        meta: { title: '订单查询', icon: 'dingdanchaxun' }
      },
      {
        path: 'orderinfo',
        name: 'orderinfo',
        hidden: true,
        component: () => import('@/views/manage-order/orderinfo/orderinfo'),
        meta: { title: '订单详情', icon: 'dingdanchaxun', activeMenu: '/manage-order/list' }
      },
      {
        path: 'searchorderinfo',
        name: 'searchorderinfo',
        hidden: true,
        component: () => import('@/views/manage-order/orderinfo/searchOrderinfo'),
        meta: { title: '订单查询详情', icon: 'dingdanchaxun', activeMenu: '/manage-order/search' }
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
        access: '6',
        meta: { title: '充值受理', icon: 'chongzhishouli' }
      },
      {
        path: 'bill',
        name: 'financeBill',
        component: () => import('@/views/manage-finance/bill/bill'),
        access: '7',
        meta: { title: '对账单', icon: 'duizhangdan' }
      }
    ]
  },

  // 生产管理
  {
    path: '/manage-fabricate',
    component: Layout,
    name: 'manage-fabricate',
    hidden: false,
    alwaysShow: true,
    meta: { title: '生产管理', icon: 'shengcahnguanli' },
    children: [
      {
        path: 'list',
        name: 'fabricateList',
        component: () => import('@/views/manage-fabricate/product/list'),
        access: '8',
        meta: { title: '生产单管理', icon: 'shengchanguanli' }
      },
      {
        path: 'logistics',
        name: 'fabricateLogistics',
        component: () => import('@/views/manage-fabricate/logistics/logistics'),
        access: '9',
        meta: { title: '物流单管理', icon: 'wuliudanguanli' }
      },
      {
        path: 'deliver',
        name: 'fabricateDeliver',
        component: () => import('@/views/manage-fabricate/deliver/deliver'),
        access: '10',
        meta: { title: '发货管理', icon: 'fahuoguanli' }
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
        access: '11',
        component: () => import('@/views/manage-system/task/task'),
        meta: { title: '后台任务', icon: 'task' }
      },
      {
        path: 'shop',
        name: 'shop',
        access: '11',
        component: () => import('@/views/manage-system/shop/shop'),
        meta: { title: '商户管理', icon: 'shagnhuguanli' }
      },
      {
        path: 'shopinfo',
        name: 'shopinfo',
        hidden: true,
        component: () => import('@/views/manage-system/shop/ShopDetail'),
        meta: { title: '商户编辑', activeMenu: '/manage-system/shop' }
      },
      {
        path: 'warehouse',
        name: 'warehouse',
        access: '11',
        component: () => import('@/views/manage-system/warehouse/warehouse'),
        meta: { title: '仓库管理', icon: 'cangku' }
      },
      {
        path: 'staff',
        name: 'staff',
        component: () => import('@/views/manage-system/staff/staff'),
        access: '13',
        meta: { title: '员工管理', icon: 'yuangongguanli' }
      },
      {
        path: 'role',
        name: 'role',
        access: '14',
        component: () => import('@/views/manage-system/role/role'),
        meta: { title: '角色管理', icon: 'jueseguangli' }
      },
      {
        path: 'param',
        name: 'param',
        access: '12',
        component: () => import('@/views/manage-system/param/param'),
        meta: { title: '参数配置', icon: 'canshupeizhi' }
      }
      // {
      //   path: 'permission',
      //   name: 'permission',
      //   component: () => import('@/views/manage-system/permission/permission'),
      //   meta: { title: '权限管理', icon: 'table' }
      // }
    ]
  },

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
