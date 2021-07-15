import {
  login,
  logout,
  getUserInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    username: '',
    userId: '',
    userInfo: {},
    avatarImgPath: '',
    token: getToken(),
    access: [],
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUsername (state, name) {
      state.username = name
    },
    setUserInfo (state, resData) {
      state.userInfo = resData
      state.userId = resData.id
      state.username = resData.username
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    access: state => {
      return state.access
    },
    userInfo: state => {
      return state.userInfo
    },
    username: state =>{
      return state.username
    },
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { username, password }) {
      username = username.trim()
      password = password.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          console.log('login',res)
          const data = res.data
          console.log('后台返回的数据',res.data)
          console.log('token==',data.token)
          commit('setToken', data.token)
          resolve()
        }).catch(err => {
          reject(err)
          console.log('报错的信息',err)

        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //   commit('setToken', '')
        //   commit('setAccess', [])
        //   resolve()
        // }).catch(err => {
        //   reject(err)
        // })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setToken', '')
        commit('setAccess', [])
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          console.log('#',state.token)
          getUserInfo().then(res => {
          // getUserInfo().then(res => {
            console.log('getUserinfo',res)
            // localStorage.setItem('loginxinix', res.data)
            // localStorage.getItem('loginxinix')
            const data = res.data

            commit('setAvatar', 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png')
            commit('setUsername', data.current_user.username)
            commit('setUserId', data.current_user.id)
            commit('setUserInfo', data.current_user)
            // let roles = []
            // if(data.current_user.role_names.includes('组长') && data.current_user.is_yh === true){
            // roles= data.current_user.role_names.filter(item => item !== '养护人员'); // 过滤掉值不为3,返回新数组
            //   console.log('%%%%',roles)
            //   commit('setAccess', roles)
            // }else {
            //   commit('setAccess', data.current_user.role_names)
            // }

            if(data.current_user.role_names.includes('养护组长')){
              commit('setAccess', ['养护组长'])
            }else if(data.current_user.role_names.includes('调查组长')){
              commit('setAccess', ['调查组长'])
            }else {
              commit('setAccess', data.current_user.role_names)
            }

            // commit('setAccess', data.current_user.role_names)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },


    // getUserInfo ({ state, commit }) {
    //   return new Promise((resolve, reject) => {
    //     currentUser().then(res => {
    //       console.log(res)
    //       const data = res.data
    //       commit('setAvatar', 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png')
    //       commit('setUsername', data.current_user.username)
    //       commit('setUserId', data.current_user.id)
    //       commit('setAccess', data.current_user.role_names)
    //       commit('setHasGetInfo', true)
    //       resolve(data)
    //     }).catch(err => {
    //
    //       reject(err)
    //     })
    //   })
    // },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      getUnreadCount().then(res => {
        const { data } = res
        commit('setMessageCount', data)
      })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage().then(res => {
          const { unread, readed, trash } = res.data
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageReadedList', readed.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(msg_id).then(res => {
            const content = res.data
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
