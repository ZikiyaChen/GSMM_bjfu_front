import axios from "@/libs/api.request";


// export const UploadPicApi =   'http://localhost:5000/uploadpic'
export const UploadPicApi = 'http://8.140.170.84:35000/uploadpic'

export const DeletePic = (file_name) =>{
  return axios.request({
    url: 'delete_pic/'+file_name,
    method: 'delete',
    file_name: file_name
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
