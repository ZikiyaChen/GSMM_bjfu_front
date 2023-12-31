import axios from "@/libs/api.request";


// export const UploadPicApi =   'http://localhost:5000/uploadpic'
export const UploadPicApi =   'http://49.232.244.63:5005/uploadpic'

export const UploadImg = 'http://49.232.244.63:5005/upload_img'


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

// export const getPicApi = 'http://127.0.0.1:5000/get_pic/'

export const getPicApi = 'http://49.232.244.63:5005/get_pic/'
// export const getPicApi = 'http://49.232.244.63:8089/img/'
