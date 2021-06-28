import axios from '@/libs/api.request'
import { getToken } from "@/libs/util";

export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: 'user/login',
    data,
    method: 'post'
  })
}
// 可获取当前用户信息
export const getUserInfo = () => {
  const data = {
    t: getToken()
  }
  return axios.request({
    url: 'current_user',
    params: {
      username: data.t
    },
    method: 'get'
  })
}

// // 当前用户
// export const currentUser = () => {
//   return axios.request({
//     url: 'get_current_user',
//     method: 'get'
//   })
// }

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const queryUsers = (params) => {
  return axios.request({
    url: 'users',
    method: 'get',
    params: params
  })
}

export const AddUser = (data) => {
  return axios.request({
    url: 'adduser',
    method: 'post',
    data: data
  })
}
export const GetUserByUsername = (username) => {
  return axios.request({
    url: 'getUserByUsername/' + username,
    method: 'get',
    username: username
  })
}
export const changePassword = (username, data) => {
  return axios.request({
    url: 'user/' + username + '/password',
    method: 'put',
    username: username,
    data: data
  })
}

export const updateUser = (id, data) => {
  return axios.request({
    url: 'update_user/' + id,
    method: 'put',
    data: data
  })
}

// 养护人员列表
export const queryGroupUsers = (params) => {
  return axios.request({
    url: 'group_users',
    params: params
  })
}

export const addGroupUsers = (data) => {
  return axios.request({
    url: 'add_group_user',
    method: 'post',
    data: data
  })
}

export const deleteGroupUser = (id) => {
  return axios.request({
    url: 'delete_group_user/' + id,
    method: 'delete'
  })
}

export const updateGroupUser = (id, data) => {
  return axios.request({
    url: 'update_group_user/' + id,
    method: 'put',
    data: data
  })
}
// 组名信息
export const queryGroups = (params) => {
  return axios.request({
    url: 'groups',
    params: params
  })
}
