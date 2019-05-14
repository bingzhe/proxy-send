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
    redirect: '/manage-goods'
  },

  // 商品管理
  {
    path: '/manage-goods',
    component: Layout,
    name: 'manage-goods',
    meta: { title: '商品管理', icon: 'example' },
    children: [
      {
        path: 'goods',
        name: 'goods',
        redirect: '/manage-goods/goods/list',
        component: () => import('@/views/manage-goods/goods'),
        meta: { title: '商品列表', icon: 'table' },
        children: [
          {
            path: 'list',
            name: 'list',
            hidden: true,
            component: () => import('@/views/manage-goods/goods/list'),
            meta: { title: '商品列表', icon: 'table', activeMenu: '/manage-goods/goods' }
          },
          {
            path: 'edit',
            name: 'edit',
            hidden: true,
            component: () => import('@/views/manage-goods/goods/edit'),
            meta: { title: '商品编辑', icon: 'table', activeMenu: '/manage-goods/goods' }
          }
        ]
      },
      {
        path: 'phone',
        name: 'goodsPhone',
        component: () => import('@/views/manage-goods/phone'),
        meta: { title: '手机机型管理', icon: 'table' }
      },
      {
        path: 'picture',
        name: 'goodsPicture',
        component: () => import('@/views/manage-goods/picture'),
        meta: { title: '图库管理', icon: 'table' }
      }
    ]
  },

  // 订单管理
  {
    path: '/manage-order',
    component: Layout,
    name: 'manage-order',
    meta: { title: '订单管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'orderList',
        component: () => import('@/views/manage-order/list'),
        meta: { title: '订单审核', icon: 'table' }
      },
      {
        path: 'search',
        name: 'orderSearch',
        component: () => import('@/views/manage-order/search'),
        meta: { title: '订单查询', icon: 'table' }
      }
    ]
  },

  // 财务管理
  {
    path: '/manage-finance',
    component: Layout,
    name: 'manage-finance',
    meta: { title: '财务', icon: 'example' },
    children: [
      {
        path: 'recharge',
        name: 'financeRecharge',
        component: () => import('@/views/manage-finance/recharge'),
        meta: { title: '充值受理', icon: 'table' }
      },
      {
        path: 'bill',
        name: 'financeBill',
        component: () => import('@/views/manage-finance/bill'),
        meta: { title: '对账单', icon: 'table' }
      }
    ]
  },
  // 生产管理
  {
    path: '/manage-fabricate',
    component: Layout,
    name: 'manage-fabricate',
    meta: { title: '生产管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'fabricateList',
        component: () => import('@/views/manage-fabricate/list'),
        meta: { title: '生产单管理', icon: 'table' }
      },
      {
        path: 'logistics',
        name: 'fabricateLogistics',
        component: () => import('@/views/manage-fabricate/logistics'),
        meta: { title: '物流单管理', icon: 'table' }
      },
      {
        path: 'deliver',
        name: 'fabricateDeliver',
        component: () => import('@/views/manage-fabricate/deliver'),
        meta: { title: '发货管理', icon: 'table' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
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
