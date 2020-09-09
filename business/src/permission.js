import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import { getBusinessId, delBusinessId } from '@/config/global-store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// 订单还在编辑时候的路由
const orderEditList = [
  '/manage-order/tborderedit',
  '/manage-goods/goodslist',
  '/manage-goods/tbnorm',
  '/manage-goods/tbdiy'
]

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 进入编辑没有用到的路由，修改订单编辑状态
  const isEditRouter = orderEditList.some((item) => to.path.includes(item))
  if (!isEditRouter) {
    if (store.state.orderEdit.isEdit) {
      store.commit('orderEdit/updateIsOrderEdit', false)
    }
  }

  // 订单编辑过程中，页面刷新后编辑中断，商品下单页面跳回商品列表页面
  if (
    !store.state.orderEdit.isEdit &&
    (to.path.includes('/manage-goods/tbnorm') || to.path.includes('/manage-goods/tbdiy'))
  ) {
    next({ path: '/manage-goods/goodslist' })
  }

  // determine whether the user has logged in
  // const hasToken = getToken()
  const businessid = getBusinessId()

  if (businessid) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const siteInfo = store.state.user.siteInfo
      const hasSiteInfo = JSON.stringify(siteInfo) !== '{}'

      if (hasSiteInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getUserInfo')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          // await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          delBusinessId()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
