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
      // {
      //   path: 'add',
      //   component: () => import('@/views/product-info/add'),
      //   meta: { title: '添加商品', icon: 'add' }
      // },
      // {
      //   path: 'edit/:id',
      //   component: () => import('@/views/product-info/edit'),
      //   meta: { title: '编辑商品' },
      //   hidden: true
      // }
      {
        path: 'add',
        component: () => import('@/views/product-info/info'),
        meta: { title: '添加商品', icon: 'add' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/product-info/info'),
        meta: { title: '编辑商品' },
        hidden: true
      }
    ]
  },
  {
    path: '/product-spec',
    component: Layout,
    redirect: '/product-spec/list',
    name: '商品规格属性管理',
    meta: { title: '商品规格属性管理', icon: 'spec' },
    alwaysShow: true,
    children: [
      {
        path: 'list',
        component: () => import('@/views/product-spec/list'),
        meta: { title: '商品规格属性列表', icon: 'list' }
      }
    ]
  },
  {
    path: '/shoppingCart-product',
    component: Layout,
    redirect: '/shoppingCart-product/list',
    name: '用户购物车商品管理',
    meta: { title: '用户购物车商品管理', icon: 'shoppingCart' },
    alwaysShow: true,
    children: [
      {
        path: 'list',
        component: () => import('@/views/shoppingCart-product/list'),
        meta: { title: '用户购物车商品列表', icon: 'list' }
      }
    ]
  },
  {
    path: '/banner',
    component: Layout,
    redirect: '/banner/firstPosition/list',
    name: '界面横幅管理',
    meta: { title: '界面横幅管理', icon: 'banner' },
    alwaysShow: true,
    children: [
      {
        path: 'firstPosition/list',
        component: () => import('@/views/banner/firstPosition/list'),
        meta: { title: '第一处横幅列表', icon: 'list' }
      },
      {
        path: 'secondPosition/list',
        component: () => import('@/views/banner/secondPosition/list'),
        meta: { title: '第二处横幅列表', icon: 'list' }
      }
    ]
  },
  {
    path: '/navigation',
    component: Layout,
    redirect: '/navigation/list',
    name: '界面导航管理',
    meta: { title: '界面导航管理', icon: 'navigation' },
    alwaysShow: true,
    children: [
      {
        path: 'list',
        component: () => import('@/views/navigation/list'),
        meta: { title: '导航列表', icon: 'list' }
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
