import { request } from 'utils'

export async function query (params) {
  return request('/api/dashboard', {
    method: 'get',
    data: params,
  })
}
