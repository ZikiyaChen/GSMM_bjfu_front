import axios from "@/libs/api.request";
// 树木检测信息
export const queryTrunkDetections = (params) => {
  return axios.request({
    url: 'trunks',
    method: 'get',
    params: params
  })
}
export const getTrunkDetection = (id) => {
  return axios.request({
    url: 'trunk/'+ id,
    method: 'get',
  })
}

export const insertTrunk = (data) => {
  return axios.request({
    url: 'insert_trunk',
    method: 'post',
    data: data
  })
}

export const updateTrunk= (id, data) => {
  return axios.request({
    url: 'update_trunk/' + id,
    method: 'put',
    id: id,
    data: data
  })
}
export const deleteTrunk = (id) => {
  return axios.request({
    url: 'delete_trunk/' + id,
    method: 'delete',
    id: id
  })
}
// 树根
export const queryRootDetections = (params) => {
  return axios.request({
    url: 'roots',
    method: 'get',
    params: params
  })
}
export const getRootDetection = (id) => {
  return axios.request({
    url: 'root/'+ id,
    method: 'get',
  })
}

export const insertRoot = (data) => {
  return axios.request({
    url: 'insert_root',
    method: 'post',
    data: data
  })
}

export const updateRoot= (id, data) => {
  return axios.request({
    url: 'update_root/' + id,
    method: 'put',
    id: id,
    data: data
  })
}
export const deleteRoot = (id) => {
  return axios.request({
    url: 'delete_root/' + id,
    method: 'delete',
    id: id
  })
}
