import request from 'utils/request'
import { isProd } from 'utils'

let proxy = '/someDir'
let postProxy = '/postSomeDir'
if (isProd()) {
  proxy = ''
  postProxy = ''
}

export async function list (data) {
  return request({
    url: `${proxy}/api/account/web/v1/marketing/records`,
    method: 'get',
    data
  })
}
export async function join (data) {
  return request({
    url: `${postProxy}/api/account/web/v1/marketing/record/:id`,
    method: 'patch',
    data
  })
}
export async function cancelJoin (data) {
  return request({
    // todo 取消参加接口需要修改
    url: `${postProxy}/api/account/web/v1/marketing/record/:id`,
    method: 'delete',
    data
  })
}
export async function detail (data) {
  return request({
    // url: `/qawuyintest/api/account/web/v1/marketing/record/:id`,
    url: `${proxy}/api/account/web/v1/marketing/record/:id`,
    method: 'get',
    data
  })
}
