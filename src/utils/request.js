/* global window */
import axios from 'axios'
import { domain, isMock } from './config'
import co from 'co'
import db from 'utils/db'
import Cookie from './cookie'
import { Debug } from 'utils'
import { message } from 'antd'
import { login as loginService } from 'services/admin/common'
import mockData from 'mocks/mock.js'

const Qs = require('qs')
axios.defaults.withCredentials = false
Debug(`domain:${domain}`)

export const logout = () => {
  db.remove('token')
  db.remove('isRegister')
  db.remove('userId')
}

export const req = (options, loading = false) => {
  return co(requestWithLogin(options, loading))
}

export function deepCopy (source) {
  // let result = {}
  let result = Array.isArray(source) ? [] : {}
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      result[key] = typeof source[key] === 'object' && source[key] !== null ? deepCopy(source[key]) : source[key]
    }
  }
  return result
}

// 不用了
export function * requestWithLogin (options, loading = false) {
  let isLogin = false
  let token = Cookie.get('userToken')
  let resp = {}
  if (token) {
    isLogin = true
  } else {
    isLogin = yield login()
  }
  if (isLogin) {
    resp = yield request(options, loading)
    if (isNeedFreshCode(options.url, resp.result, resp.message)) {
      isLogin = yield login()
      Debug('> code need refresh ~')
      Debug(isLogin)
      if (isLogin) {
        resp = yield request(options, loading)
      }
    }
  }

  return resp
}

// 不用了
export function setSession (loginData) {
  db.set('token', loginData.usertoken)
  db.set('isRegister', !(loginData.notregister === 'true'))
  db.set('userId', loginData.user_id)
}

// 不用了
export function * login (options = {}) {
  logout()
  let openid = db.get('openid')

  try {
    let loginResp = yield loginService({ openid })

    if (loginResp.result === 'success') {
      setSession(loginResp.data)
      return true
    } else {
      throw new Error('用户登录失败！')
    }
  } catch (err) {
    console.log('err', err)
    message.error('登录失败！')
    return false
  }
}

const fetch = (options) => {
  let {
    headers,
    method = 'get',
    data,
    url
  } = options
  method = method.toLowerCase()
  let params = (method === 'get') && options.data || {}
  let baseURL = domain
  if (isMock && options.mock) {
    // baseURL = location.origin
    // delete options.mock
    return Promise.resolve({data: mockData[url]})
  }
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 20000,
    headers: headers
  })
  return instance({
    url,
    data,
    method,
    params,
    transformRequest: [(params) => {
      let ret = []
      for (let it in params) {
        let items = params[it] ? params[it] : ''
        items = typeof items === 'object' ? JSON.stringify(items) : items
        ret.push(`${encodeURIComponent(it)}=${encodeURIComponent(items)}&`)
      }
      return ret.join('')
    }],
    // paramsSerializer: function (params) {
    //   return Qs.stringify(params)
    // },
  })
}
export const baseParams = {
  originType: 'basicPlatform'
  // originType: 'official'
  // originType: 'miniprogram'
}

export const isParamsNeedToken = (url) => {
  return !/login|oauth/gi.test(url)
}

export const isNeedFreshCode = (url, result, message) => {
  return !/login/.test(url) && (result === 'fail' && message === 'token失效')
}

// options.data = Qs.stringify(options.params)
export default function request (options, loading = false) {
  console.log('request', options)
  let opts = deepCopy(options)
  opts.params = opts.params || {}
  if (isParamsNeedToken(opts.url)) {
    opts.params.usertoken = Cookie.get('userToken')
  }
  opts.params = {
    ...baseParams,
    ...opts.params
  }
  opts.headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  opts.data = opts.params
  // if (loading) Toast.loading('加载中...', 0)
  return fetch(opts).then((response) => {
    Debug('response success: ' + opts.url)
    Debug(response.data)
    // if (loading) Toast.hide()
    return Promise.resolve(response && response.data)
  }).catch((error) => {
    Debug('response fail: ' + opts.url)
    Debug(error)
    // if (loading) Toast.hide()
    let msg = error.message || '网络错误'
    message.error(msg)
    return Promise.reject(new Error(msg))
  })
}
