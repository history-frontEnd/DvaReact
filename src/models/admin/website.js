import modelExtend from 'dva-model-extend'
import { model } from './extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { login } from '../../services/admin/login'
// const MESSAGE = message

export default modelExtend(model, {
  namespace: 'website',
  state: {
    isHideLogin: false,
    isHideRegister: true,
    confirmDirty: false
  },
  reducers: {},
  subscriptions: {},
  effects: {
    * login ({
      payload
    }, { put, call, select, take }) {
      let resp = yield call(login, {
        mobile: payload.userMobile,
        pwd: payload.userPassword
      })
      let {code, data} = resp
      console.log(resp)
      if (code === 200) {
        // token
        localStorage.setItem('token', data)
        yield put(routerRedux.push('/promos'))
      } else {
        message.error(resp.message)
      }
    }
  }
})
