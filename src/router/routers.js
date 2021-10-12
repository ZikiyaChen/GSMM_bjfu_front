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
      // {
      //   path: '/homeTest',
      //   name: 'homeTest',
      //   meta: {
      //     icon: 'md-home',
      //     title: '首页测试'
      //   },
      //   component: () => import('@/view/Maphome/homeTest')
      // }
    ]
  },
  {
    path: '/treeInfo/:tree_code',
    name: 'treeInfoSimple',
    meta: {
      title: '古树介绍',
      hideInMenu: true
    },
    component: () => import('@/view/survey/SimpleTreeInfo')
  },


  // {
  //   path: '',
  //   name: 'doc',
  //   meta: {
  //     title: '文档',
  //     href: 'https://lison16.github.io/iview-admin-doc/#/',
  //     icon: 'ios-book'
  //   }
  // },
  // 注：name需要去local中的lang下的zh-CN.js中解释survey代表的中文名是什么，解析成中文，侧拉菜单中的名称
  {
    path: '/survey',
    name: 'survey',
    meta: {
      title: '名木古树调查建档',
      icon: 'ios-book',
      access: ['超级管理员', '单位管理员', '调查人员']
    },
    component: Main,
    children: [
      {
        path: 'base_survey',
        name: 'base_survey_page',
        meta: {
          icon: 'ios-document',
          title: '名木古树信息',
          access: ['超级管理员', '单位管理员', '调查人员']
        },
        component: () => import('@/view/survey/base_survey.vue')
      },
      {
        path: 'right',
        name: 'right_page',
        meta: {
          icon: 'md-clipboard',
          title: '名木古树调查填表',
          hideInMenu: true
        },
        component: () => import('@/view/survey/right.vue')
      },

      // {
      //   path: 'tree_class',
      //   name: 'tree_class_page',
      //   meta: {
      //     icon: 'ios-document',
      //     title: '名木古树树种管理'
      //   },
      //   component: () => import('@/view/survey/TreeClass/TreeClass')
      // },
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
      {
        path: 'update/BasicInformation/:tree_code',
        name: 'BaseInfo',
        meta: {
          title: '名木古树基本信息',
          hideInMenu: true
        },
        component: () => import('@/view/survey/Modify/BasicInformation')

      },
      {
        path: 'update/environment/:tree_code',
        name: 'environmentUpdate',
        meta: {
          title: '生长环境评价分析',
          hideInMenu: true
        },
        component: () => import('@/view/survey/Modify/environmentUpdate')

      },
      {
        path: 'update/GrowthVigor/:tree_code',
        name: 'GrowthVigorUpdate',
        meta: {
          title: '生长势分析查看修改',
          hideInMenu: true
        },
        component: () => import('@/view/survey/Modify/GrowthVigorUpdate')

      },
      {
        path: 'update/Protect/:tree_code',
        name: 'ProtectUpdate',
        meta: {
          title: '已采取复壮保护措施情况与分析-查看修改',
          hideInMenu: true
        },
        component: () => import('@/view/survey/Modify/ProtectUpdate')

      },
    ]
  },

  {
    path: '/yh_manage',
    name: 'admin_yh_manage',
    meta: {
      title: '养护管理',
      icon: 'ios-folder-open',
      access: ['超级管理员', '单位管理员', '养护人员']
    },
    component: Main,
    children: [
      {
        path: 'yh_work_manage',
        name: 'admin_yh_work_manage',
        meta: {
          icon: 'ios-document',
          title: '养护任务结果管理',
          access: ['超级管理员', '单位管理员']
        },
        component: () => import('@/view/YangHuManage/YhManage/yh_work_manage')
      },
      {
        path: 'yh_allot_manage',
        name: 'admin_yh_allot_manage',
        meta: {
          icon: 'ios-document',
          title: '养护任务分配管理',
          access: ['单位管理员']
        },
        component: () => import('@/view/YangHuManage/YhManage/yh_allot_manage')
      },
      {
        path: 'yh_own_work',
        name: 'yh_own_work',
        meta: {
          icon: 'ios-document',
          title: '个人养护记录',
          access: ['养护人员']
        },
        component: () => import('@/view/YangHuManage/YhManage/yh_own_record')
      }
    ]

  },

  {
    name: 'system',
    path: '/system',
    component: Main,
    meta: {
      title: '系统管理',
      icon: "md-flower",
      access: ['超级管理员']
    },
    children: [
      {
        name: 'yh_options',
        path: 'yh_options',
        meta: {
          title: '养护选项管理',
          icon: "md-arrow-dropright-circle",
        },
        component: () => import('@/view/OptionManage/yh_classify_options/index')
      },
      {
        path: 'other',
        name: 'other',
        meta: {
          icon: 'ios-document',
          title: '其它信息管理'
        },
        component: () => import('@/view/OptionManage/other/index')
      },
      {
        path: 'species',
        name: 'species',
        meta: {
          icon: 'ios-document',
          title: '树种管理'
        },
        component: () => import('@/view/OptionManage/SpeciesManage/index')
      }
    ]
  },

  // {
  //   name: 'admin_users',
  //   path: '/users',
  //   component: Main,
  //   meta: {
  //     title: '用户中心',
  //     icon: 'md-people',
  //     access: ['超级管理员', '养护组长']
  //   },
  //   children: [
  //     {
  //       name: 'usermanager',
  //       path: 'managers',
  //       meta: {
  //         title: '用户管理',
  //         icon: 'md-people',
  //         access: ['超级管理员']
  //       },
  //       component: () => import('@/view/Userinfo/index')
  //     },
  //     {
  //       path: 'yhuser',
  //       name: 'admin_yhuser',
  //       meta: {
  //         icon: 'md-people',
  //         title: '养护人员管理',
  //         access: ['超级管理员', '养护组长']
  //       },
  //       component: () => import('@/view/Userinfo/YhUserManage')
  //     },
  //     {
  //       path: 'userinfo/:username',
  //       name: 'yh_userinfo',
  //       meta: {
  //         icon: 'md-people',
  //         title: '个人信息',
  //         hideInBread: true,
  //         hideInMenu: true,
  //         access: ['超级管理员', '养护组长', '养护人员']
  //       },
  //       component: () => import('@/view/Userinfo/userinfo')
  //     }
  //   ]
  // },

  {
    name: 'usersCenter',
    path: '/userCenter',
    component: Main,
    meta: {
      title: '用户中心',
      icon: 'md-people',
      access: ['超级管理员', '单位管理员']
    },
    children: [
      {
        name: 'userManage',
        path: 'manage',
        meta: {
          title: '用户管理',
          icon: 'md-people',
          access: ['超级管理员', '单位管理员']
        },
        component: () => import('@/view/UserManage/index')
      },
      {
        path: 'userinfo/:username',
        name: 'UserInfo',
        meta: {
          icon: 'md-people',
          title: '个人信息',
          hideInBread: true,
          hideInMenu: true,
          access: ['超级管理员', '单位管理员', '养护人员', '调查人员']
        },
        component: () => import('@/view/Userinfo/userinfo')
      }
    ]
  },

  // {
  //   name: 'yh_users',
  //   path: '/users',
  //   component: Main,
  //   meta: {
  //     title: '用户中心',
  //     icon: 'md-people',
  //     // access: ['养护人员','调查人员']
  //     hideInBread: true,
  //     hideInMenu: true
  //   },
  //   children: [
  //     {
  //       path: 'userinfo/:username',
  //       name: 'yh_userinfo',
  //       meta: {
  //         icon: 'md-people',
  //         title: '个人信息',
  //
  //       },
  //       component: () => import('@/view/Userinfo/userinfo')
  //     }
  //   ]
  // },

  // {
  //   path: '/join',
  //   name: 'join',
  //   component: Main,
  //   meta: {
  //     hideInBread: true
  //   },
  //   children: [
  //     {
  //       path: 'join_page',
  //       name: 'join_page',
  //       meta: {
  //         icon: '_qq',
  //         title: 'QQ群'
  //       },
  //       component: () => import('@/view/join-page.vue')
  //     }
  //   ]
  // },

  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },

  // {
  //   path: '/components',
  //   name: 'components',
  //   meta: {
  //     icon: 'logo-buffer',
  //     title: '组件'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'tree_select_page',
  //       name: 'tree_select_page',
  //       meta: {
  //         icon: 'md-arrow-dropdown-circle',
  //         title: '树状下拉选择器'
  //       },
  //       component: () => import('@/view/components/tree-select/index.vue')
  //     },
  //     {
  //       path: 'count_to_page',
  //       name: 'count_to_page',
  //       meta: {
  //         icon: 'md-trending-up',
  //         title: '数字渐变'
  //       },
  //       component: () => import('@/view/components/count-to/count-to.vue')
  //     },
  //     {
  //       path: 'drag_list_page',
  //       name: 'drag_list_page',
  //       meta: {
  //         icon: 'ios-infinite',
  //         title: '拖拽列表'
  //       },
  //       component: () => import('@/view/components/drag-list/drag-list.vue')
  //     },
  //     {
  //       path: 'drag_drawer_page',
  //       name: 'drag_drawer_page',
  //       meta: {
  //         icon: 'md-list',
  //         title: '可拖拽抽屉'
  //       },
  //       component: () => import('@/view/components/drag-drawer')
  //     },
  //     {
  //       path: 'org_tree_page',
  //       name: 'org_tree_page',
  //       meta: {
  //         icon: 'ios-people',
  //         title: '组织结构树'
  //       },
  //       component: () => import('@/view/components/org-tree')
  //     },
  //     {
  //       path: 'tree_table_page',
  //       name: 'tree_table_page',
  //       meta: {
  //         icon: 'md-git-branch',
  //         title: '树状表格'
  //       },
  //       component: () => import('@/view/components/tree-table/index.vue')
  //     },
  //     {
  //       path: 'cropper_page',
  //       name: 'cropper_page',
  //       meta: {
  //         icon: 'md-crop',
  //         title: '图片裁剪'
  //       },
  //       component: () => import('@/view/components/cropper/cropper.vue')
  //     },
  //     {
  //       path: 'tables_page',
  //       name: 'tables_page',
  //       meta: {
  //         icon: 'md-grid',
  //         title: '多功能表格'
  //       },
  //       component: () => import('@/view/components/tables/tables.vue')
  //     },
  //     {
  //       path: 'split_pane_page',
  //       name: 'split_pane_page',
  //       meta: {
  //         icon: 'md-pause',
  //         title: '分割窗口'
  //       },
  //       component: () => import('@/view/components/split-pane/split-pane.vue')
  //     },
  //     {
  //       path: 'markdown_page',
  //       name: 'markdown_page',
  //       meta: {
  //         icon: 'logo-markdown',
  //         title: 'Markdown编辑器'
  //       },
  //       component: () => import('@/view/components/markdown/markdown.vue')
  //     },
  //     {
  //       path: 'editor_page',
  //       name: 'editor_page',
  //       meta: {
  //         icon: 'ios-create',
  //         title: '富文本编辑器'
  //       },
  //       component: () => import('@/view/components/editor/editor.vue')
  //     },
  //     {
  //       path: 'icons_page',
  //       name: 'icons_page',
  //       meta: {
  //         icon: '_bear',
  //         title: '自定义图标'
  //       },
  //       component: () => import('@/view/components/icons/icons.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/update',
  //   name: 'update',
  //   meta: {
  //     icon: 'md-cloud-upload',
  //     title: '数据上传'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'update_table_page',
  //       name: 'update_table_page',
  //       meta: {
  //         icon: 'ios-document',
  //         title: '上传Csv'
  //       },
  //       component: () => import('@/view/update/update-table.vue')
  //     },
  //     {
  //       path: 'update_paste_page',
  //       name: 'update_paste_page',
  //       meta: {
  //         icon: 'md-clipboard',
  //         title: '粘贴表格数据'
  //       },
  //       component: () => import('@/view/update/update-paste.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/excel',
  //   name: 'excel',
  //   meta: {
  //     icon: 'ios-stats',
  //     title: 'EXCEL导入导出'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'upload-excel',
  //       name: 'upload-excel',
  //       meta: {
  //         icon: 'md-add',
  //         title: '导入EXCEL'
  //       },
  //       component: () => import('@/view/excel/upload-excel.vue')
  //     },
  //     {
  //       path: 'export-excel',
  //       name: 'export-excel',
  //       meta: {
  //         icon: 'md-download',
  //         title: '导出EXCEL'
  //       },
  //       component: () => import('@/view/excel/export-excel.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/tools_methods',
  //   name: 'tools_methods',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'tools_methods_page',
  //       name: 'tools_methods_page',
  //       meta: {
  //         icon: 'ios-hammer',
  //         title: '工具方法',
  //         beforeCloseName: 'before_close_normal'
  //       },
  //       component: () => import('@/view/tools-methods/tools-methods.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/i18n',
  //   name: 'i18n',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'i18n_page',
  //       name: 'i18n_page',
  //       meta: {
  //         icon: 'md-planet',
  //         title: 'i18n - {{ i18n_page }}'
  //       },
  //       component: () => import('@/view/i18n/i18n-page.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/error_store',
  //   name: 'error_store',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'error_store_page',
  //       name: 'error_store_page',
  //       meta: {
  //         icon: 'ios-bug',
  //         title: '错误收集'
  //       },
  //       component: () => import('@/view/error-store/error-store.vue')
  //     }
  //   ]
  // },
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
