// import Main from '@/components/main'
//
// export default{
//   name: 'users',
//   path: '/users',
//   component: Main,
//   meta: {
//     title: '用户中心',
//     icon: 'md-people',
//   },
//   children: [
//     {
//       name: 'usermanager',
//       path: 'managers',
//       meta: {
//         title: '用户管理'
//       },
//       component: () => import('@/view/Userinfo/index')
//     },
//     {
//       path: 'userinfo', // xzl
//       name: 'userinfo',
//       meta: {
//         hideInMenu: true,
//         title: '用户个人信息'
//       },
//       component: () => import('@/view/Userinfo/userinfo')
//     }
//
//     // {
//     //   path: 'profile/:username', // xzl
//     //   name: '用户详情页',
//     //   meta: {
//     //     hideInMenu: true
//     //   },
//     //   component: resolve => require(['Views/Profile/index'], resolve)
//     // }
//   ]
// }
