import request from 'utils/request'

export async function getOauthString (params) {
  return request({
    url: `/getOauthString`,
    method: 'GET',
    params
  })
}

export async function unifiedUserLogin (params) {
  return request({
    url: `/unifiedUserLogin`,
    method: 'POST',
    params
  })
}

export async function getUser (params) {
  return request({
    url: `/userData/userByToken`,
    // url: `http://172.16.26.106:8061/unifiedUserLogin`,
    method: 'GET',
    params
  })
}
