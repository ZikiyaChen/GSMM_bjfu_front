import axios from "@/libs/api.request";

export const AddSpecies = (data) => {
  return axios.request({
    url: 'insert_species',
    method: 'post',
    data: data
  })
}


export const DeleteSpecies = (id) => {
  return axios.request({
    url: 'delete_species/'+id,
    method: 'delete',
    id: id
  })
}


export const UpdateSpecies = (id,data) => {
  return axios.request({
    url: 'update_species/'+id,
    method: 'put',
    id: id,
    data: data
  })
}


export const GetSpeciesById = (id) => {
  return axios.request({
    url: 'get_one_species_by_Id/'+id,
    method: 'get',
    id: id
  })
}

export const GetKe = () => {
  return axios.request({
    url: 'families',
    method: 'get'
  })
}

export const GetShu = (params) => {
  return axios.request({
    url: 'genus',
    method: 'get',
    params: params
  })
}

export const GetZhong = (params) => {
  return axios.request({
    url: 'names',
    method: 'get',
    params: params
  })
}



export const QuerySpecies = (params) => {
  return axios.request({
    url: 'query_species',
    method: 'get',
    params: params
  })
}
