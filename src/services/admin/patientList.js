import request from 'utils/request'

export async function getPatientList (params) {
  return request({
    url: `/case/pagelist`,
    method: 'get',
    params
  })
}

export async function getPatientDetails (params) {
  return request({
    url: `/case/detail`,
    method: 'get',
    params
  })
}

export async function savePatientDetails (params) {
  return request({
    url: `/case/submit`,
    method: 'post',
    params
  })
}

export async function getImgList (params) {
  return request({
    url: `/image/list`,
    method: 'post',
    params
  })
}
