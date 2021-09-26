import axios from "@/libs/api.request";

// export const ShowPic = (file_name) => {
//   return axios.request({
//     url: 'http://127.0.0.1:5000/static/img/'+file_name,
//     method: 'get',
//     file_name: file_name
//   })
// }
export const UploadPicAPI = () =>{
  return axios.request({
    url: 'uploadpic',
    method: 'post'
  })
}

export const ShowPic = (file_name) => {
  return axios.request({
    url: 'static/img/'+file_name,
    method: 'get',
    file_name: file_name
  })
}
export const ProduceQrcode = (tree_code)=>{
  return axios.request({
    url: 'create_qrcode/'+tree_code,
    method: 'post',
    tree_code: tree_code
  })
}

export const ShowQRcode = (tree_code) =>{
  return axios.request({
    url: 'static/qrcode/'+ tree_code,
    method: 'get',
    tree_code: tree_code
  })
}
