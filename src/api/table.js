import axios from "@/libs/api.request";

export const getTest = () => {
  return axios.request({ // 这里返回的是一个Promise，request方法传入一个配置对象，配置项可参考axios
    url: 'http://127.0.0.1:5000/test',
    method: 'get'
  })
}

export const AddBasicProperty = (data) => {
  return axios.request({
    url: 'http://127.0.0.1:5000/add_basic_property',
    method: 'post',
    data: data
  })
}

export const AddDynamicProperty = (data) => {
  return axios.request({
    url: 'http://127.0.0.1:5000/add_dynamic_property',
    method: 'post',
    data: data
  })
}

export const AddGeoProperty = (data) => {
  return axios.request({
    url: 'http://127.0.0.1:5000/add_geo_property',
    method: 'post',
    data: data
  })
}

export const AddPicRecord = (data) => {
  return axios.request({
    url: 'http://127.0.0.1:5000/add_pic_record',
    method: 'post',
    data: data
  })
}

export const AddTreeBrand = (data) => {
  return axios.request({
    url: 'http://127.0.0.1:5000/add_tree_brand',
    method: 'post',
    data: data
  })
}

export const AddGeAnalysis = (data) => {
  return axios.request({
    url: 'http://127.0.0.1:5000/add_ge_analysis',
    method: 'post',
    data: data
  })
}

export const AddGpAnalysis = (data) => {
  return axios.request({
    url: 'http://127.0.0.1:5000/add_gp_analysis',
    method: 'post',
    data: data
  })
}

export const AddStssAnalysis = (data) => {
  return axios.request({
    url: 'http://127.0.0.1:5000/add_stss_analysis',
    method: 'post',
    data: data
  })
}

export const AddFzbhAnalysis = (data) => {
  return axios.request({
    url: 'http://127.0.0.1:5000/add_fzbh_analysis',
    method: 'post',
    data: data
  })
}

export const AddqxkfDetect = (data) => {
  return axios.request({
    url: 'http://127.0.0.1:5000/add_qxkf_detect',
    method: 'post',
    data: data
  })
}

export const AddBchAnalysis = (data) => {
  return axios.request({
    url: 'http://127.0.0.1:5000/add_bch_analysis',
    method: 'post',
    data: data
  })
}
