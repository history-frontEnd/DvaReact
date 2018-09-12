const mock = {
  'POST /api/account/web/v1/auth/user': {
    'succ': true,
    'data': [],
    'code': '',
    'msg': '',
    'time': 1509445822
  },
  // GET POST 可省略
  '/api/users/1': { id: 1 },

  // Forward 到另一个服务器
  'GET /assets/*': 'https://assets.online/',

  // Forward 到另一个服务器，并指定子路径
  // 请求 /someDir/0.0.50/index.css 会被代理到 https://g.alicdn.com/tb-page/taobao-home, 实际返回 https://g.alicdn.com/tb-page/taobao-home/0.0.50/index.css
  'GET /someDir/(.*)': 'http://172.16.0.97:8000',
  'POST /postSomeDir/(.*)': 'http://172.16.0.97:8000',
  'PUT /postSomeDir/(.*)': 'http://172.16.0.97:8000',
  'DELETE /postSomeDir/(.*)': 'http://172.16.0.97:8000',
  'PATCH /postSomeDir/(.*)': 'http://172.16.0.97:8000'
}
require('fs').readdirSync(require('path').join(__dirname + '/src/mocks/admin/')).forEach(function (file) {
  if (/^\.(js|json)$/.test(require('path').extname(file))) {
    Object.assign(mock, require('./src/mocks/admin/' + file))
  }
})
module.exports = mock
