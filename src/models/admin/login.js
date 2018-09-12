import { routerRedux } from 'dva/router'
import { userLogin } from 'services/admin/login'

export default {
  namespace: 'login',
  state: {
    loginState: null
  },
  effects: {
    * submit ({ payload, }, { call, put, select }) {
      const data = yield call(userLogin, payload)
      if (data && data.result === 'success') {
        yield put(routerRedux.push('/dashboard'))
      }
    },
  },
  reducers: {}
}
