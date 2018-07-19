import request from 'utils/request'
// import { isProd } from 'utils'
//
// let proxy = '/someDir'
// let postProxy = '/postSomeDir'
// if (isProd()) {
//   proxy = ''
//   postProxy = ''
// }
export async function login (data) {
  return request({
  // url: `${proxy}/api/account/web/v1/auth/user`,
    method: 'get',
    data
  })
}
