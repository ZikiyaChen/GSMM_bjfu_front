import axios from "@/libs/api.request";
// 树木检测信息
export const queryEReports = (params) => {
  return axios.request({
    url: 'eReports',
    method: 'get',
    params: params
  })
}

export const getFileBlob = (data) =>{
  return axios.request({
    url: 'fileBlob',
    method: 'POST',
    responseType: 'blob', // 必须指定为blob类型才能下载
    data: data
  })
}
