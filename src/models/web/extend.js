const model = {
  reducers: {
    update (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: '@@dva/UPDATE'
        })
      })
    }
  },
  effects: {
    * updateState ({ payload = {} }, { call, put }) {
      yield put({ type: 'update', payload })
    },
  }
}

module.exports = {model}
