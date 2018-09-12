import request, { req } from 'utils/request'

export async function userLogin (params) {
  return request({
    mock: true,
    url: `/login`,
    method: 'POST',
    params
  })
}
