import modelExtend from 'dva-model-extend'
import { pageModel } from './extend'
import { list } from 'services/authorizations'

console.log('==> authorizations')

export default modelExtend(pageModel, {
  namespace: 'authorizations',
  state: {
    list: []
  },
  reducers: {},
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/authorizations') {
          dispatch({ type: 'query' })
        }
      })
    },
  },
  effects: {
    * query ({ payload = {} }, { call, put }) {
      const res = yield call(list, payload)
      if (res.succ) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: res.data,
          },
        })
      }
    }
  }
})
