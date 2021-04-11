import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  // {
  //   path: '/',
  //   name: '_home',
  //   redirect: '/home',
  //   component: Main,
  //   meta: {
  //     hideInMenu: true,
  //     notCache: true
  //   },
  //   children: [
  //     {
  //       path: '/home',
  //       name: 'home',
  //       meta: {
  //         hideInMenu: true,
  //         title: '首页',
  //         notCache: true,
  //         icon: 'md-home'
  //       },
  //       component: () => import('@/view/single-page/home')
  //     }
  //   ]
  // },
  // {
  //   path: '/',
  //   name: '_home',
  //   redirect: '/home',
  //   component: Main,
  //   meta: {
  //     hideInBread: true,
  //
  //   },
  //   children: [
  //     {
  //       path: '/home',
  //       name: 'home',
  //       meta: {
  //         icon: 'md-home',
  //         title: '首页'
  //       },
  //       component: () => import('@/view/single-page/home')
  //     }
  //   ]
  // },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInBread: true,

    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          icon: 'md-home',
          title: '首页'
        },
        component: () => import('@/view/Maphome/home')
      }
    ]
  },

  {
    path: '',
    name: 'doc',
    meta: {
      title: '文档',
      href: 'https://lison16.github.io/iview-admin-doc/#/',
      icon: 'ios-book'
    }
  },
  // 注：name需要去local中的lang下的zh-CN.js中解释survey代表的中文名是什么，解析成中文，侧拉菜单中的名称
  {
    path: '/survey',
    name: 'survey',
    meta: {
      title: '名木古树调查建档',
      icon: 'ios-book'
    },
    component: Main,
    children: [
      {
        path: 'base_survey',
        name: 'base_survey_page',
        meta: {
          icon: 'ios-document',
          title: '名木古树信息'
        },
        component: () => import('@/view/survey/base_survey.vue')
      },
      {
        path: 'right',
        name: 'right_page',
        meta: {
          icon: 'md-clipboard',
          title: '名木古树调查填表'
        },
        component: () => import('@/view/survey/right.vue')
      },
      {
        path: 'environment/:tree_code',
        name: 'environment',
        meta: {
          title: '生长环境评估分析',
          hideInMenu: true
        },
        component: () => import('@/view/survey/environment')
      },
      {
        path: 'GrowthVigor/:tree_code',
        name: 'growth_vigor',
        meta: {
          title: '生长势分析',
          hideInMenu: true
        },
        component: () => import('@/view/survey/GrowthVigor')
      },
      {
        path: 'Protect/:tree_code',
        name: 'protect',
        meta: {
          title: '已采取复壮保护措施情况与分析',
          hideInMenu: true
        },
        component: () => import('@/view/survey/Protect')
      },
      {
        path: 'damage/:tree_code',
        name: 'damage',
        meta: {
          title: '树体损伤情况评估',
          hideInMenu: true
        },
        component: () => import('@/view/survey/damage')
      },
      {
        path: 'Incline/:tree_code',
        name: 'incline',
        meta: {
          title: '树体倾斜、空腐情况检测',
          hideInMenu: true
        },
        component: () => import('@/view/survey/Incline')
      },
      {
        path: 'Diseases/:tree_code',
        name: 'diseases',
        meta: {
          title: '病虫害发生情况分析',
          hideInMenu: true
        },
        component: () => import('@/view/survey/Diseases')
      },
    ]
  },

  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
