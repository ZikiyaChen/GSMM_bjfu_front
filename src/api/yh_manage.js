import axios from "@/libs/api.request";
//养护项目 措施
export const queryMeasures = (params) => {
  return axios.request({
    url: 'yh_measures',
    method: 'get',
    params: params
  })
}

export const AddMeasures = (data) => {
  return axios.request({
    url: 'insert_yh_measures',
    method: 'post',
    data: data
  })
}

export const updateYhMeasure = (id,data) => {
  return axios.request({
    url: 'update_yh_Measure/'+id,
    method: 'put',
    id: id,
    data: data
  })
}
export const deleteYhMeasure = (id) => {
  return axios.request({
    url: 'delete_yh_measure/'+id,
    method: 'delete',
    id: id
  })
}
//养护项目 处理方法
export const queryMethods = (params) => {
  return axios.request({
    url: 'yh_methods',
    method: 'get',
    params: params
  })
}

export const AddMethods = (data) => {
  return axios.request({
    url: 'insert_yh_methods',
    method: 'post',
    data: data
  })
}

export const updateYhMethod = (id,data) => {
  return axios.request({
    url: 'update_yh_methods/'+id,
    method: 'put',
    id: id,
    data: data
  })
}
export const deleteYhMethod = (id) => {
  return axios.request({
    url: 'delete_yh_method/'+id,
    method: 'delete',
    id: id
  })
}
