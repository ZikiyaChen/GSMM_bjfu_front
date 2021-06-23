
import store from '@/store'

export default{
  deep: true,
  inserted (el, binding, vnode) {
    const { value } = binding
    const access = store.getters && store.getters.access  // 注意这里access跳转到module下的user.js中，获取state.access数组
    console.log('directive access',access)
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = access.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}

// export const hasRole = {
//   install(Vue) {
//     Vue.directive('hasRole', {
//       bind(el, binding, vnode) {
//         let roles = getStore("roles");
//         let value = binding.value.split(',')
//         let flag = true
//         for (let v of value) {
//           if (!roles.includes(v)) {
//             flag = false
//           }
//         }
//         if (!flag) {
//           el.parentNode.removeChild(el)
//         }
//       }
//     })
//   }
// }
