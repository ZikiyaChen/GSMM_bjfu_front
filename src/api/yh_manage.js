import axios from "@/libs/api.request";
// 养护项目 措施
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

export const updateYhMeasure = (id, data) => {
  return axios.request({
    url: 'update_yh_Measure/' + id,
    method: 'put',
    id: id,
    data: data
  })
}
export const deleteYhMeasure = (id) => {
  return axios.request({
    url: 'delete_yh_measure/' + id,
    method: 'delete',
    id: id
  })
}
// 养护项目 处理方法
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

export const updateYhMethod = (id, data) => {
  return axios.request({
    url: 'update_yh_methods/' + id,
    method: 'put',
    id: id,
    data: data
  })
}
export const deleteYhMethod = (id) => {
  return axios.request({
    url: 'delete_yh_method/' + id,
    method: 'delete',
    id: id
  })
}

// 新加的养护具体项目和处理方法的增删改查***********************
export const queryYhOptions = (params) => {
  return axios.request({
    url: 'yh_classify',
    method: 'get',
    params: params
  })
}

export const AddYhOptions = (data) => {
  return axios.request({
    url: 'insert_yh_classify',
    method: 'post',
    data: data
  })
}

export const updateYhOptions = (id, data) => {
  return axios.request({
    url: 'update_yh_classify/' + id,
    method: 'put',
    id: id,
    data: data
  })
}
export const deleteYhOptions = (id) => {
  return axios.request({
    url: 'delete_yh_classify/' + id,
    method: 'delete',
    id: id
  })
}

export const getCurrentWeather = () => {
  return axios.request({
    url: 'https://tianqiapi.com/api?version=v6&appid=91325957&appsecret=D2VFoOra',
    method: 'get'
  })
}
// yh_record

export const queryYhRecords = (params) => {
  return axios.request({
    url: 'yh_records',
    method: 'get',
    params: params
  })
}

// yh_allot 任务分配的工单
export const queryYhAllots = (params) => {
  return axios.request({
    url: 'yh_allots',
    method: 'get',
    params: params
  })
}

// 获取c列中的养护项目名称
export const getMaintenanceProjects = (maintenanceType) => {
  return axios.request({
    url: 'query_projects_quchong?yh_type=' + maintenanceType,
    method: 'get',
  })
}

// 获取病虫害名称
export const getPestName = () => {
  return axios.request({
    url: 'bch_names',
    method: 'get'
  })
}

export const insertRecordByTypeSelf = (type, data) => {
  return axios.request({
    url: '/insert_record_by_type_zizhu/' + type,
    method: 'post',
    data: data
  })
}

export const insertMaintenanceAllot = (data) => {
  return axios.request({
    url: '/insert_yh_allot',
    method: 'post',
    data: data
  })
}
