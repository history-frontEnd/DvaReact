export let env = process.env.NODE_ENV

const domains = {
  test: 'http://172.16.0.58:8040/core',
  development: 'http://172.16.19.253:8061',
  production: 'https://api-saas.biosan.cn',
}

const dbPrefixes = {
  test: 'biosan.sass.h5.test.',
  development: 'biosan.sass.h5.dev.',
  production: 'biosan.sass.h5.prod.',
}

env = 'test'
// env = 'development'
// env = 'production'
/**
 * 开发设置
 **/
export const isMock = true // 开启mock功能，设为false时全局request中mock选项失效
export const isDebug = true
export const domain = domains[env]
export const dbPrefix = dbPrefixes[env]
export const isPord = env === 'production'
export const isDev = env === 'development'
export const isTest = env === 'test'
export const PAGESIZE = env === 'production' ? 50 : 20
export const isUnifiedLogin = false
/**
 * 统一登录平台设置
 **/
export const appid = '176bb33d479d'
export const secret = 310000
export const oauthUrl = 'http://172.16.0.58:8000/?oauth='

/**
 * 文本设置
 **/
export default {
  name: '博圣基础服务平台',
  prefix: '',
  footerText: '版权所有 © biosan',
  logoSrc: '//biosan-saas.oss-cn-beijing.aliyuncs.com/FD/common/logo.png',
  logoText: '基础服务平台'
}

/**
 * tips
 **/
console.log('--------------')
console.log(`> current env: ${env}`)
console.log('--------------')
