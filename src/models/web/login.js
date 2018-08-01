import modelExtend from 'dva-model-extend'
import {model} from './extend'
import {routerRedux} from 'dva/router'
import {login} from 'services/web/login'
import {message} from 'antd'

export default modelExtend(model, {
  namespace: 'login',
  state: {},
  reducers: {},
  subscriptions: {},
  effects: {
    * login ({payload}, {put, call, select, take}) {
      if (!payload.userMobile || !payload.userMobile.length) {
        message.error('手机号不能为空~')
        return
      }
      if (!payload.userPassword || !payload.userPassword.length) {
        message.error('密码不能为空~')
        return
      }
      const res = yield call(login, {
        mobile: payload.userMobile,
        pwd: payload.userPassword
      })
      if (res.message === 'SUCCESS') {
        localStorage.setItem('token', res.data)
        yield put(routerRedux.push('/uploader'))
      } else {
        message.error(res.message || '登录失败~')
      }
    }
  }
})
