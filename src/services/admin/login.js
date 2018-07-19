import request from 'utils/request'
// import { isProd } from 'utils'

// let proxy = '/someDir'
// let postProxy = '/postSomeDir'
// if (isProd()) {
//   // proxy = ''
//   postProxy = ''
// }
export async function login (params) {
  return request({
    url: `/login`,
    method: 'post',
    params
  })
}
