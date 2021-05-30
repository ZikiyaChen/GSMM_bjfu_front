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
    url: 'add_ge_analysis',
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

export const queryTreeBasicProperty = (params) => {
  return axios.request({
    url: 'query_basic_property',
    method: 'get',
    params: params
  })
}

//根据tree_code获取一棵树的基本信息
export const getOneTreeBaseInfo = (tree_code) => {
  return axios.request({
    url: 'get_one_tree_basic/'+ tree_code,
    method: 'get',
    tree_code: tree_code
  })
}
//科
export const queryFamilyTypes = (params) => {
  return axios.request({
    url: 'species_types',
    method: 'get',
    params: params
  })
}

export const postFamilyTypes = (data) => {
  return axios.request({
    url: 'species_types',
    method: 'post',
    data: data
  })
}
//属
export const queryGenusTypes = (params) => {
  return axios.request({
    url: 'genus_types',
    method: 'get',
    params: params
  })
}
export const postGenusTypes = (data) => {
  return axios.request({
    url: 'genus_types',
    method: 'post',
    data: data
  })
}
//种
export const queryClassTypes = (params) => {
  return axios.request({
    url: 'class_types',
    method: 'get',
    params: params
  })
}
export const postClassTypes = (data) => {
  return axios.request({
    url: 'class_types',
    method: 'post',
    data: data
  })
}
export const getBasic = (tree_code) => {
  return axios.request({
    url: 'basic/'+ tree_code,
    method: 'get',
    tree_code: tree_code
  })
}

export const postTjxmRecord = (data) =>{
  return axios.request({
    url: 'survey/'+data.t_id +'/tjxm_record',
    method: 'post',
    data: data
  })
}

export const queryTjxmRecord = (params) =>{
  return axios.request({
    url: 'survey/tjxm_records',
    method: 'get',
    params: params
  })
}

export const getNewGeAnalysis = (tree_code) => {
  return axios.request({
    url: 'get_new_ge_analysis/'+tree_code,
    method: 'get',
    tree_code: tree_code
  })
}

//修改操作基本信息等
export const updateBasic =(tree_code,data) =>{
  return axios.request({
    url: 'update_basic/'+tree_code,
    method: 'put',
    // method: 'POST',
    tree_code: tree_code,
    data: data
  })
}
export const updateDynamic =(id,data) =>{
  return axios.request({
    url: 'update_dynamic/'+id,
    method: 'put',
    id: id,
    data: data
  })
}
export const updateGeo =(id,data) =>{
  return axios.request({
    url: 'update_geo/'+id,
    method: 'put',
    id: id,
    data: data
  })
}

export const updatePic =(id,data) =>{
  return axios.request({
    url: 'update_pic/'+id,
    method: 'put',
    id: id,
    data: data
  })
}

export const updateBrand =(id,data) =>{
  return axios.request({
    url: 'update_brand/'+id,
    method: 'put',
    id: id,
    data: data
  })
}
export const updateTjxmRecord =(id,data) =>{
  return axios.request({
    url: 'update_tjxm_record/'+id,
    method: 'put',
    id: id,
    data: data
  })
}

export const getOneTjxmRecord =(t_id, type)=>{
  return axios.request({
    url: 'get/'+t_id+'/tjxm_record/'+type,
    method: 'get',
    t_id: t_id,
    type: type
  })
}
export const updateEnvironment =(id,data) =>{
  return axios.request({
    url: 'update_ge_analysis/'+id,
    method: 'put',
    id: id,
    data: data
  })
}
//传入tjxm_record 先删除提交tjxm,再删record
export const deleteTjxmRecord =(data) =>{
  return axios.request({
    url: 'delete_tjxm_and_tjxm_record',
    method: 'delete',
    data: data
  })
}

export const deleteOneTree =(tree_code) =>{
  return axios.request({
    url: 'delete_tree/'+tree_code,
    method: 'delete',
    tree_code:tree_code
  })
}


