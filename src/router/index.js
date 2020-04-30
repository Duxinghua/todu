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
    redirect: '/home',
    children: [{
      path: '',
      name: 'Home',
      component: () => import('@/views/self/home/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/dayReport',
    component: Layout,
    children: [{
      path: 'index',
      name: 'DayReport',
      component: () => import('@/views/self/dayReport/index'),
      meta: { title: '配施日志', icon: 'dashboard' }
    },
    {
      path: 'projectList',
      name: 'DayProjectList',
      component: () => import('@/views/self/dayReport/projectList'),
      meta: { title: '项目列表', icon: 'dashboard' }
    },
    {
      path: 'projectList2',
      name: 'DayProjectList2',
      component: () => import('@/views/self/dayReport/projectList2'),
      meta: { title: '项目列表', icon: 'dashboard' }
    }
    ]
  },
  {
    path: '/monthReport',
    component: Layout,
    children: [{
      path: 'index',
      name: 'MonthReport',
      component: () => import('@/views/self/monthReport/index'),
      meta: { title: '周报', icon: 'dashboard' }
    },
    {
      path: 'projectList',
      name: 'MonthProjectList',
      component: () => import('@/views/self/monthReport/projectList'),
      meta: { title: '项目列表', icon: 'dashboard' }
    },
    {
      path: 'projectList2',
      name: 'MonthProjectList2',
      component: () => import('@/views/self/monthReport/projectList2'),
      meta: { title: '项目列表', icon: 'dashboard' }
    }
    ]
  },
  {
    path: '/sDayReport',
    component: Layout,
    children: [{
      path: 'index',
      name: 'SDayReport',
      component: () => import('@/views/admin/dayReport/index'),
      meta: { title: '配施日志', icon: 'dashboard' }
    },
    {
      path: 'personList',
      name: 'SDayPersonList',
      component: () => import('@/views/admin/dayReport/personList'),
      meta: { title: '人员列表', icon: 'dashboard' }
    }]
  },
  {
    path: '/sMonthReport',
    component: Layout,
    children: [{
      path: 'index',
      name: 'SMonthReport',
      component: () => import('@/views/admin/monthReport/index'),
      meta: { title: '配施日志', icon: 'dashboard' }
    },
    {
      path: 'personList',
      name: 'SMonthPersonList',
      component: () => import('@/views/admin/monthReport/personList'),
      meta: { title: '人员列表', icon: 'dashboard' }
    },
    {
      path: 'totalReport',
      name: 'TotalReport',
      component: () => import('@/views/admin/monthReport/totalReport'),
      meta: { title: '周报汇总', icon: 'dashboard' }
    }]
  },
  {
    path: '/notice',
    component: Layout,
    children: [{
      path: 'index',
      name: 'NoticeIndex',
      component: () => import('@/views/self/notice/index'),
      meta: { title: '公司公告', icon: 'dashboard' }
    }]
  },
  {
    path: '/countReport',
    component: Layout,
    children: [{
      path: 'index',
      name: 'CountReport',
      component: () => import('@/views/admin/countReport/index'),
      meta: { title: '统计', icon: 'dashboard' }
    }]
  },
  {
    path: '/oplog',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Oplog',
      component: () => import('@/views/admin/oplog/index'),
      meta: { title: '操作日志', icon: 'dashboard' }
    }]
  },
  {
    path: '/personData',
    component: Layout,
    children: [{
      path: 'index',
      name: 'PersonData',
      component: () => import('@/views/self/persondata/index'),
      meta: { title: '个人资料', icon: 'dashboard' }
    }]
  },
  {
    path: '/mailList',
    component: Layout,
    children: [{
      path: 'index',
      name: 'MailList',
      component: () => import('@/views/system/mailList'),
      meta: { title: '通讯录', icon: 'dashboard' }
    },
    {
      path: 'batchEdit',
      name: 'mailBatchEdit',
      component: () => import('@/views/admin/projects/batchEdit'),
      meta: { title: '批量编辑', icon: 'dashboard' }
    }]
  },
  {
    path: '/account',
    component: Layout,
    children: [{
      path: 'index',
      name: 'AccountIndex',
      component: () => import('@/views/system/account'),
      meta: { title: '账号管理', icon: 'dashboard' }
    }]
  },
  {
    path: '/projects',
    component: Layout,
    children: [{
      path: 'index',
      name: 'ProjectList',
      component: () => import('@/views/admin/projects/index'),
      meta: { title: '项目列表', icon: 'dashboard' }
    }, {
      path: 'batchEdit',
      name: 'ProjectBatchEdit',
      component: () => import('@/views/admin/projects/projectBatchEdit'),
      meta: { title: '批量编辑', icon: 'dashboard' }
    }, {
      path: 'personList',
      name: 'personList',
      component: () => import('@/views/admin/projects/personList'),
      meta: { title: '项目人员', icon: 'dashboard' }
    }, {
      path: 'selectPersonList',
      name: 'selectPersonList',
      component: () => import('@/views/admin/projects/selectPersonList'),
      meta: { title: '项目参与人员', icon: 'dashboard' }
    }
    ]
  },
  {
    path: '/system',
    component: Layout,
    children: [{
      path: 'authority',
      name: 'authority',
      component: () => import('@/views/system/authority'),
      meta: { title: '权限管理', icon: 'dashboard' }
    },
    {
      path: 'roles',
      name: 'roles',
      component: () => import('@/views/system/roles'),
      meta: { title: '角色管理', icon: 'dashboard' }
    }]
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
