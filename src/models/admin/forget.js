import modelExtend from 'dva-model-extend'
import { model } from './extend'
import { sendCode, changePassword } from 'services/login'
import { isAuth } from 'utils'
import { message } from 'antd'
import { routerRedux } from 'dva/router'

export default modelExtend(model, {
  namespace: 'forget',
  state: {
    confirmDirty: false,
  },
  reducers: {},
  effects: {
    * sendCode ({
      payload
    }, { put, call, select }) {
      const res = yield call(sendCode, payload)
      if (res.succ) {
        message.success('验证码已发送，请注意查收!')
      }
    },
    * changePassword ({
      payload
    }, { call, put, take }) {
      const res = yield call(changePassword, payload)
      if (res.succ) {
        yield put({ type: 'app/tongbu' })
        yield take('TONGBU_END')
        if (isAuth()) {
          yield put(routerRedux.push('/statistics'))
        } else {
          yield put(routerRedux.push('/register'))
        }
      } else {
        message.error(res.msg || '请求失败', 10)
      }
    }
  },
  subscriptions: {}
})
