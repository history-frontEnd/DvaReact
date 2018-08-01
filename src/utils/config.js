import { isProd } from './index'
let host = isProd() ? `//172.16.0.97:8000` : '//172.16.0.97:8000'

module.exports = {
  name: '先心',
  prefix: 'heart',
  footerText: 'heart © 2017',
  logo: '/img/logo.b768234.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  adminIndex: '/statistics',
  CORS: [],
  openPages: ['/website', '/forget', '/register', '/'],
  host,
  api: {},
}
