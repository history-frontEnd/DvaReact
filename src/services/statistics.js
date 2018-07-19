import request from 'utils/request'
import { isProd } from 'utils'

let proxy = '/someDir'
// let postProxy = '/postSomeDir'
if (isProd()) {
  proxy = ''
  // postProxy = ''
}

export async function section (data) {
  return request({
    url: `${proxy}/api/account/web/v1/statistics/section`,
    method: 'get',
    data
  })
}

export async function summary (data) {
  return request({
    url: `${proxy}/api/account/web/v1/statistics/summary`,
    method: 'get',
    data
  })
}
