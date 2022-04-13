import axios from "@/libs/api.request";
import params from "@/view/argu-page/params";


// // 行政区域查询  https://lbs.amap.com/api/webservice/guide/api/district
// export const GetDistrict = (params) =>{
//   return axios.request({
//     url: 'https://restapi.amap.com/v3/config/amap/district?key=b5fd4c001824748a28e447e2e24790df&keywords=济南&subdistrict=2&extensions=base',
//     method: 'post',
//   })
// }
// export const GetDistrict = (data) => {
//   return axios.request({
//     url:'districtsss',
//     method:'get',
//     data:data
//   })
// }
export const AddPolygonPath = (data)=> {
  return axios.request({
    url: 'addPolygonPath',
    method: 'post',
    data: data,
  })
}

export const queryPolygonName = (params) => {
  return axios.request({
    url: 'polygon_names',
    method: 'get',
    params:params
  })
}

