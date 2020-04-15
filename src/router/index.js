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
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '控制台', icon: 'dashboard' }
    }]
  },

  {
    path: '/admin-user',
    component: Layout,
    redirect: '/admin-user/list',
    name: '管理员管理',
    meta: { title: '管理员管理', icon: 'peoples' },
    alwaysShow: true,
    children: [
      {
        path: 'list',
        component: () => import('@/views/admin-user/list'),
        meta: { title: '管理员列表', icon: 'list' }
      },
      {
        path: 'add',
        component: () => import('@/views/admin-user/add'),
        meta: { title: '新增管理员', icon: 'user' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/admin-user/edit'),
        meta: { title: '编辑管理员' },
        hidden: true
      }
    ]
  },

  {
    path: '/product-category',
    component: Layout,
    redirect: '/product-category/list',
    name: '商品分类管理',
    meta: { title: '商品分类管理', icon: 'form' },
    alwaysShow: true,
    children: [
      {
        path: 'list',
        component: () => import('@/views/product-category/list'),
        meta: { title: '商品分类列表', icon: 'tree' }
      }
    ]
  },
  {
    path: '/product-info',
    component: Layout,
    redirect: '/product-info/list',
    name: '商品详情信息管理',
    meta: { title: '商品详情信息管理', icon: 'goods' },
    alwaysShow: true,
    children: [
      {
        path: 'list',
        component: () => import('@/views/product-info/list'),
        meta: { title: '商品详情信息列表', icon: 'list' }
      },
      {
        path: 'add',
        component: () => import('@/views/product-info/add'),
        meta: { title: '添加商品', icon: 'add' }
      }
    ]
  },

  {
    path: '外链',
    component: Layout,
    children: [
      {
        path: 'https://www.google.com',
        meta: { title: '谷歌', icon: 'link' }
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
