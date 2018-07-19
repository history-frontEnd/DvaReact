/* global window */
import axios from 'axios'
import Qs from 'qs'
import cloneDeep from 'lodash/cloneDeep'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { host } from './config'
axios.defaults.withCredentials = true

const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
  } = options

  const cloneData = cloneDeep(data)

  try {
    let domain = host
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domain = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domain.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    message.error(e.message)
  }

  switch (method.toLowerCase()) {
    // case 'get':
    //   return axios.get(url, {
    //     params: cloneData,
    //   })
    case 'get':
      return axios.get(`${url}?${cloneData}`)
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      })
    case 'post':
      return axios.post(url, cloneData)
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}

export default function request (options) {
  let reg = /login/gi
  options.params = options.params || {}
  if (!reg.test(options.url)) {
    options.params.token = localStorage.getItem('token')
  }
  options.data = Qs.stringify(options.params)
  options.headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  return fetch(options).then((response) => {
    // const { statusText, status } = response
    if (response.data && (response.data.code === 300)) {
      throw new Error('300')
    }
    return Promise.resolve(response && response.data)
  }).catch((error) => {
    const { response } = error
    let msg
    let statusCode
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      msg = data.msg || data.message || statusText
    } else {
      statusCode = 600
      msg = error.message || '网络错误'
    }
    if (error && error.message === '300') {
      location.href = '/'
    }
    // console.log(`${statusCode}-${msg}`)
    // return Promise.reject({ success: false, statusCode, message: msg })
    return Promise.reject(new Error(`${statusCode}-${msg}`))
  })
}
