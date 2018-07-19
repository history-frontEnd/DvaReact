import { routerRedux } from 'dva/router'
import { login, info } from 'services/login'

export default {
  namespace: 'wechatAuth',

  state: {},

  effects: {
    * login ({
      payload
    }, { put, call, select }) {
      console.log(payload)
      const res = yield call(login, payload)
      if (res.succ) {
        const infoRes = yield call(info)
        if (infoRes.succ && infoRes.data) {
          if (infoRes.data.status) {
            yield put(routerRedux.push('/statistics'))
          } else {
            yield put(routerRedux.push('/wechatAuth'))
          }
        }

        // const { locationQuery } = yield select(_ => _.app)
        // const { from } = locationQuery
        // yield put({ type: 'app/query' })
        // if (from && from !== '/login') {
        //   yield put(routerRedux.push(from))
        // } else {
        //   yield put(routerRedux.push('/authorizations'))
        // }
      } else {
        console.log('===== login fail ~')
      }
    }
  }
}
