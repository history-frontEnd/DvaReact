import request from 'utils/request'
export async function login (params) {
  return request({
    url: `/login`,
    method: 'POST',
    params
  })
}
export async function upload (params) {
  return request({
    formdata: true,
    url: params.action,
    method: 'POST',
    params: {
      file: params.file
    }
  })
}
export async function getImages (imageIds) {
  return request({
    url: '/image/list',
    method: 'POST',
    params: {
      ids: imageIds
    },
  })
}
export async function getImage (id) {
  return request({
    url: '/image/get',
    method: 'GET',
    params: {
      id
    }
  })
}
export async function submitCase (params) {
  return request({
    url: '/case/msubmit',
    method: 'POST',
    params: {
      images: params.images.join(',')
    },
  })
}

export async function getOssPolicy () {
  return request({
    url: '/image/policy',
    method: 'GET'
  })
}

export async function addImage (params) {
  return request({
    url: '/image/add',
    method: 'POST',
    params
  })
}
