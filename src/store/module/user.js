import {
  login,
  getUserInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount
} from '@/api/user'
import {setToken, getToken, localSave} from '@/libs/util'

export default {
  state: {
    username: '',
    userId: '',
    userInfo: {},
    current_role: '',
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
      console.log('setAccess',access)
      state.access = access
    },

    setCurrentAccess(state,status){
      console.log(status)
      state.current_role = status
    },
    setIs(state,status){
      console.log('state',state,status)
      if(status === '调查人员'){
        state.userInfo.is_yh = false
        state.userInfo.is_dc = true
        state.userInfo.is_unitAdmin = false
      }else if(status === '养护人员'){
        state.userInfo.is_yh = true
        state.userInfo.is_dc = false
        state.userInfo.is_unitAdmin = false
      }else if(status === '单位管理员'){
        state.userInfo.is_yh = false
        state.userInfo.is_dc = false
        state.userInfo.is_unitAdmin = true
      }
    }
    ,

    // judgeSuperAccess(state,resData){
    //   let arr = ['超级管理员','单位管理员','调查人员','养护人员']
    //   for(let i=0;i<arr.length;i++){
    //     if(resData.role_names.indexOf(arr[i])>-1){
    //       state.access=[arr[i]]
    //       if(state.access.indexOf())
    //         break
    //     }
    //     else {
    //       state.access=[]
    //     }
    //   }
    // },
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
    username: state => {
      return state.username
    },
    current_role: state =>{
      return state.current_role
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
          console.log('login', res)
          const data = res.data
          console.log('后台返回的数据', res.data)
          console.log('token==', data.token)
          commit('setToken', data.token)
          resolve()
        }).catch(err => {
          reject(err)
          console.log('报错的信息', err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        localSave('tagNaveList',[])//退出登录时，清空tagNavList快捷导航的缓存
        //之前因为缓存没清，切换用户时，会记住上一个用户的导航栏
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
        sessionStorage.removeItem('store')
        // commit('judgeSuperAccess', { role_names: [], id: 0, userName: '' })
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          console.log('#', state.token)
          getUserInfo().then(res => {
            console.log('getUserinfo', res)
            const data = res.data

            commit('setAvatar', 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png')
            commit('setUsername', data.current_user.username)
            commit('setUserId', data.current_user.id)
            commit('setHasGetInfo', true)

            if(sessionStorage.getItem('store')) {
              let now_store = JSON.parse(sessionStorage.getItem('store'))
              commit('setUserInfo', now_store.user.userInfo)
              commit('setCurrentAccess', now_store.user.current_role)
              commit('setAccess', now_store.user.access)

            }else {
              commit('setUserInfo', data.current_user)
              commit('setCurrentAccess', data.current_user.role_names[0])
              if (data.current_user.is_reader === true) {
                commit('setAccess', ['单位管理员'])
              } else {
                commit('setAccess', data.current_user.role_names)
              }
              console.log('55', state.access)


            }
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
