import request from 'utils/request'

export async function list (data) {
  return request({
    url: '/api/account/web/v1/home/authorization',
    method: 'get',
    data
  })
}
