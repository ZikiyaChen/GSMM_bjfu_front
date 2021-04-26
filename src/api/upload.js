import axios from "@/libs/api.request";

export const ShowPic = (file_name) => {
  return axios.request({
    url: 'http://127.0.0.1:5000/static/img/'+file_name,
    method: 'get',
    file_name: file_name
  })
}
