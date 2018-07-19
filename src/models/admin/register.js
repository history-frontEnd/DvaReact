import modelExtend from 'dva-model-extend'
import { model } from './extend'
// import { routerRedux } from 'dva/router'
import { sendCode, register, register1 } from 'services/login'
import { message } from 'antd'

console.log('==> register')

export default modelExtend(model, {
  namespace: 'register',
  state: {
    step1: false,
    step2: false,
    step3: false,
    confirmDirty: false
  },
  reducers: {},
  effects: {
    * sendCode ({
      payload
    }, { put, call, select }) {
      const res = yield call(sendCode, payload)
      if (res.succ) {
        message.success('验证码已发送，请注意查收!')
      } else {
        message.error(res.msg || '请求失败', 10)
      }
    },
    * register ({
      payload
    }, { put, call, select }) {
      const res = yield call(register, payload)
      if (res.succ) {
        yield put({ type: 'app/tongbu' })
        yield put({ type: 'update', payload: {step1: false, step2: true, step3: false} })
      } else {
        message.error(res.msg || '请求失败', 10)
      }
    },
    * register1 ({
      payload
    }, { put, call, select }) {
      const res = yield call(register1, payload)
      if (res.succ) {
        yield put({ type: 'app/tongbu' })
        yield put({ type: 'update', payload: {step1: false, step2: false, step3: true} })
      } else {
        message.error(res.msg || '请求失败', 10)
      }
    }
  },
  subscriptions: {}
})
