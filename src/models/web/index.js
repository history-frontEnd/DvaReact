// import { routerRedux } from 'dva/router'
// import queryString from 'query-string'
// import config from 'utils/config'
export default {
  namespace: 'app',
  state: {
    pin: false,
    oss: {}
  },
  reducers: {
    updateState (state : Object, { payload }:{payload: Object}) {
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen((location) => {})
    },
    setup ({ dispatch }) {}
  }
}
